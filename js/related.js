/* Renders "Read next" with the 3 following posts in the series (wrapping around). */
(function () {
  'use strict';
  var host = document.getElementById('relatedPosts');
  if (!host || !window.POSTS || !window.POSTS.length) return;

  var list = window.POSTS;
  var current = host.getAttribute('data-current');
  var idx = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].n === current) { idx = i; break; }
  }

  var picks = [];
  for (var k = 1; k <= 3; k++) picks.push(list[(idx + k) % list.length]);

  var arrow = '<svg class="ext-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/></svg>';

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  var html = '<h2 class="related-title" data-bn="আরও পড়ুন">Read next</h2><div class="related-grid">';
  picks.forEach(function (p) {
    html +=
      '<a class="related-card" href="' + p.slug + '.html">' +
        '<span class="related-num">' + p.n + '</span>' +
        '<span class="related-cat" data-bn="' + esc(p.cat_bn) + '">' + esc(p.cat_en) + '</span>' +
        '<span class="related-name">' +
          '<span data-bn="' + esc(p.title_bn) + '">' + esc(p.title_en) + '</span> ' + arrow +
        '</span>' +
      '</a>';
  });
  html += '</div>';
  host.innerHTML = html;
})();
