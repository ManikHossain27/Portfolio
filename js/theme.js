/* Dark / light theme switch.
 *
 * A tiny bootstrap script in <head> sets data-theme before first paint (no flash).
 * This file wires the .theme-toggle button and keeps the choice in localStorage.
 * With no stored choice, the OS preference is followed live.
 */
(function () {
  'use strict';

  var KEY = 'pf-theme';
  var root = document.documentElement;

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) { return null; }
  }
  function remember(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }
  function systemPref() {
    try {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch (e) { return 'dark'; }
  }
  function current() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme) {
    var light = theme === 'light';
    root.setAttribute('data-theme', light ? 'light' : 'dark');
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      btns[i].setAttribute('aria-pressed', String(light));
    }
  }

  apply(stored() || root.getAttribute('data-theme') || systemPref());

  function wire() {
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) {
        e.preventDefault();
        var next = current() === 'light' ? 'dark' : 'light';
        remember(next);
        apply(next);
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }

  try {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function (e) {
      if (!stored()) apply(e.matches ? 'light' : 'dark');
    });
  } catch (e) {}
})();
