// XR-kehitys lukuina: Reality Labsin luvut, laitetoimitusten vuosimuutos ja lasien hinnat. Aineisto: data/xr-data.json.
XR.load('data/xr-data.json', function (DATA) {
  'use strict';
  var $ = XR.$, el = XR.el, txt = XR.txt, fi = XR.fi, fi1 = XR.fi1;
  var FIG = DATA.figures || [], PRICES = DATA.prices || [];
  var SRCMAP = XR.srcMap(DATA.sources);
  var fig = function (k) { var r = FIG.find(function (x) { return x.key === k; }); return r ? Number(r.value) : NaN; };
  var signed = function (v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + fi.format(Math.abs(v)) + ' %'; };

  function drawMeta() {
    var box = $('xr-chart-meta');
    var items = [
      { l: 'Tappio 2024', v: fig('rl_loss_2024'), loss: true },
      { l: 'Tappio 2025', v: fig('rl_loss_2025'), loss: true },
      { l: 'Liikevaihto 2025', v: fig('rl_sales_2025'), loss: false }
    ].filter(function (d) { return isFinite(d.v); });
    if (!items.length) return;
    var W = Math.max(220, box.clientWidth || 320), H = 190, mt = 24, mb = 26, ml = 4, mr = 4;
    var svg = XR.svgIn(box, W, H);
    var max = Math.max.apply(null, items.map(function (d) { return d.v; })) * 1.05;
    var y = function (v) { return H - mb - (v / max) * (H - mb - mt); };
    var band = (W - ml - mr) / items.length, bw = band * 0.7;
    el('line', { x1: ml, x2: W - mr, y1: y(0), y2: y(0), style: 'stroke:var(--line)' }, svg);
    items.forEach(function (d, i) {
      var x = ml + band * i + (band - bw) / 2;
      el('rect', { x: x, y: y(d.v), width: bw, height: y(0) - y(d.v), rx: 4, style: 'fill:' + (d.loss ? 'var(--accent)' : 'var(--mutedbar)') }, svg);
      txt('text', { x: x + bw / 2, y: y(d.v) - 6, 'text-anchor': 'middle', style: 'fill:var(--fg);font-size:13px;font-variant-numeric:tabular-nums' }, svg, fi1.format(d.v));
      txt('text', { x: x + bw / 2, y: H - 8, 'text-anchor': 'middle', style: 'fill:var(--muted);font-size:11.5px' }, svg, d.l);
    });
  }

  // Palkin pyöristys vain datan päässä; nollaviivan puoli pysyy suorana.
  function barPath(x0, x1, y, h, r) {
    var d = x1 >= x0 ? 1 : -1, w = Math.abs(x1 - x0);
    r = Math.min(r, w, h / 2);
    var xe = x1 - d * r;
    return 'M' + x0 + ' ' + y + 'H' + xe + 'q' + d * r + ' 0 ' + d * r + ' ' + r + 'V' + (y + h - r) +
      'q0 ' + r + ' ' + (-d * r) + ' ' + r + 'H' + x0 + 'Z';
  }

  function drawMarket() {
    var box = $('xr-chart-market');
    var items = [{ l: 'VR-headsetit', v: fig('vr_q2') }, { l: 'AR-laitteet', v: fig('ar_q2') }].filter(function (d) { return isFinite(d.v); });
    if (!items.length) return;
    // Nimet omassa sarakkeessaan vasemmalla, joten nollaviiva ei osu teksteihin.
    var W = Math.max(220, box.clientWidth || 320), labW = 108, valW = 52, rowH = 64, barH = 26, top = 8, axisH = 22, mr = 8;
    var H = top + rowH * items.length + axisH;
    var vals = items.map(function (d) { return d.v; });
    var lo = Math.min.apply(null, [0].concat(vals)), hi = Math.max.apply(null, [0].concat(vals));
    var pl = labW + (lo < 0 ? valW : 0);
    var x = function (v) { return pl + (v - lo) / ((hi - lo) || 1) * (W - pl - mr); };
    var svg = XR.svgIn(box, W, H);
    var yEnd = top + rowH * items.length;
    items.forEach(function (d, i) {
      var yc = top + i * rowH + rowH / 2, x0 = x(0), x1 = x(d.v);
      txt('text', { x: 0, y: yc + 4.5, style: 'fill:var(--fg);font-size:13px' }, svg, d.l);
      el('path', { d: barPath(x0, x1, yc - barH / 2, barH, 4), style: 'fill:' + (d.v < 0 ? 'var(--mutedbar)' : 'var(--accent)') }, svg);
      var inside = d.v > 0 && Math.abs(x1 - x0) > 70;
      txt('text', {
        x: d.v < 0 ? x1 - 6 : inside ? x1 - 8 : x1 + 6, y: yc + 5,
        'text-anchor': d.v < 0 || inside ? 'end' : 'start',
        style: 'fill:' + (inside ? 'var(--panel)' : 'var(--fg)') + ';font-size:13.5px;font-weight:600;font-variant-numeric:tabular-nums'
      }, svg, signed(d.v));
    });
    el('line', { x1: x(0), x2: x(0), y1: top, y2: yEnd, style: 'stroke:var(--fg);stroke-width:1' }, svg);
    txt('text', { x: x(0), y: yEnd + 15, 'text-anchor': 'middle', style: 'fill:var(--muted);font-size:11.5px' }, svg, '0 %');
  }

  function priceText(p) { return (p.from ? 'alk. ' : p.approx ? 'noin ' : '') + fi.format(p.eur) + ' €'; }

  // Eurooppalaiset mallit omana ryhmänään, muut ryhmänsä (ar/vr) mukaan. Kaikilla ryhmillä sama asteikko.
  var PRICE_GROUPS = [
    { g: 'ar', l: 'AR- ja älylasit' },
    { g: 'vr', l: 'VR- ja mixed reality -lasit' },
    { g: 'eu', l: 'Eurooppalaiset, ammattikäyttöön' }
  ];
  function drawPrices() {
    var host = $('xr-prices');
    var all = PRICES.filter(function (p) { return isFinite(p.eur); });
    if (!all.length) return;
    var max = Math.max.apply(null, all.map(function (p) { return p.eur; }));
    host.replaceChildren();
    PRICE_GROUPS.forEach(function (G) {
      var rows = all.filter(function (p) { return G.g === 'eu' ? p.eu : p.group === G.g && !p.eu; })
        .sort(function (a, b) { return a.eur - b.eur; });
      if (!rows.length) return;
      var box = document.createElement('div'); box.className = 'xr-pgroup';
      var head = document.createElement('div'); head.className = 'xr-pgroup-head';
      var name = document.createElement('b'); name.textContent = G.l;
      var range = document.createElement('span'); range.className = 'xr-pgroup-range';
      range.textContent = fi.format(rows[0].eur) + '–' + fi.format(rows[rows.length - 1].eur) + ' ';
      var unit = document.createElement('small'); unit.textContent = '€';
      range.append(unit);
      head.append(name, range);
      box.append(head);
      rows.forEach(function (p) {
        var s = SRCMAP[p.src];
        var row = document.createElement('div'); row.className = 'xr-prow';
        var nm = document.createElement('span'); nm.className = 'xr-pname';
        nm.append(s ? XR.link(p.model, s.url) : p.model);
        if (p.note && !p.eu) { var n = document.createElement('small'); n.textContent = p.note; nm.append(n); }
        var val = document.createElement('span'); val.className = 'xr-pval'; val.textContent = priceText(p);
        var track = document.createElement('span'); track.className = 'xr-ptrack'; track.setAttribute('aria-hidden', 'true');
        var bar = document.createElement('span'); bar.className = 'xr-pbar'; bar.style.width = (p.eur / max * 100).toFixed(1) + '%';
        track.append(bar);
        row.append(nm, val, track);
        box.append(row);
      });
      host.append(box);
    });
  }

  function drawAll() { drawMeta(); drawMarket(); drawPrices(); }
  XR.fillCommon(DATA, SRCMAP);
  drawAll();
  XR.onResize(drawAll);
});
