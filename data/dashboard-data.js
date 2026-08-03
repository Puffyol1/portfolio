/**
 * dashboard-data.js — 脱敏演示数据
 * 所有数字均为无意义的整数（100/200/300…），仅用于展示看板形态。
 * 不含真实景区名、真实指标、内部链接。
 */
window.DASH_DATA = {
  meta: {
    title: "景区增长数据看板（演示）",
    note: "演示用脱敏数据 · 数字与名称均为虚构",
    period: "2026 · 5–6 月",
  },

  // ---- KPI（数字为虚构整数）----
  kpi: [
    { label: "意向 UV", value: 200, unit: "万", delta: 0.25, color: "blue" },
    { label: "支付 UV", value: 50, unit: "万", delta: 0.12, color: "teal" },
    { label: "转化率", value: 0.25, isRate: true, delta: -0.05, color: "amber" },
    { label: "GTV", value: 800, unit: "万", delta: 0.30, color: "purple" },
  ],

  // ---- 渠道意向 UV（虚构）----
  channelIntent: [
    { channel: "渠道一", value: 100 },
    { channel: "渠道二", value: 60 },
    { channel: "渠道三", value: 40 },
  ],

  // ---- 月度意向同比（虚构）----
  trend: [
    { month: "5月", last: 80, now: 100 },
    { month: "6月", last: 90, now: 100 },
  ],

  // ---- 转化漏斗（虚构）----
  funnel: [
    { stage: "曝光", value: 500, color: "blue" },
    { stage: "意向", value: 200, color: "purple" },
    { stage: "支付", value: 50, color: "pink" },
  ],

  // ---- 每日意向 UV 趋势（虚构，60 天）----
  daily: (function () {
    // 固定伪随机，不依赖 Math.random
    var seed = [12, 7, 5, 9, 11, 6, 8, 10, 7, 13, 9, 6, 8, 11, 7, 9, 10, 8, 12, 7, 9, 6, 11, 8, 10, 9, 7, 12, 8, 9, 10, 6, 8, 11, 7, 9, 10, 8, 6, 9, 11, 7, 8, 10, 9, 6, 8, 11, 7, 9, 10, 8, 6, 9, 11, 7, 8, 10, 9, 6, 8];
    var out = [];
    for (var i = 0; i < 60; i++) {
      out.push({ day: i + 1, value: seed[i] * 1000 });
    }
    return out;
  })(),

  // ---- 景区列表（父，虚构名称 A/B/C/D）----
  scenics: [
    {
      id: "A",
      name: "景区 A",
      intent: 100,
      paid: 25,
      gtv: 200,
      delta: 0.20,
      children: [
        { name: "景区 A · 主票", intent: 60, paid: 15, gtv: 120 },
        { name: "景区 A · 套票", intent: 25, paid: 6, gtv: 50 },
        { name: "景区 A · 增值", intent: 15, paid: 4, gtv: 30 },
      ],
    },
    {
      id: "B",
      name: "景区 B",
      intent: 80,
      paid: 20,
      gtv: 160,
      delta: 0.10,
      children: [
        { name: "景区 B · 主票", intent: 50, paid: 12, gtv: 100 },
        { name: "景区 B · 套票", intent: 20, paid: 5, gtv: 40 },
        { name: "景区 B · 增值", intent: 10, paid: 3, gtv: 20 },
      ],
    },
    {
      id: "C",
      name: "景区 C",
      intent: 120,
      paid: 30,
      gtv: 240,
      delta: 0.30,
      children: [
        { name: "景区 C · 主票", intent: 70, paid: 18, gtv: 140 },
        { name: "景区 C · 套票", intent: 30, paid: 8, gtv: 60 },
        { name: "景区 C · 增值", intent: 20, paid: 4, gtv: 40 },
      ],
    },
    {
      id: "D",
      name: "景区 D",
      intent: 60,
      paid: 15,
      gtv: 120,
      delta: -0.08,
      children: [
        { name: "景区 D · 主票", intent: 35, paid: 9, gtv: 70 },
        { name: "景区 D · 套票", intent: 15, paid: 4, gtv: 30 },
        { name: "景区 D · 增值", intent: 10, paid: 2, gtv: 20 },
      ],
    },
  ],

  // ---- 品类构成（堆叠柱，虚构）----
  category: [
    { name: "景区 A", main: 60, extra: 40 },
    { name: "景区 B", main: 50, extra: 30 },
    { name: "景区 C", main: 70, extra: 50 },
    { name: "景区 D", main: 35, extra: 25 },
  ],

  // 调色板（鲜亮多彩）
  palette: {
    blue: "#4f7cff",
    teal: "#06c4d4",
    green: "#18c96f",
    amber: "#ff9f2e",
    pink: "#ff5fa8",
    purple: "#9b5cff",
    slate: "#6b7390",
    ink: "#1a1f2e",
    inkSoft: "#4a5366",
    line: "rgba(79,124,255,0.12)",
  },
};
