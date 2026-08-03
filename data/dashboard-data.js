/**
 * dashboard-data.js — 脱敏演示数据（景区经营数据看板）
 * 全部为虚构，仅复刻信息层级与配色，不含真实景区名/真实指标/内部链接。
 */
window.DASH_DATA = {
  meta: {
    title: "景区经营数据",
    subtitle: "2025 vs 2026 · 演示脱敏数据",
    note: "演示用脱敏数据 · 数字与名称均为虚构",
  },

  // ---- 顶部横向概览 ----
  overview: [
    { label: "总 GTV", value: 800, unit: "万", delta: 0.22 },
    { label: "意向 UV", value: 200, unit: "万", delta: 0.18 },
    { label: "支付 UV", value: 50, unit: "万", delta: 0.12 },
    { label: "转化率", value: 0.25, isRate: true, delta: -0.05 },
    { label: "客单价", value: 160, unit: "元", delta: 0.08 },
  ],

  // ---- 左侧：AOI 核心指标表（2025 vs 2026）----
  aoiTable: {
    title: "AOI 核心指标（2025 vs 2026）",
    columns: ["指标", "2025", "2026", "同比"],
    rows: [
      { metric: "曝光 UV", last: 500, now: 620, unit: "万" },
      { metric: "意向 UV", last: 160, now: 200, unit: "万" },
      { metric: "点击 UV", last: 90, now: 110, unit: "万" },
      { metric: "支付 UV", last: 42, now: 50, unit: "万" },
      { metric: "GTV", last: 650, now: 800, unit: "万" },
      { metric: "转化率", last: 0.26, now: 0.25, isRate: true },
      { metric: "客单价", last: 148, now: 160, unit: "元" },
      { metric: "退单率", last: 0.04, now: 0.03, isRate: true },
    ],
  },

  // ---- 左侧：GTV 结构拆分（柱状图）----
  gtvBreakdown: {
    title: "GTV 结构拆分",
    bars: [
      { name: "主票", value: 400, color: "blue" },
      { name: "套票", value: 220, color: "yellow" },
      { name: "增值", value: 120, color: "purple" },
      { name: "其他", value: 60, color: "green" },
    ],
  },

  // ---- 右侧：指标卡排行榜 ----
  kpiCards: {
    title: "指标速览",
    items: [
      { label: "主票 GTV", value: 400, unit: "万", trend: "up" },
      { label: "套票 GTV", value: 220, unit: "万", trend: "up" },
      { label: "增值 GTV", value: 120, unit: "万", trend: "up" },
      { label: "退单率", value: 0.03, isRate: true, trend: "good-down" },
      { label: "低分景区数", value: 2, unit: "个", trend: "watch" },
    ],
  },

  // ---- 右侧：核心指标同比分组柱状图 ----
  compare: {
    title: "核心指标同比分析",
    groups: [
      { name: "曝光", last: 500, now: 620 },
      { name: "意向", last: 160, now: 200 },
      { name: "点击", last: 90, now: 110 },
      { name: "支付", last: 42, now: 50 },
    ],
    legend: ["2025", "2026"],
  },

  // ---- 底部：关键结论 ----
  conclusions: [
    { type: "pos", text: "总 GTV 同比 +22%，增长主要由套票拉动" },
    { type: "pos", text: "支付 UV 与意向 UV 双增，转化漏斗健康" },
    { type: "warn", text: "转化率同比 -5%，需关注支付环节流失" },
    { type: "neg", text: "低分景区 2 个，需重点治理信息质量" },
  ],

  // 调色板
  palette: {
    blue: "#3b82f6",
    green: "#10b981",
    yellow: "#f5c518",
    purple: "#8b5cf6",
    red: "#ef4444",
    orange: "#f59e0b",
    slate: "#64748b",
    ink: "#1f2937",
    inkSoft: "#475569",
    inkMute: "#94a3b8",
    line: "#eef1f5",
  },
};
