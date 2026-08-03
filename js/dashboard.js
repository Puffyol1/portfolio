/**
 * dashboard.js — 渲染脱敏演示看板
 * 全部数据来自 dashboard-data.js（虚构），不涉及任何真实信息。
 */
(function () {
  "use strict";

  var d = window.DASH_DATA;
  if (!d) return;
  var P = d.palette;

  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // 数值格式化（虚构整数）
  function fmt(n, unit, isRate) {
    if (isRate) return (n * 100).toFixed(0) + "%";
    var s = String(n);
    if (n >= 10000) s = (n / 10000).toFixed(1) + " 万";
    return s + (unit ? " " + unit : "");
  }

  function fmtDelta(delta) {
    var sign = delta >= 0 ? "+" : "";
    return sign + (delta * 100).toFixed(0) + "%";
  }

  // ---- 标题 ----
  function renderMeta() {
    var t = $("[data-dash='title']");
    if (t) t.textContent = d.meta.title;
    var n = $("[data-dash='note']");
    if (n) n.textContent = d.meta.note;
    $$("[data-dash='period']").forEach(function (el) {
      el.textContent = d.meta.period;
    });
  }

  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };

  // ---- KPI ----
  function renderKpi() {
    var wrap = $("[data-dash='kpi']");
    if (!wrap) return;
    wrap.innerHTML = d.kpi
      .map(function (k) {
        var dir = k.delta >= 0 ? "up" : "down";
        var arrow = k.delta >= 0 ? "▲" : "▼";
        return (
          '<div class="kpi" data-color="' +
          esc(k.color) +
          '">' +
          '<p class="kpi__label">' +
          esc(k.label) +
          "</p>" +
          '<p class="kpi__value">' +
          fmt(k.value, k.unit, k.isRate) +
          (k.unit ? '<span class="kpi__unit">' + esc(k.unit) + "</span>" : "") +
          "</p>" +
          '<p class="kpi__delta ' +
          dir +
          '">' +
          arrow +
          " " +
          fmtDelta(k.delta) +
          " 同比</p>" +
          "</div>"
        );
      })
      .join("");
  }

  // ---- 漏斗 ----
  function renderFunnel() {
    var wrap = $("#chart-funnel");
    if (!wrap) return;
    var data = d.funnel;
    var max = data[0].value;
    wrap.innerHTML =
      '<div class="funnel">' +
      data
        .map(function (f, i) {
          var pct = Math.round((f.value / max) * 100);
          var conv = i === 0 ? "" : "较上步 " + Math.round((f.value / data[i - 1].value) * 100) + "%";
          var color = P[f.color] || P.blue;
          return (
            '<div class="funnel__item">' +
            '<span class="funnel__label">' +
            esc(f.stage) +
            "</span>" +
            '<div class="funnel__bar" style="width:' +
            pct +
            "%; background:" +
            color +
            '">' +
            fmt(f.value, "万") +
            "</div>" +
            '<span class="funnel__rate">' +
            conv +
            "</span>" +
            "</div>"
          );
        })
        .join("") +
      "</div>";
  }

  // ---- 渠道柱状图（多色） ----
  function renderChannel() {
    var wrap = $("#chart-channel");
    if (!wrap) return;
    var data = d.channelIntent;
    var colors = [P.rose, P.yellow, P.sky];
    var max = Math.max.apply(null, data.map(function (x) { return x.value; }));
    wrap.innerHTML =
      '<div class="bar-chart">' +
      data
        .map(function (x, i) {
          var h = Math.round((x.value / max) * 100);
          var col = colors[i % colors.length];
          return (
            '<div class="bar-item">' +
            '<div class="bar" style="height:' +
            h +
            "%; background:linear-gradient(to top, " +
            col +
            ", " +
            col +
            'cc)"><span class="bar__val">' +
            fmt(x.value, "万") +
            "</span></div>" +
            '<span class="bar__label">' +
            esc(x.channel) +
            "</span>" +
            "</div>"
          );
        })
        .join("") +
      "</div>";
  }

  // ---- 月度同比折线 ----
  function renderTrend() {
    var wrap = $("#chart-trend");
    if (!wrap) return;
    var data = d.trend;
    var W = 480,
      H = 200,
      Pd = { l: 38, r: 16, t: 18, b: 26 };
    var iw = W - Pd.l - Pd.r;
    var ih = H - Pd.t - Pd.b;
    var all = [];
    data.forEach(function (r) { all.push(r.last, r.now); });
    var max = Math.max.apply(null, all) * 1.15;
    var min = 0;
    function x(i) { return Pd.l + (iw / (data.length - 1 || 1)) * i; }
    function y(v) { return Pd.t + ih - ((v - min) / (max - min || 1)) * ih; }
    function path(key) {
      return data.map(function (r, i) { return (i === 0 ? "M" : "L") + x(i) + "," + y(r[key]); }).join(" ");
    }
    function dots(key, color) {
      return data.map(function (r, i) {
        return '<circle cx="' + x(i) + '" cy="' + y(r[key]) + '" r="3.5" fill="#fff" stroke="' + color + '" stroke-width="2"/>';
      }).join("");
    }
    function labels(key, color) {
      return data.map(function (r, i) {
        return '<text x="' + x(i) + '" y="' + (y(r[key]) - 10) + '" text-anchor="middle" font-size="10" fill="' + color + '" font-weight="600">' + fmt(r.value || r[key], "万") + "</text>";
      }).join("");
    }
    var xLabels = data.map(function (r, i) {
      return '<text x="' + x(i) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="11" fill="#93a0b0">' + esc(r.month) + "</text>";
    }).join("");
    var grids = [0.25, 0.5, 0.75, 1].map(function (t) {
      var gy = Pd.t + ih * (1 - t);
      return '<line x1="' + Pd.l + '" y1="' + gy + '" x2="' + (W - Pd.r) + '" y2="' + gy + '" stroke="rgba(95,168,230,0.12)" stroke-width="1"/>';
    }).join("");

    wrap.innerHTML =
      '<div class="trend-legend"><span><i style="background:' + P.slate + '"></i>2025</span><span><i style="background:' + P.rose + '"></i>2026</span></div>' +
      '<svg class="svg-chart" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet">' +
      grids +
      '<path d="' + path("last") + '" fill="none" stroke="' + P.slate + '" stroke-width="2" stroke-dasharray="4 4" stroke-linejoin="round"/>' + dots("last", P.slate) +
      '<path d="' + path("now") + '" fill="none" stroke="' + P.rose + '" stroke-width="2.5" stroke-linejoin="round"/>' + dots("now", P.rose) +
      labels("now", P.inkSoft) +
      xLabels +
      "</svg>";
  }

  // ---- 每日趋势面积图（SVG） ----
  function renderDaily() {
    var wrap = $("#chart-daily");
    if (!wrap) return;
    var data = d.daily;
    var W = 1000,
      H = 180,
      Pd = { l: 40, r: 16, t: 14, b: 24 };
    var iw = W - Pd.l - Pd.r;
    var ih = H - Pd.t - Pd.b;
    var vals = data.map(function (x) { return x.value; });
    var max = Math.max.apply(null, vals) * 1.1;
    var min = 0;
    function x(i) { return Pd.l + (iw / (data.length - 1)) * i; }
    function y(v) { return Pd.t + ih - ((v - min) / (max - min || 1)) * ih; }

    var line = data.map(function (r, i) { return (i === 0 ? "M" : "L") + x(i).toFixed(1) + "," + y(r.value).toFixed(1); }).join(" ");
    var area = line + " L" + x(data.length - 1).toFixed(1) + "," + (Pd.t + ih) + " L" + x(0).toFixed(1) + "," + (Pd.t + ih) + " Z";

    // x 轴刻度（每 15 天）
    var xTicks = "";
    for (var i = 0; i < data.length; i += 15) {
      xTicks += '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="10" fill="#93a0b0">第 ' + (i + 1) + " 天</text>";
    }
    // gridlines
    var grids = [0.25, 0.5, 0.75, 1].map(function (t) {
      var gy = Pd.t + ih * (1 - t);
      return '<line x1="' + Pd.l + '" y1="' + gy + '" x2="' + (W - Pd.r) + '" y2="' + gy + '" stroke="rgba(95,168,230,0.1)" stroke-width="1"/>';
    }).join("");

    // 渐变定义
    var grad =
      '<defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + P.mint + '" stop-opacity="0.5"/>' +
      '<stop offset="100%" stop-color="' + P.mint + '" stop-opacity="0.02"/>' +
      "</linearGradient></defs>";

    wrap.innerHTML =
      '<svg class="svg-chart daily-area" viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="xMidYMid meet">' +
      grad +
      grids +
      '<path d="' + area + '" fill="url(#areaGrad)"/>' +
      '<path d="' + line + '" fill="none" stroke="' + P.mint + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>' +
      xTicks +
      "</svg>";
  }

  // ---- 品类堆叠柱 ----
  function renderCategory() {
    var wrap = $("#chart-category");
    if (!wrap) return;
    var data = d.category;
    var max = Math.max.apply(null, data.map(function (x) { return x.main + x.extra; }));
    var c1 = P.rose,
      c2 = P.yellow;
    wrap.innerHTML =
      '<div class="stack-chart">' +
      data
        .map(function (x) {
          var total = x.main + x.extra;
          var hMain = Math.round((x.main / max) * 100);
          var hExtra = Math.round((x.extra / max) * 100);
          return (
            '<div class="stack-item">' +
            '<div class="stack-bar" style="height:' +
            (hMain + hExtra) +
            "%\">" +
            '<div class="stack-seg" style="height:' +
            (hMain * 100 / (hMain + hExtra)) +
            "%; background:" +
            c1 +
            '"></div>' +
            '<div class="stack-seg" style="height:' +
            (hExtra * 100 / (hMain + hExtra)) +
            "%; background:" +
            c2 +
            '"></div>' +
            "</div>" +
            '<span class="stack__label">' +
            esc(x.name) +
            "</span>" +
            "</div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="trend-legend" style="margin-top:12px"><span><i style="background:' +
      c1 +
      '"></i>主票</span><span><i style="background:' +
      c2 +
      '"></i>增值</span></div>';
  }

  // ---- 景区表格（可下钻） ----
  function renderTable() {
    var wrap = $("#scenic-table");
    if (!wrap) return;
    var scenics = d.scenics;

    var rows = scenics
      .map(function (s, idx) {
        var dir = s.delta >= 0 ? "up" : "down";
        var arrow = s.delta >= 0 ? "▲" : "▼";
        var head =
          '<tr class="scenic-row" data-idx="' + idx + '">' +
          '<td><span class="name">' + esc(s.name) + '<span class="caret">▶</span></span></td>' +
          "<td>" + fmt(s.intent, "万") + "</td>" +
          "<td>" + fmt(s.paid, "万") + "</td>" +
          "<td>" + fmt(s.gtv, "万") + "</td>" +
          '<td><span class="delta ' + dir + '">' + arrow + " " + fmtDelta(s.delta) + "</span></td>" +
          "</tr>";
        var children = s.children
          .map(function (c) {
            return (
              '<tr class="scenic-child" data-parent="' + idx + '" hidden>' +
              '<td><span class="name">' + esc(c.name) + "</span></td>" +
              "<td>" + fmt(c.intent, "万") + "</td>" +
              "<td>" + fmt(c.paid, "万") + "</td>" +
              "<td>" + fmt(c.gtv, "万") + "</td>" +
              "<td></td>" +
              "</tr>"
            );
          })
          .join("");
        return head + children;
      })
      .join("");

    wrap.innerHTML =
      '<table class="scenic-table">' +
      "<thead><tr><th>景区</th><th>意向 UV</th><th>支付 UV</th><th>GTV</th><th>同比</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table>";

    $$(".scenic-row", wrap).forEach(function (row) {
      row.addEventListener("click", function () {
        var idx = row.getAttribute("data-idx");
        var open = row.classList.toggle("open");
        $$('.scenic-child[data-parent="' + idx + '"]', wrap).forEach(function (c) {
          c.hidden = !open;
        });
      });
    });
  }

  function init() {
    renderMeta();
    renderKpi();
    renderFunnel();
    renderChannel();
    renderTrend();
    renderDaily();
    renderCategory();
    renderTable();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
