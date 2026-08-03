/**
 * dashboard-data.js — 脱敏演示数据（全部为虚构，仅用于展示看板形态）
 * 不含真实景区名、真实指标数字、内部链接。
 */
window.DASH_DATA = {
  meta: {
    title: "景区增长数据看板（演示）",
    note: "演示用脱敏数据 · 数字与景区名均为虚构",
    channels: ["美团", "携程", "微信"],
    months: ["5月", "6月"],
    years: ["2025", "2026"],
  },

  // 顶部 KPI（模拟，2026 年 5–6 月合计）
  kpi: [
    { label: "意向 UV", value: 1284000, unit: "", delta: 0.183 },
    { label: "支付 UV", value: 316000, unit: "", delta: 0.142 },
    { label: "转化率", value: 0.246, unit: "", delta: -0.012, isRate: true },
    { label: "GTV", value: 86420000, unit: "元", delta: 0.221 },
  ],

  // 各渠道意向 UV（模拟）
  channelIntent: [
    { channel: "美团", value: 612000 },
    { channel: "携程", value: 418000 },
    { channel: "微信", value: 254000 },
  ],

  // 月度意向 UV 趋势（模拟，同比）
  trend: [
    { month: "5月", y2025: 540000, y2026: 652000 },
    { month: "6月", y2025: 588000, y2026: 632000 },
  ],

  // 景区列表（父 POI，虚构名称）
  scenics: [
    {
      id: "A",
      name: "景区 A",
      intent: 412000,
      paid: 98000,
      gtv: 28400000,
      delta: 0.205,
      // 子 POI（虚构）
      children: [
        { name: "景区 A · 主票", intent: 248000, paid: 62000, gtv: 18200000 },
        { name: "景区 A · 套票", intent: 98000, paid: 21000, gtv: 6400000 },
        { name: "景区 A · 增值项目", intent: 66000, paid: 15000, gtv: 3800000 },
      ],
    },
    {
      id: "B",
      name: "景区 B",
      intent: 358000,
      paid: 84000,
      gtv: 21200000,
      delta: 0.094,
      children: [
        { name: "景区 B · 主票", intent: 210000, paid: 52000, gtv: 13400000 },
        { name: "景区 B · 套票", intent: 88000, paid: 19000, gtv: 5200000 },
        { name: "景区 B · 增值项目", intent: 60000, paid: 13000, gtv: 2600000 },
      ],
    },
    {
      id: "C",
      name: "景区 C",
      intent: 514000,
      paid: 134000,
      gtv: 36800000,
      delta: 0.268,
      children: [
        { name: "景区 C · 主票", intent: 312000, paid: 84000, gtv: 23800000 },
        { name: "景区 C · 套票", intent: 124000, paid: 32000, gtv: 8800000 },
        { name: "景区 C · 增值项目", intent: 78000, paid: 18000, gtv: 4200000 },
      ],
    },
  ],
};
