/* Lightweight EN/BN switcher.
 *
 * Mark translatable content in the HTML:
 *   <p data-bn="বাংলা লেখা">English text</p>
 *   <p data-bn="..." data-i18n-html>English <strong>rich</strong> text</p>
 *   <a data-bn-aria-label="...">  (any attribute: data-bn-<attr>)
 *
 * The control is <button class="lang-toggle"> holding a <span data-lang-label>
 * that shows the language you will switch TO. One click flips.
 *
 * English is whatever is already in the document, so only Bangla is stored.
 * Choice is remembered in localStorage. Default is English.
 * Terms with no data-bn (tool names, brands, proper nouns) are never touched.
 */
(function () {
  'use strict';

  var KEY = 'pf-lang';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
  }
  function current() {
    return stored() === 'bn' ? 'bn' : 'en';
  }

  function apply(lang) {
    var bn = lang === 'bn';
    root.lang = bn ? 'bn' : 'en';
    root.classList.toggle('lang-bn', bn);

    var nodes = document.querySelectorAll('[data-bn]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var isHtml = el.hasAttribute('data-i18n-html');
      if (el.__en == null) el.__en = isHtml ? el.innerHTML : el.textContent;
      var next = bn ? el.getAttribute('data-bn') : el.__en;
      if (isHtml) el.innerHTML = next; else el.textContent = next;
    }

    var all = document.querySelectorAll('*');
    for (var j = 0; j < all.length; j++) {
      var node = all[j];
      if (!node.attributes) continue;
      for (var a = 0; a < node.attributes.length; a++) {
        var name = node.attributes[a].name;
        if (name.indexOf('data-bn-') !== 0) continue;
        var attr = name.slice('data-bn-'.length);
        var cacheKey = '__en_' + attr;
        if (node[cacheKey] == null) node[cacheKey] = node.getAttribute(attr) || '';
        node.setAttribute(attr, bn ? node.getAttribute(name) : node[cacheKey]);
      }
    }

    var labels = document.querySelectorAll('[data-lang-label]');
    for (var k = 0; k < labels.length; k++) {
      labels[k].textContent = bn ? 'English' : 'বাংলা';
    }
    var toggles = document.querySelectorAll('.lang-toggle');
    for (var t = 0; t < toggles.length; t++) {
      toggles[t].setAttribute('aria-label', bn ? 'Switch to English' : 'Switch to Bangla');
    }
  }

  function flip() {
    var next = current() === 'bn' ? 'en' : 'bn';
    remember(next);
    apply(next);
  }

  function wire() {
    var btns = document.querySelectorAll('.lang-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (e) { e.preventDefault(); flip(); });
    }
  }

  apply(current());
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wire);
  } else {
    wire();
  }
})();
