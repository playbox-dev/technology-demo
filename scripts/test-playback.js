#!/usr/bin/env node
'use strict';

// Exercise the production controller with deterministic media events. The real
// scene data/clip bounds are loaded; only DOM, decoding, and drawing are faked.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const src = path.join(__dirname, '..', 'src');
const read = file => fs.readFileSync(path.join(src, file), 'utf8');
const expectedOrder = ['football', 'racing', 'spaces', 'work', 'retail'];

class Element {
  constructor(tagName = 'DIV') {
    this.tagName = tagName;
    this.dataset = {};
    this.attributes = new Map();
    this.listeners = new Map();
    this.styles = new Map();
    this.style = { setProperty: (key, value) => this.styles.set(key, value) };
    this.classList = { toggle() {} };
    this.firstChild = { textContent: '' };
    this.isConnected = true;
  }
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, []);
    this.listeners.get(type).push(callback);
  }
  emit(type) { for (const callback of this.listeners.get(type) || []) callback({ type, target: this }); }
  setAttribute(key, value) { this.attributes.set(key, String(value)); }
  getAttribute(key) { return this.attributes.get(key); }
  toggleAttribute(key, value) { if (value) this.setAttribute(key, ''); else this.attributes.delete(key); }
  getBoundingClientRect() { return { width: 400, height: 225 }; }
  getContext() { return { clearRect() {}, drawImage() {} }; }
}

function harness({ frameClock = true, reducedMotion = false, scene = 'football' } = {}) {
  const root = new Element();
  const elements = new Map();
  const get = selector => {
    if (!elements.has(selector)) elements.set(selector, new Element());
    return elements.get(selector);
  };
  const tabs = [...read('index.html').matchAll(/<button\b[^>]*data-scene="([^"]+)"/g)]
    .map(([, id]) => Object.assign(new Element('BUTTON'), { dataset: { scene: id } }));
  const workSearch = Array.from({ length: 3 }, () => new Element('BUTTON'));
  const canvases = Array.from({ length: 3 }, () => new Element('CANVAS'));
  root.querySelector = get;
  root.querySelectorAll = selector => {
    if (selector.includes('[data-scene]')) return tabs;
    if (selector === '.work-search button') return workSearch;
    if (selector.endsWith(' canvas')) return canvases;
    return [];
  };
  const video = get('#source-video');
  Object.assign(video, { paused: true, ended: false, seeking: false, readyState: 0,
    currentTime: 0, videoWidth: 1280, videoHeight: 720, playCalls: 0, loads: 0 });
  video.pause = () => { video.paused = true; video.emit('pause'); };
  video.play = () => {
    video.playCalls++;
    video.paused = false;
    video.emit('playing');
    return Promise.resolve();
  };
  video.load = () => {
    video.loads++;
    Object.assign(video, { currentTime: 0, readyState: 0, paused: true, ended: false, seeking: false });
  };
  const frames = new Map();
  let frameId = 0;
  if (frameClock) {
    video.requestVideoFrameCallback = callback => { frames.set(++frameId, callback); return frameId; };
    video.cancelVideoFrameCallback = id => frames.delete(id);
  }
  let rafQueue = [], now = 0;
  const document = Object.assign(new Element(), {
    hidden: false, getElementById: () => root, createElement: tag => new Element(tag.toUpperCase())
  });
  const location = { hash: '#' + scene };
  const context = vm.createContext({
    document, location, window: new Element(),
    history: { replaceState: (_state, _title, hash) => { location.hash = hash; } },
    matchMedia: () => ({ matches: reducedMotion }),
    ResizeObserver: class { observe() {} },
    requestAnimationFrame: callback => { rafQueue.push(callback); }
  });
  const sourceFiles = [...read('index.html').matchAll(/<script src="\.\/([^"]+)"/g)].map(match => match[1]);
  for (const file of sourceFiles.slice(0, sourceFiles.indexOf('app.js'))) {
    vm.runInContext(read(file), context, { filename: file });
  }
  const models = vm.runInContext('PB5Aligned', context);
  for (const [id, model] of Object.entries(models)) {
    model.render = (element, time) => { element.lastRender = { id, time }; };
    model.at = () => ({ people: [] });
  }
  vm.runInContext(read('app.js'), context, { filename: 'app.js' });
  return {
    root, video, tabs, document, get, models, frames,
    get scene() { return root.dataset.scene; },
    get progress() { return Number(root.dataset.progress); },
    ready() {
      video.readyState = 4;
      video.emit('loadedmetadata');
      video.ended = false;
      video.emit('seeked');
      video.emit('canplay');
    },
    select(id) { tabs.find(tab => tab.dataset.scene === id).emit('click'); },
    toggle() { get('#play-toggle').emit('click'); },
    frame(time) {
      const entry = frames.entries().next().value;
      assert.ok(entry, 'a video frame must be scheduled');
      frames.delete(entry[0]);
      video.currentTime = time;
      entry[1](now += 40, { mediaTime: time });
    },
    tick(time) {
      if (time !== undefined) video.currentTime = time;
      const pending = rafQueue;
      rafQueue = [];
      for (const callback of pending) callback(now += 40);
    },
    end() { video.ended = true; video.paused = true; video.emit('ended'); },
    visible(value) { document.hidden = !value; document.emit('visibilitychange'); }
  };
}

