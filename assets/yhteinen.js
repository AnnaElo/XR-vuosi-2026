// Kaikkien sivujen yhteinen koodi: teemasäädin, aineiston lataus ja apufunktiot.
// Ladataan <head>-osassa ilman deferiä, jotta valittu teema on käytössä ennen ensimmäistä piirtoa.
var XR = (function () {
  'use strict';
  var root = document.documentElement;

  // Teemasäädin: automaattinen (järjestelmän asetus) → vaalea → tumma. Valinta muistetaan selaimessa.
  var SCHEMES = ['auto', 'light', 'dark'];
  var SCHEME_NAMES = { auto: 'automaattinen', light: 'vaalea', dark: 'tumma' };
  var KEY = 'xr-teema';
  function getScheme() { try { return localStorage.getItem(KEY) || 'auto'; } catch (e) { return 'auto'; } }
  function setScheme(s) {
    if (s === 'auto') delete root.dataset.scheme; else root.dataset.scheme = s;
    try { if (s === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, s); } catch (e) { /* ei tallennusta */ }
    var b = document.getElementById('xr-scheme');
    if (b) b.textContent = 'Teema: ' + SCHEME_NAMES[s];
  }
  if (getScheme() !== 'auto') root.dataset.scheme = getScheme();
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('xr-scheme');
    if (!b) return;
    setScheme(getScheme());
    b.addEventListener('click', function () { setScheme(SCHEMES[(SCHEMES.indexOf(getScheme()) + 1) % SCHEMES.length]); });
  });

  var THEMES = ['laitteet', 'alustat', 'sisalto', 'saantely', 'ala'];
  var NAMES = { laitteet: 'Laitteet', alustat: 'Alustat ja talous', sisalto: 'Sisältö ja palvelut', saantely: 'Sääntely ja yksityisyys', ala: 'Terveys, puolustus, teollisuus' };
  var MONTHS = ['Tam', 'Hel', 'Maa', 'Huh', 'Tou', 'Kes', 'Hei', 'Elo', 'Syy', 'Lok', 'Mar', 'Jou'];
  var MONTHS_LONG = ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'];
  var NS = 'http://www.w3.org/2000/svg';
  var $ = function (id) { return document.getElementById(id); };

  // Päivämäärä "2026-03-17" (päivä tiedossa) tai "2026-03" (vain kuukausi tiedossa).
  function parseDate(s) {
    var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(s || '');
    if (!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = m[3] ? +m[3] : 15;
    return { y: y, m: mo, d: d, ms: Date.UTC(y, mo, d), day: !!m[3] };
  }
  function dayText(p) { return p.d + '.' + (p.m + 1) + '.'; }
  function safeUrl(u) { return /^https:\/\//.test(u || '') ? u : null; }

  // Lähde-tägi rivin tai kuvan tekstin loppuun; useammalle lähteelle numerot.
  function srcTags(list) {
    var f = document.createDocumentFragment();
    list.forEach(function (s, i) {
      var u = safeUrl(s.url);
      var t = document.createElement(u ? 'a' : 'span');
      t.className = 'xr-src';
      t.textContent = 'Lähde' + (list.length > 1 ? ' ' + (i + 1) : '');
      t.title = s.name;
      if (u) { t.href = u; t.target = '_blank'; t.rel = 'noopener'; t.setAttribute('aria-label', 'Lähde: ' + s.name); }
      f.append(' ', t);
    });
    return f;
  }
  function link(text, url) {
    var u = safeUrl(url);
    if (!u) return document.createTextNode(text);
    var a = document.createElement('a');
    a.textContent = text; a.href = u; a.target = '_blank'; a.rel = 'noopener';
    return a;
  }

  function el(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(tag, attrs, parent, text) { var e = el(tag, attrs, parent); e.textContent = text; return e; }
  function svgIn(box, W, H) { box.replaceChildren(); return el('svg', { width: '100%', viewBox: '0 0 ' + W + ' ' + H, role: 'img' }, box); }

  function srcMap(sources) { var m = {}; (sources || []).forEach(function (s) { m[s.id] = s; }); return m; }

  // Lataa JSON-tiedoston. Jos lataus epäonnistuu (esim. sivu avattu suoraan levyltä file://-osoitteella), kerrotaan siitä sivulla.
  function load(url, done) {
    fetch(url, { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var run = function () { done(data); };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
      })
      .catch(function (e) {
        console.error('XR-vuosi: aineiston lataus epäonnistui (' + url + ')', e);
        var show = function () {
          var p = document.createElement('p');
          p.className = 'xr-error';
          p.textContent = 'Aineistoa ei voitu ladata. Jos avasit sivun suoraan tiedostosta, käynnistä paikallinen palvelin (esim. python3 -m http.server) ja avaa sivu sen kautta.';
          var main = $('xr-root');
          main.insertBefore(p, main.children[1] || null);
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
      });
  }

  // "Viimeksi päivitetty" ja [data-src]-lähdetägit; yhteinen kaikille sivuille.
  function fillCommon(data, SRCMAP) {
    var u = parseDate(data.updated);
    if (u && $('xr-updated')) $('xr-updated').textContent = dayText(u) + u.y;
    document.querySelectorAll('[data-src]').forEach(function (n) {
      var list = n.dataset.src.split(' ').map(function (s) { return SRCMAP[s]; }).filter(Boolean);
      n.append(srcTags(list));
    });
  }

  // Piirtää kaaviot uudelleen vain, kun sisällön leveys oikeasti muuttuu.
  function onResize(draw) {
    var main = $('xr-root'), lastW = main.clientWidth, timer = null;
    var check = function () {
      var w = main.clientWidth;
      if (w === lastW) return;
      lastW = w;
      clearTimeout(timer);
      timer = setTimeout(draw, 80);
    };
    if (window.ResizeObserver) new ResizeObserver(check).observe(main);
    else window.addEventListener('resize', check);
  }

  return {
    THEMES: THEMES, NAMES: NAMES, MONTHS: MONTHS, MONTHS_LONG: MONTHS_LONG,
    $: $, parseDate: parseDate, dayText: dayText, safeUrl: safeUrl, srcTags: srcTags, link: link,
    el: el, txt: txt, svgIn: svgIn, srcMap: srcMap, load: load, fillCommon: fillCommon, onResize: onResize,
    fi: new Intl.NumberFormat('fi-FI'),
    fi1: new Intl.NumberFormat('fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  };
})();
