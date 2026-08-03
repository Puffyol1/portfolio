/**
 * dashboard.js — 渲染景区经营数据看板（脱敏演示）
 * 数据来自 dashboard-data.js，全部虚构。
 */
(function () {
  "use strict";

  var d = window.DASH_DATA;
  if (!d) return;
  var P = d.palette;

  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmt(n, unit, isRate) {
    if (isRate) return (n * 100).toFixed(0) + "%";
    var s = String(n);
    if (n >= 10000) s = (n / 10000).toFixed(1) + " 万";
    else if (n >= 1000) s = (n / 1000).toFixed(1) + " 千";
    return s + (unit ? " " + unit : "");
  }

  function fmtDelta(delta) {
    var sign = delta >= 0 ? "+" : "";
    return sign + (delta * 100).toFixed(0) + "%";
  }

  function colorOf(name) {
    return P[name] || P.blue;
  }

  // ---- 标题 ----
  function renderMeta() {
    var t = $("[data-dash='title']");
    if (t) t.textContent = d.meta.title;
    var s = $("[data-dash='subtitle']");
    if (s) s.textContent = d.meta.subtitle;
    var n = $("[data-dash='note']");
    if (n) n.textContent = d.meta.note;
  }

  // ---- 顶部概览 ----
  function renderOverview() {
    var wrap = $("[data-dash='overview']");
    if (!wrap) return;
    wrap.innerHTML = d.overview
      .map(function (o) {
        var dir = o.delta >= 0 ? "up" : "down";
        var arrow = o.delta >= 0 ? "▲" : "▼";
        return (
          '<div class="overview__item">' +
          '<p class="overview__label">' + esc(o.label) + "</p>" +
          '<p class="overview__value">' + fmt(o.value, o.unit, o.isRate) +
          (o.unit ? '<span class="unit">' + esc(o.unit) + "</span>" : "") +
          "</p>" +
          '<p class="overview__delta ' + dir + '">' + arrow + " " + fmtDelta(o.delta) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  // ---- AOI 指标表 ----
  function renderAoiTable() {
    var t = d.aoiTable;
    var title = $("[data-aoi='title']");
    if (title) title.textContent = t.title;
    var wrap = $("#aoi-table");
    if (!wrap) return;

    var rows = t.rows
      .map(function (r) {
        var delta = (r.now - r.last) / r.last;
        // 退单率等「越小越好」的指标：下降是好事
        var isGoodDown = r.metric === "退单率";
        var dir;
        if (isGoodDown) {
          dir = delta <= 0 ? "up" : "down"; // 下降显示绿
        } else {
          dir = delta >= 0 ? "up" : "down";
        }
        return (
          "<tr>" +
          "<td>" + esc(r.metric) + "</td>" +
          '<td class="num">' + fmt(r.last, r.unit, r.isRate) + "</td>" +
          '<td class="num">' + fmt(r.now, r.unit, r.isRate) + "</td>" +
          '<td class="delta ' + dir + '">' + fmtDelta(delta) + "</td>" +
          "</tr>"
        );
      })
      .join("");

    wrap.innerHTML =
      '<table class="aoi-table">' +
      "<thead><tr>" +
      t.columns.map(function (c) { return "<th>" + esc(c) + "</th>"; }).join("") +
      "</tr></thead>" +
      "<tbody>" + rows + "</tbody>" +
      "</table>";
  }

  // ---- GTV 拆分柱状图 ----
  function renderGtv() {
    var g = d.gtvBreakdown;
    var title = $("[data-gtv='title']");
    if (title) title.textContent = g.title;
    var wrap = $("#gtv-chart");
    if (!wrap) return;
    var max = Math.max.apply(null, g.bars.map(function (b) { return b.value; }));

    var bars = g.bars
      .map(function (b) {
        var h = Math.round((b.value / max) * 100);
        var col = colorOf(b.color);
        return (
          '<div class="bar-item">' +
          '<div class="bar" style="height:' + h + "%; background:" + col + '">' +
          '<span class="bar__val">' + fmt(b.value, "万") + "</span></div>" +
          '<span class="bar__label">' + esc(b.name) + "</span>" +
          "</div>"
        );
      })
      .join("");

    var legend = g.bars
      .map(function (b) {
        var col = colorOf(b.color);
        return '<span><i style="background:' + col + '"></i>' + esc(b.name) + "</span>";
      })
      .join("");

    wrap.innerHTML = '<div class="bar-chart">' + bars + "</div>" +
      '<div class="chart-legend">' + legend + "</div>";
  }

  // ---- 指标卡排行榜 ----
  function renderKpiCards() {
    var k = d.kpiCards;
    var title = $("[data-kpi='title']");
    if (title) title.textContent = k.title;
    var wrap = $("#kpi-cards");
    if (!wrap) return;

    wrap.innerHTML =
      '<div class="kpi-list">' +
      k.items
        .map(function (it) {
          return (
            '<div class="kpi-row ' + esc(it.trend) + '">' +
            '<span class="kpi-row__label">' + esc(it.label) + "</span>" +
            '<span class="kpi-row__val">' + fmt(it.value, it.unit, it.isRate) + "</span>" +
            "</div>"
          );
        })
        .join("") +
      "</div>";
  }

  // ---- 同比分组柱状图 ----
  function renderCompare() {
    var c = d.compare;
    var title = $("[data-compare='title']");
    if (title) title.textContent = c.title;
    var wrap = $("#compare-chart");
    if (!wrap) return;
    var max = Math.max.apply(
      null,
      c.groups.map(function (g) { return Math.max(g.last, g.now); })
    );

    var items = c.groups
      .map(function (g) {
        var hLast = Math.round((g.last / max) * 100);
        var hNow = Math.round((g.now / max) * 100);
        return (
          '<div class="group-item">' +
          '<div class="group-bars">' +
          '<div class="group-bar last" style="height:' + hLast + '%"></div>' +
          '<div class="group-bar now" style="height:' + hNow + '%"></div>' +
          "</div>" +
          '<span class="group__label">' + esc(g.name) + "</span>" +
          "</div>"
        );
      })
      .join("");

    var legend =
      '<span><i style="background:' + P.blue + ';opacity:0.45"></i>' + esc(c.legend[0]) + "</span>" +
      '<span><i style="background:' + P.green + '"></i>' + esc(c.legend[1]) + "</span>";

    wrap.innerHTML = '<div class="group-chart">' + items + "</div>" +
      '<div class="chart-legend">' + legend + "</div>";
  }

  // ---- 关键结论 ----
  function renderConclusions() {
    var wrap = $("[data-dash='conclusions']");
    if (!wrap) return;
    wrap.innerHTML = d.conclusions
      .map(function (c) {
        return '<span class="conclusion ' + esc(c.type) + '">' + esc(c.text) + "</span>";
      })
      .join("");
  }

  function init() {
    renderMeta();
    renderOverview();
    renderAoiTable();
    renderGtv();
    renderKpiCards();
    renderCompare();
    renderConclusions();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
