/* Install as Studio page custom code, after the page markup. */
(() => {
  'use strict';
  const ORIGIN = 'https://playbox-dev.github.io';
  const SIZE = 'playbox-technology:size';
  const REQUEST = 'playbox-technology:request-size';
  const KEY = '__playboxTechnologyEmbedResize';
  if (window[KEY]) {
    window[KEY].refresh();
    return;
  }
  const watched = new WeakSet();
  let scanScheduled = false;

  function isDemoFrame(frame) {
    if (!(frame instanceof HTMLIFrameElement) || !frame.closest('#technology')) return false;
    try {
      const url = new URL(frame.getAttribute('src'), document.baseURI);
      return url.origin === ORIGIN && (url.pathname === '/technology-demo/' || url.pathname === '/technology-demo/index.html');
    } catch {
      return false;
    }
  }
  function frames() {
    return Array.from(document.querySelectorAll('#technology iframe')).filter(isDemoFrame);
  }
  function requestSize(frame) {
    if (isDemoFrame(frame)) frame.contentWindow?.postMessage({ type: REQUEST }, ORIGIN);
  }
  function refresh() {
    for (const frame of frames()) {
      if (!watched.has(frame)) {
        watched.add(frame);
        frame.addEventListener('load', () => requestSize(frame));
      }
      requestSize(frame);
    }
  }
  function scheduleRefresh() {
    if (scanScheduled) return;
    scanScheduled = true;
    requestAnimationFrame(() => {
      scanScheduled = false;
      refresh();
    });
  }

  window.addEventListener('message', event => {
    const data = event.data;
    if (event.origin !== ORIGIN || data?.type !== SIZE || typeof data.height !== 'number' || !Number.isFinite(data.height) || data.height < 100 || data.height > 5000) return;
    const frame = frames().find(candidate => candidate.contentWindow === event.source);
    if (!frame) return;
    const height = `${Math.ceil(data.height)}px`;
    // Only the native embed wrapper owns this fixed height; never resize the section.
    const wrapper = frame.parentElement;
    const targets = wrapper?.matches('div.frame.sd') && wrapper.closest('#technology') ? [wrapper, frame] : [frame];
    for (const target of targets) {
      if (target.style.getPropertyValue('height') !== height || target.style.getPropertyPriority('height') !== 'important') {
        target.style.setProperty('height', height, 'important');
      }
    }
  });
  window.addEventListener('pageshow', scheduleRefresh);
  window.addEventListener('resize', scheduleRefresh);
  const observer = new MutationObserver(scheduleRefresh);
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
  window[KEY] = { refresh };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();
})();