test('each clip advances in visible tab order and wraps once, even with a trailing ended event', () => {
  const h = harness();
  assert.deepEqual(h.tabs.map(tab => tab.dataset.scene), expectedOrder);
  for (let i = 0; i < expectedOrder.length; i++) {
    assert.equal(h.scene, expectedOrder[i]);
    h.ready();
    assert.equal(h.video.paused, false);
    const previousLoads = h.video.loads;
    h.frame(h.models[h.scene].end);
    const next = expectedOrder[(i + 1) % expectedOrder.length];
    assert.equal(h.scene, next);
    assert.equal(h.progress, 0, 'new scene must start with an empty progress bar');
    assert.equal(h.video.readyState, 0, 'advance must wait for the next source to load');
    h.video.emit('ended');
    assert.equal(h.scene, next, 'old ended event must not skip the newly selected clip');
    assert.equal(h.video.loads, previousLoads + 1);
  }
});

test('natural media end also advances when the media reports paused, with no final frame callback', () => {
  const h = harness();
  h.ready();
  h.end();
  assert.equal(h.scene, 'racing');
  h.end();
  assert.equal(h.scene, 'racing', 'duplicate end while loading cannot advance');
});

test('pause freezes progress/model and manual selection preserves the pause until explicit play', () => {
  const h = harness();
  h.ready();
  h.frame(2.4);
  h.toggle();
  const snapshot = [h.progress, h.video.currentTime, h.get('#main-model').lastRender.time];
  h.frame(2.4);
  assert.deepEqual([h.progress, h.video.currentTime, h.get('#main-model').lastRender.time], snapshot);
  h.select('spaces');
  assert.equal(h.progress, 0);
  h.ready();
  assert.equal(h.video.paused, true);
  assert.equal(h.video.currentTime, h.models.spaces.start);
  h.toggle();
  assert.equal(h.video.paused, false);
  h.frame(h.models.spaces.start + 1);
  assert.ok(h.progress > 0);
});

test('progress uses clip-relative time and the aligned model interval, including nonzero starts', () => {
  const h = harness({ scene: 'racing' });
  h.ready();
  const { start, end } = h.models.racing;
  h.frame(start + (end - start) / 2);
  assert.equal(h.progress, 0.5);
  assert.equal(h.get('#scene-progress').getAttribute('aria-valuenow'), '50');
  assert.equal(h.tabs[1].styles.get('--scene-progress'), '0.5000');
  h.select('work');
  h.ready();
  const work = h.models.work;
  h.frame(work.start + (work.end - work.start) / 2);
  assert.equal(h.progress, 0.5, 'work uses its aligned clip end rather than the older data.js interval');
});

test('canceled frame callbacks cannot paint a later scene or interfere with its frame request', () => {
  const h = harness();
  h.ready();
  const staleCallback = h.frames.values().next().value;
  h.select('racing');
  h.ready();
  const before = [h.scene, h.progress, h.get('#main-model').lastRender.time];
  staleCallback(100, { mediaTime: 4.8 });
  assert.deepEqual([h.scene, h.progress, h.get('#main-model').lastRender.time], before);
  assert.equal(h.frames.size, 1, 'the new scene keeps exactly one frame request');
  h.frame(h.models.racing.start + 1);
  assert.ok(h.progress > 0);
  assert.equal(h.frames.size, 1);
});

test('the animation-frame fallback advances through all scenes and honors pause', () => {
  const h = harness({ frameClock: false });
  h.ready();
  h.tick(2.4);
  assert.equal(h.progress, 0.5);
  h.toggle();
  h.tick();
  assert.equal(h.progress, 0.5);
  assert.equal(h.scene, 'football');
  h.toggle();
  for (let i = 0; i < expectedOrder.length; i++) {
    h.tick(h.models[h.scene].end);
    assert.equal(h.scene, expectedOrder[(i + 1) % expectedOrder.length]);
    assert.equal(h.progress, 0);
    h.ready();
  }
});

test('reduced motion waits for explicit play, and page visibility preserves pause intent', () => {
  const h = harness({ reducedMotion: true });
  h.ready();
  assert.equal(h.video.paused, true);
  assert.equal(h.video.playCalls, 0);
  h.visible(false);
  h.visible(true);
  assert.equal(h.video.playCalls, 0);
  h.toggle();
  h.frame(1.2);
  const before = h.progress;
  h.visible(false);
  assert.equal(h.video.paused, true);
  assert.equal(h.progress, before);
  h.visible(true);
  assert.equal(h.video.paused, false);
  h.toggle();
  h.visible(false);
  h.visible(true);
  assert.equal(h.video.paused, true, 'manual pause survives leaving and returning to the page');
});

test('loading failure freezes the selection and retry retains the user playback preference', () => {
  const h = harness();
  h.ready();
  h.toggle();
  h.select('retail');
  h.video.emit('error');
  h.end();
  assert.equal(h.scene, 'retail');
  assert.equal(h.progress, 0);
  assert.equal(h.get('#play-toggle').disabled, true);
  h.get('.retry').emit('click');
  h.ready();
  assert.equal(h.scene, 'retail');
  assert.equal(h.video.paused, true);
});
