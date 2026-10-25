// Etusivu: aihekortit, aikajana ja tapahtumataulukko. Aineisto: data/xr-data.json.
XR.load('data/xr-data.json', function (DATA) {
  'use strict';
  var THEMES = XR.THEMES, NAMES = XR.NAMES, MONTHS = XR.MONTHS, MONTHS_LONG = XR.MONTHS_LONG;
  var $ = XR.$, el = XR.el, txt = XR.txt, parseDate = XR.parseDate, dayText = XR.dayText;
  var SRCMAP = XR.srcMap(DATA.sources);

  // Aiherajaus osoitteesta, esim. index.html?aihe=saantely (useampi pilkulla erotettuna).
  var fromUrl = (new URLSearchParams(location.search).get('aihe') || '').split(',').filter(function (t) { return THEMES.indexOf(t) >= 0; });
  var state = { active: new Set(fromUrl.length ? fromUrl : THEMES), europe: new URLSearchParams(location.search).get('eurooppa') === '1', pinned: null };

  // Johdetaan näytettävät kentät datasta, jotta riville riittää id, date, theme, europe, title, detail ja src.
  var EVENTS = DATA.events.map(function (r, i) {
    var p = parseDate(r.date), end = r.end ? parseDate(r.end) : null;
    var problems = [];
    if (!p) problems.push('date');
    if (THEMES.indexOf(r.theme) < 0) problems.push('theme');
    var srcs = [].concat(r.src).filter(Boolean);
    if (!srcs.length || !srcs.every(function (s) { return SRCMAP[s]; })) problems.push('src');
    if (problems.length) { console.warn('XR-vuosi: ohitetaan rivi ' + (r.id || i) + ', virheellinen kenttä: ' + problems.join(', ')); return null; }
    var q = Math.floor(p.m / 3) + 1, tl;
    if (!p.day) tl = MONTHS_LONG[p.m];
    else if (end && end.day && end.ms > p.ms) tl = (end.m === p.m ? p.d + '.' : dayText(p)) + '–' + dayText(end);
    else tl = dayText(p);
    return {
      id: r.id, i: i, theme: r.theme, europe: r.europe, title: r.title, detail: r.detail,
      ms: p.ms, m: p.m, precision: p.day ? 'day' : 'month', q: q, when: 'Q' + q + ' ' + p.y, tl_when: tl,
      theme_label: NAMES[r.theme], sources: srcs.map(function (s) { return SRCMAP[s]; }),
      source: srcs.map(function (s) { return SRCMAP[s].name; }).join(', ')
    };
  }).filter(Boolean).sort(function (a, b) { return a.ms - b.ms || a.i - b.i; });
  var UPDATED = parseDate(DATA.updated);
  var YEAR = UPDATED ? UPDATED.y : 2026;
  var LAST_M = EVENTS.reduce(function (mx, r) { return Math.max(mx, r.m); }, UPDATED ? UPDATED.m : 0);
  var isEu = function (r) { return r.europe === true || r.europe === 'true'; };
  var visible = function (r) { return state.active.has(r.theme) && (!state.europe || isEu(r)); };

  function fillStatic() {
    XR.fillCommon(DATA, SRCMAP);
    $('xr-total').textContent = String(EVENTS.length);
    $('xr-total-eu').textContent = String(EVENTS.filter(isEu).length);
    THEMES.forEach(function (t) {
      var n = EVENTS.filter(function (r) { return r.theme === t; }).length;
      var b = document.querySelector('[data-count="' + t + '"]');
      if (b) b.textContent = String(n);
    });
    document.querySelectorAll('.xr-theme').forEach(function (b) { b.style.setProperty('--sw', 'var(--c-' + b.dataset.theme + ')'); });

    $('xr-h-timeline').textContent = LAST_M > 0
      ? 'Aikajana tammikuusta ' + MONTHS_LONG[LAST_M].toLowerCase() + 'hun'
      : 'Aikajana: tammikuu';
    if (UPDATED) {
      var uq = Math.floor(UPDATED.m / 3) + 1;
      var qEnd = Date.UTC(UPDATED.y, uq * 3, 0);
      if (UPDATED.ms < qEnd) {
        var hasQ = EVENTS.some(function (r) { return r.q === uq; });
        $('xr-qnote').textContent = ' Q' + uq + ' on käynnissä' + (hasQ ? ', joten sen tapahtumat ovat vielä kesken.' : ', eikä sille ole vielä tapahtumia.');
      }
    }
  }

  // Lähekkäiset pisteet pinotaan tasoille 0, +1, −1, +2, −2 …; kaista kasvaa tarvittaessa.
  function stackLanes(pts, lanes, top, step, minH) {
    var placed = [], maxLvl = [], laneTop = [], laneH = [], y = top;
    for (var i = 0; i < lanes; i++) { placed.push([]); maxLvl.push(0); }
    pts.sort(function (a, b) { return a.px - b.px; }).forEach(function (p) {
      var lvl = 0;
      while (placed[p.lane].some(function (q) { return q.lvl === lvl && Math.abs(q.px - p.px) < 14; })) lvl++;
      placed[p.lane].push({ px: p.px, lvl: lvl });
      p.off = (lvl % 2 ? 1 : -1) * Math.ceil(lvl / 2) * step;
      maxLvl[p.lane] = Math.max(maxLvl[p.lane], Math.ceil(lvl / 2));
    });
    maxLvl.forEach(function (n, i) { laneTop[i] = y; laneH[i] = Math.max(minH, 2 * n * step + 20); y += laneH[i]; });
    pts.forEach(function (p) { p.py = laneTop[p.lane] + laneH[p.lane] / 2 + p.off; });
    return { laneTop: laneTop, laneH: laneH, H: y + 4 };
  }

  function showTip(host, tip, p, title, sub) {
    tip.replaceChildren();
    var b = document.createElement('span'); b.textContent = title;
    var s = document.createElement('small'); s.textContent = sub;
    tip.append(b, s);
    tip.hidden = false;
    var pad = 14, w = tip.offsetWidth, hostW = host.clientWidth;
    tip.style.left = Math.max(4, Math.min(hostW - w - 4, p.px + pad - w / 2)) + 'px';
    tip.style.top = Math.max(2, p.py + pad - tip.offsetHeight - 6) + 'px';
  }

  // Hiirellä vihje näkyy osoitettaessa. Napautus tai Enter kiinnittää vihjeen (ja korostaa tapahtuman rivin taulukossa).
  function bindDot(c, key, tip, show) {
    var hide = function () { if (state.pinned !== key) tip.hidden = true; };
    c.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') show(); });
    c.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') hide(); });
    c.addEventListener('focus', show);
    c.addEventListener('blur', hide);
    var pin = function () { pinEvent(state.pinned === key ? null : key); if (state.pinned) show(); };
    c.addEventListener('click', function (e) { e.stopPropagation(); pin(); });
    c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pin(); } });
    if (state.pinned === key) show();
  }

  function pinEvent(id) {
    state.pinned = id;
    document.querySelectorAll('.xr-tip').forEach(function (t) { t.hidden = true; });
    document.querySelectorAll('#xr-table tr.hl').forEach(function (tr) { tr.classList.remove('hl'); });
    var row = id && $('xr-row-' + id);
    if (row) row.classList.add('hl');
  }
  document.addEventListener('click', function () { if (state.pinned) pinEvent(null); });

  function drawStrip() {
    var host = $('xr-strip'), box = $('xr-strip-svg'), tip = $('xr-tip');
    tip.hidden = true;
    var W = Math.max(280, box.clientWidth || 640), top = 22, ml = 6, mr = 10;
    var t0 = Date.UTC(YEAR, 0, 1), t1 = Date.UTC(YEAR, LAST_M + 1, 1);
    var x = function (ms) { return ml + (ms - t0) / (t1 - t0) * (W - ml - mr); };
    var pts = EVENTS.map(function (r) { return { r: r, px: x(r.ms), lane: THEMES.indexOf(r.theme) }; });
    var L = stackLanes(pts, THEMES.length, top, 13, 44), H = L.H;
    var svg = XR.svgIn(box, W, H);
    MONTHS.slice(0, LAST_M + 1).forEach(function (name, i) {
      var px = x(Date.UTC(YEAR, i, 1));
      el('line', { x1: px, x2: px, y1: top - 6, y2: H, style: 'stroke:var(--grid)' }, svg);
      txt('text', { x: px + 4, y: 12, style: 'fill:var(--muted);font-size:11px' }, svg, name);
    });
    THEMES.forEach(function (t, i) {
      var py = L.laneTop[i] + L.laneH[i];
      el('line', { x1: ml, x2: W - mr, y1: py, y2: py, style: 'stroke:var(--grid)' }, svg);
    });
    pts.forEach(function (p) {
      var c = el('circle', {
        'class': 'xr-dot', cx: p.px, cy: p.py, r: 6, tabindex: 0, role: 'img',
        'aria-label': p.r.tl_when + ': ' + p.r.title,
        style: 'fill:' + (p.r.precision === 'day' ? 'var(--c-' + p.r.theme + ')' : 'var(--panel)') + ';stroke:var(--c-' + p.r.theme + ');stroke-width:2;opacity:' + (visible(p.r) ? 1 : 0.15)
      }, svg);
      bindDot(c, p.r.id, tip, function () { showTip(host, tip, p, p.r.title, p.r.tl_when + ' · ' + p.r.source); });
    });
  }

  function drawTable() {
    var tbody = document.querySelector('#xr-table tbody');
    tbody.replaceChildren();
    var rows = EVENTS.filter(visible);
    var prevQ = null;
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      tr.id = 'xr-row-' + r.id;
      tr.className = 't-' + r.theme + (isEu(r) ? ' eu' : '') + (prevQ !== null && r.q !== prevQ ? ' q-first' : '') + (state.pinned === r.id ? ' hl' : '');
      prevQ = r.q;
      [r.when, r.theme_label, r.title].forEach(function (t) {
        var td = document.createElement('td'); td.append(t); tr.appendChild(td);
      });
      var det = document.createElement('td');
      det.append(r.detail, XR.srcTags(r.sources));
      tr.appendChild(det);
      tbody.appendChild(tr);
    });
    $('xr-empty').hidden = rows.length > 0;
  }

  function syncControls() {
    document.querySelectorAll('.xr-theme').forEach(function (b) {
      var off = !state.active.has(b.dataset.theme);
      b.classList.toggle('off', off);
      b.setAttribute('aria-pressed', String(!off && state.active.size < THEMES.length));
    });
    $('xr-eu').setAttribute('aria-pressed', String(state.europe));
    var act = THEMES.filter(function (t) { return state.active.has(t); });
    var parts = [act.length === THEMES.length ? 'kaikki aiheet' : act.map(function (t) { return NAMES[t]; }).join(', ')];
    if (state.europe) parts.push('vain Eurooppa-yhteys');
    var line = $('xr-filterline');
    line.textContent = 'Näytetään: ' + parts.join(' · ') + '.';
    line.classList.toggle('on', act.length < THEMES.length || state.europe);
  }

  function drawFiltered() { syncControls(); drawStrip(); drawTable(); }

  document.querySelectorAll('.xr-theme').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.dataset.theme;
      if (state.active.size === THEMES.length) state.active = new Set([t]);
      else if (state.active.has(t)) { state.active.delete(t); if (!state.active.size) state.active = new Set(THEMES); }
      else state.active.add(t);
      drawFiltered();
    });
  });
  $('xr-eu').addEventListener('click', function () { state.europe = !state.europe; drawFiltered(); });
  $('xr-reset').addEventListener('click', function () { state.active = new Set(THEMES); state.europe = false; drawFiltered(); });

  fillStatic();
  drawFiltered();
  XR.onResize(drawStrip);
});
