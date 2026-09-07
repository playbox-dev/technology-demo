(() => {
  'use strict';
  const root = document.getElementById('pb-five');
  if (!root) return;

  const header = root.querySelector('.section-header');
  const rule = header?.querySelector('.dot-rule');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (header && rule) {
    header.classList.add('has-section-motion');
    const reveal = () => header.classList.add('is-visible');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      reveal();
    } else {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      }, { threshold: 0.05 });
      observer.observe(rule);
      reducedMotion.addEventListener('change', event => {
        if (event.matches) {
          reveal();
          observer.disconnect();
        }
      });
    }
  }

  // The parent receives only this public layout measurement, never page data.
  if (window.parent === window) return;
  let parentOrigin = '*';
  try {
    const referrer = new URL(document.referrer);
    if (referrer.protocol === 'https:' || referrer.protocol === 'http:') {
      parentOrigin = referrer.origin;
    }
  } catch { /* A referrer can be absent in an embedded page. */ }
  let scheduled = false;
  let forceNext = false;
  let previousHeight = -1;
  function reportSize(force = false) {
    forceNext ||= force;
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      const height = Math.ceil(root.getBoundingClientRect().height);
      const force = forceNext;
      forceNext = false;
      if (!Number.isFinite(height) || height <= 0 || (!force && height === previousHeight)) return;
      previousHeight = height;
      window.parent.postMessage({ type: 'playbox-technology:size', height }, parentOrigin);
    });
  }
  window.addEventListener('message', event => {
    if (event.source !== window.parent || event.data?.type !== 'playbox-technology:request-size') return;
    if (parentOrigin !== '*' && event.origin !== parentOrigin) return;
    reportSize(true);
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => reportSize()).observe(root);
  window.addEventListener('resize', () => reportSize());
  window.addEventListener('load', () => reportSize(true), { once: true });
  document.fonts?.ready.then(() => reportSize());
  reportSize(true);
})();
