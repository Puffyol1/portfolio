# 计奕佳 · 个人作品集

纯静态单页作品集网站。零构建、零依赖、零后端。

视觉：乳白浅底 + 温暖浅蓝荧光描边 + 毛玻璃卡片。标题用思源宋体（Noto Serif SC），正文用 Inter，首屏英文名用系统花体字。字体通过 Google Fonts 加载，首次访问需联网。

## 本地预览

任选其一：

```bash
# 方式一：Python 内置服务器
cd portfolio
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000

# 方式二：直接双击 index.html 也可（无服务端依赖）
```

## 目录结构

```
portfolio/
├── index.html          # 单页结构
├── css/style.css       # 样式（设计令牌 + 响应式 + 组件）
├── js/main.js          # 渲染与交互
├── data/content.js     # 所有文本内容（更新内容只改这里）
└── README.md
```

## 更新内容

所有文本集中在 `data/content.js`，按区块组织：`hero` / `about` / `experience` / `projects` / `skills` / `contact` / `footer`。
直接编辑该文件即可，无需改动 HTML / CSS / JS。

## 部署

### Netlify
1. 拖动整个 `portfolio/` 文件夹到 Netlify 面板（Drag and drop）。
2. 或连接 Git 仓库，Build command 留空，Publish directory 填 `portfolio`。

### GitHub Pages
将 `portfolio/` 内容推到仓库，在 Settings → Pages 选择分支与根目录即可。

## 联系方式

GitHub 链接已填好（`https://github.com/Puffyol1`）。如需新增其他渠道（如 LinkedIn、邮箱），在 `data/content.js` 的 `contact.channels` 数组里追加一条即可：

```js
channels: [
  { label: "GitHub", href: "https://github.com/Puffyol1", hint: "Code & Projects" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yourname", hint: "Professional" },
]
```

> 隐私约定：邮箱与手机号已按用户意愿明文展示于联系方式区。如担心被爬虫抓取，可改为防爬写法（邮箱用 `name [at] domain`、隐藏手机）。美团相关经历仅使用脱敏概括，不含景区名、内部数据、后台截图与内部链接。
