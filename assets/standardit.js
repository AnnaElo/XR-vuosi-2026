// Standardit ja sääntely: korttilistat ja EU-määräpäivät. Aineisto: data/standardit.json.
XR.load('data/standardit.json', function (DATA) {
  'use strict';
  var $ = XR.$, parseDate = XR.parseDate, dayText = XR.dayText;
  var SRCMAP = XR.srcMap(DATA.sources);
  var sourcesOf = function (r) { return [].concat(r.src).filter(Boolean).map(function (s) { return SRCMAP[s]; }).filter(Boolean); };
  function node(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

  function drawItems(host, list) {
    host.replaceChildren();
    (list || []).forEach(function (r) {
      var card = node('article', 'xr-item');
      card.id = r.id;
      card.append(node('span', 'xr-item-org', r.org), node('h3', null, r.name), node('span', 'xr-item-status', r.status));
      var p = node('p', null, r.detail);
      p.append(XR.srcTags(sourcesOf(r)));
      card.append(p);
      host.append(card);
    });
  }

  // Päivämäärät järjestyksessä; menneet "voimassa", tulevat "tulossa" sen päivän mukaan, jona sivu avataan.
  function drawDates() {
    var host = $('xr-dates'), now = Date.now();
    host.replaceChildren();
    (DATA.dates || []).map(function (r) { return { r: r, p: parseDate(r.date) }; })
      .filter(function (d) { return d.p; })
      .sort(function (a, b) { return a.p.ms - b.p.ms; })
      .forEach(function (d) {
        var future = d.p.ms > now;
        var li = node('li', future ? 'tulossa' : 'voimassa');
        var t = node('time', null, dayText(d.p) + d.p.y);
        t.dateTime = d.r.date;
        var text = node('span', null, d.r.title);
        text.append(XR.srcTags(sourcesOf(d.r)));
        li.append(t, node('span', 'xr-state', future ? 'Tulossa' : 'Voimassa'), text);
        host.append(li);
      });
  }

  function drawReading() {
    var host = $('xr-reading');
    host.replaceChildren();
    (DATA.reading || []).forEach(function (r) { var li = node('li'); li.append(XR.link(r.name, r.url)); host.append(li); });
  }

  XR.fillCommon(DATA, SRCMAP);
  drawItems($('xr-standards'), DATA.standards);
  drawItems($('xr-eu-items'), DATA.eu);
  drawDates();
  drawReading();
});
