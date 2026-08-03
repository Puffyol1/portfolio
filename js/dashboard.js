/**
 * dashboard.js — 渲染脱敏演示看板
 * 全部数据来自 dashboard-data.js（虚构），不涉及任何真实信息。
 */
(function () {
  "use strict";

  var d = window.DASH_DATA;
  if (!d) return;

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

  // 数值格式化
  function fmt(n, isRate, unit) {
    if (isRate) return (n * 100).toFixed(1) + "%";
    var s;
    if (n >= 1e8) s = (n / 1e8).toFixed(2) + " 亿";
    else if (n >= 1e4) s = (n / 1e4).toFixed(1) + " 万";
    else s = String(n);
    return s + (unit ? " " + unit : "");
  }

  function fmtDelta(delta, isRate) {
    var sign = delta >= 0 ? "+" : "";
    return sign + (delta * 100).toFixed(1) + "%";
  }

  // ---- 标题 / 说明 ----
  function renderMeta() {
    var t = $("[data-dash='title']");
    if (t) t.textContent = d.meta.title;
    var n = $("[data-dash='note']");
    if (n) n.textContent = d.meta.note;
  }

  // ---- KPI ----
  function renderKpi() {
    var wrap = $("[data-dash='kpi']");
    if (!wrap) return;
    wrap.innerHTML = d.kpi
      .map(function (k) {
        var dir = k.delta >= 0 ? "up" : "down";
        var arrow = k.delta >= 0 ? "▲" : "▼";
        return (
          '<div class="kpi">' +
          '<p class="kpi__label">' +
          esc(k.label) +
          "</p>" +
          '<p class="kpi__value">' +
          fmt(k.value, k.isRate, k.unit) +
          "</p>" +
          '<p class="kpi__delta ' +
          dir +
          '">' +
          arrow +
          " " +
          fmtDelta(k.delta, k.isRate) +
          " 同比</p>" +
          "</div>"
        );
      })
      .join("");
  }

  // ---- 渠道柱状图 ----
  function renderChannel() {
    var wrap = $("#chart-channel");
    if (!wrap) return;
    var data = d.channelIntent;
    var max = Math.max.apply(
      null,
      data.map(function (x) { return x.value; })
    );
    var html =
      '<div class="bar-chart">' +
      data
        .map(function (x) {
          var h = Math.round((x.value / max) * 100);
          return (
            '<div class="bar-item">' +
            '<div class="bar" style="height:' +
            h +
            '%"><span class="bar__val">' +
            fmt(x.value) +
            "</span></div>" +
            '<span class="bar__label">' +
            esc(x.channel) +
            "</span>" +
            "</div>"
          );
        })
        .join("") +
      "</div>";
    wrap.innerHTML = html;
  }

  // ---- 趋势折线（SVG） ----
  function renderTrend() {
    var wrap = $("#chart-trend");
    if (!wrap) return;
    var data = d.trend;
    var W = 520,
      H = 200,
      P = { l: 40, r: 16, t: 14, b: 26 };
    var iw = W - P.l - P.r;
    var ih = H - P.t - P.b;

    var all = [];
    data.forEach(function (r) {
      all.push(r.y2025, r.y2026);
    });
    var max = Math.max.apply(null, all);
    var min = 0;

    function x(i) {
      return P.l + (iw / (data.length - 1 || 1)) * i;
    }
    function y(v) {
      return P.t + ih - ((v - min) / (max - min || 1)) * ih;
    }

    function line(key) {
      return data
        .map(function (r, i) {
          return (i === 0 ? "M" : "L") + x(i) + "," + y(r[key]);
        })
        .join(" ");
    }
    function dots(key) {
      return data
        .map(function (r, i) {
          return (
            '<circle cx="' +
            x(i) +
            '" cy="' +
            y(r[key]) +
            '" r="3.5" fill="#fff" stroke="currentColor" stroke-width="2"/>'
          );
        })
        .join("");
    }
    function labels(key) {
      return data
        .map(function (r, i) {
          return (
            '<text x="' +
            x(i) +
            '" y="' +
            (y(r[key]) - 10) +
            '" text-anchor="middle" font-size="10" fill="#5b6573" font-weight="600">' +
            fmt(r[key]) +
            "</text>"
          );
        })
        .join("");
    }

    var xLabels = data
      .map(function (r, i) {
        return (
          '<text x="' +
          x(i) +
          '" y="' +
          (H - 8) +
          '" text-anchor="middle" font-size="11" fill="#93a0b0">' +
          esc(r.month) +
          "</text>"
        );
      })
      .join("");

    wrap.innerHTML =
      '<div class="trend-legend"><span><i style="background:#93b8d6"></i>2025</span><span><i style="background:#5fa8e6"></i>2026</span></div>' +
      '<svg class="trend-svg" viewBox="0 0 ' +
      W +
      " " +
      H +
      '" preserveAspectRatio="xMidYMid meet" style="color:#5fa8e6">' +
      // gridlines
      [0.25, 0.5, 0.75, 1].map(function (t) {
        var gy = P.t + ih * (1 - t);
        return (
          '<line x1="' +
          P.l +
          '" y1="' +
          gy +
          '" x2="' +
          (W - P.r) +
          '" y2="' +
          gy +
          '" stroke="rgba(95,168,230,0.12)" stroke-width="1"/>'
        );
      }).join("") +
      '<g style="color:#93b8d6" stroke="#93b8d6" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="' +
      line("y2025") +
      '" stroke-dasharray="4 4"/>' +
      dots("y2025") +
      "</g>" +
      '<g stroke="#5fa8e6" stroke-width="2.5" fill="none" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="' +
      line("y2026") +
      '"/>' +
      dots("y2026") +
      "</g>" +
      labels("y2025") +
      labels("y2026") +
      xLabels +
      "</svg>";
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
          '<tr class="scenic-row" data-idx="' +
          idx +
          '">' +
          '<td><span class="name">' +
          esc(s.name) +
          '<span class="caret">▶</span></span></td>' +
          "<td>" +
          fmt(s.intent) +
          "</td>" +
          "<td>" +
          fmt(s.paid) +
          "</td>" +
          "<td>" +
          fmt(s.gtv) +
          "</td>" +
          '<td><span class="delta ' +
          dir +
          '">' +
          arrow +
          " " +
          fmtDelta(s.delta) +
          "</span></td>" +
          "</tr>";

        var children = s.children
          .map(function (c) {
            return (
              '<tr class="scenic-child" data-parent="' +
              idx +
              '" hidden>' +
              '<td><span class="name">' +
              esc(c.name) +
              "</span></td>" +
              "<td>" +
              fmt(c.intent) +
              "</td>" +
              "<td>" +
              fmt(c.paid) +
              "</td>" +
              "<td>" +
              fmt(c.gtv) +
              "</td>" +
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
      "<thead><tr>" +
      "<th>景区</th>" +
      "<th>意向 UV</th>" +
      "<th>支付 UV</th>" +
      "<th>GTV</th>" +
      "<th>同比</th>" +
      "</tr></thead>" +
      "<tbody>" +
      rows +
      "</tbody></table>";

    // 绑定下钻
    wrap.querySelectorAll(".scenic-row").forEach(function (row) {
      row.addEventListener("click", function () {
        var idx = row.getAttribute("data-idx");
        var open = row.classList.toggle("open");
        wrap
          .querySelectorAll('.scenic-child[data-parent="' + idx + '"]')
          .forEach(function (c) {
            c.hidden = !open;
          });
      });
    });
  }

  function init() {
    renderMeta();
    renderKpi();
    renderChannel();
    renderTrend();
    renderTable();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
