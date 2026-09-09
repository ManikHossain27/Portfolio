/* Resume download feedback.
 *
 * The PDF can take a moment to fetch, so instead of a silent link we fetch it
 * ourselves with a progress toast, then hand the file to the browser to save.
 * If anything fails we fall back to a plain navigation so the user still gets it.
 */
(function () {
  'use strict';

  var FILE = 'Resume-Manik-Hossain.pdf';
  var RE = /Resume-Manik-Hossain\.pdf($|[?#])/i;
  var busy = false;

  function el() {
    var t = document.getElementById('resumeToast');
    if (t) return t;
    t = document.createElement('div');
    t.id = 'resumeToast';
    t.className = 'resume-toast';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    t.innerHTML =
      '<div class="resume-toast-row">' +
        '<span class="resume-spinner" aria-hidden="true"></span>' +
        '<span class="resume-toast-msg"></span>' +
        '<span class="resume-toast-pct"></span>' +
      '</div>' +
      '<div class="resume-toast-track"><div class="resume-toast-bar"></div></div>';
    document.body.appendChild(t);
    return t;
  }

  function set(msg, pct, state) {
    var t = el();
    t.classList.add('is-visible');
    t.classList.remove('is-error', 'is-done', 'is-indeterminate');
    if (state) t.classList.add(state);
    t.querySelector('.resume-toast-msg').textContent = msg;
    var pctEl = t.querySelector('.resume-toast-pct');
    var bar = t.querySelector('.resume-toast-bar');
    if (pct == null) {
      t.classList.add('is-indeterminate');
      pctEl.textContent = '';
    } else {
      pctEl.textContent = Math.round(pct) + '%';
      bar.style.width = Math.max(0, Math.min(100, pct)) + '%';
    }
  }

  function hide(delay) {
    setTimeout(function () {
      var t = document.getElementById('resumeToast');
      if (t) t.classList.remove('is-visible');
    }, delay || 0);
  }

  function save(blob) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = FILE;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 5000);
  }

  function finish(btn) {
    busy = false;
    if (btn) btn.classList.remove('is-loading');
  }

  function run(href, btn) {
    if (busy) return;
    busy = true;
    if (btn) btn.classList.add('is-loading');
    set('Preparing resume…', null);

    if (typeof fetch !== 'function') {
      window.location.href = href;
      finish(btn);
      hide(400);
      return;
    }

    fetch(href).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var total = parseInt(res.headers.get('Content-Length'), 10) || 0;
      if (!res.body || !res.body.getReader || !total) return res.blob();

      var reader = res.body.getReader();
      var chunks = [];
      var got = 0;
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: 'application/pdf' });
          chunks.push(r.value);
          got += r.value.length;
          set('Downloading resume…', (got / total) * 100);
          return pump();
        });
      })();
    }).then(function (blob) {
      set('Saved to your device', 100, 'is-done');
      save(blob);
      finish(btn);
      hide(1600);
    }).catch(function () {
      set('Opening resume…', null, 'is-error');
      finish(btn);
      setTimeout(function () { window.location.href = href; }, 500);
      hide(1200);
    });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || !RE.test(a.getAttribute('href') || '')) return;
    e.preventDefault();
    run(a.href, a);
  });
})();
