# CHANGELOG

> 记「改了什么 + 为什么」。数值调整必须写出 旧值 → 新值。
> 这份文件是解释"某个数字为什么长这样"的第一去处，CLAUDE.md 会指向它。
> 用 `/devlog` 让 Claude 自动追加。

## 2026-10-26 · 官网全面升级至最新工程化脚手架标准 (v2.0) 与双语实机宣传片生成

- **Remotion 双语宣传视频工程与 1080p 60fps 资产生成**：
  - 在 `/Users/blake/Mcode/mProj/projs-home/projs-video/yanghaowa-video` 创建基于 Remotion 的宣传片渲染流水线。
  - 编排 8 大全景章节（0-18岁分龄主线、iPhone Duo双屏虚拟客厅、身体心理财商三线、3D伴宠问问与BYOK AI、拍立得回忆相框墙、时光家书未来胶囊、零云端纯本地隐私、品牌终章）。
  - 渲染生成 `promo.mp4` / `promo-en.mp4` 及高清封面 `cover.png` / `cover-en.png`。
  - 运行 `scripts/embed-cover.sh` 脚本，将封面写入视频 Stream #0:0 第 0 帧与 MP4 容器 attached_pic (covr atom)，并开启 faststart，完美兼容国内外各大视频社交平台。
- **官网多媒体实机剧场 (#video) 与互动沙盘系统上线**：
  - 新增 `#video` 官方宣传片影院，集成 8 个时间戳章节跳转 Pills（带时间监听高亮与点击快跳）及 Hero 区域直达快跳按钮。
  - 新增 `#sandbox` 交互式体验工作台：
    1. **0-18 岁分龄生命周期切换台**：支持 0-1岁、1-3岁、3-6岁、6-18岁四大阶段动态看板即时切换，展现健康/心理/财商三线指标与成长里程碑；
    2. **iPhone Duo 3D 双屏折叠仿真模拟器**：支持 8.1" 展开态双屏（左屏 3D 虚拟客厅 + 右屏成长手账）与 5.4" 折叠外屏单手顺手记形态切换；
    3. **拍立得时光家书与未来胶囊工作台**：支持多主题瞬间切换，拍立得照片与 3D 翻转封存家书信件交互。
  - 新增 `#compare` 7-Axis 全景对比矩阵，从账号体系、年龄跨度、主线深度、AI 隐私、双屏适配、数据迁移、商业模式等 7 个核心维度横向对标传统云端打卡产品。
- **前端架构工程化与双语对齐**：
  - 提取并重构 `app.js` 企业级互动引擎，覆盖主题切换、滚动进度、Hero 粒子系统、视频章节联动、沙盘状态机与伴宠问问漫游拖拽。
  - `style.css` 升级暖色调珊瑚橙与米色调令牌设计系统，完善深浅色自适应与无障碍 prefers-reduced-motion 支持。
  - 同步更新中英双语页面（`index.html` 与 `index.en.html`），保持视觉与功能 100% 对齐。
  - `site.config.json` 更新 `updated: 2026-10-26`，运行 `make build` 重建全站 GEO 并通过 `geo-check` 体检。

## 2026-09-06

- 工程初始化（aic 脚手架生成）

## 2026-09-08 · 英文名改为 Grow Together
- 英文品牌名不再用拼音 Yanghaowa（老外看不懂），与 App 英文界面 / 英文桌面名一致，定为 Grow Together
  （曾短暂改成 Raisewell，用户比较后选回 Grow Together）。官网英文页、site.config 英文字段、JSON-LD 全部
  同步；`Yanghaowa` 留在 altNames 里当别名，域名 yanghaowa.top 不变。
- 新增英文法律页 privacy.en / terms.en / support.en 及华为渠道英文版；中英页面互链。

## 2026-09-17 · 配置 App Store 商店链接
- `site.config.json` 中的 `links.appStore` 填入 Apple Store 官方跳转链接（`https://apps.apple.com/app/id6810539038`，Apple ID: 6810539038）。
- 首页（`index.html`、`index.en.html`）更新 App Store 下载按钮为真实跳转链接（在新标签页打开），添加 Apple 矢量图标，状态由「即将上架」更新为「已上架」（英文为「Available now」），并同步更新商店说明文案。
- `style.css` 完善 `.store-btn .ic` 对齐样式及内部 SVG 尺寸与颜色自适应。
- 运行 `make build` 全量重新生成 GEO 资产（`llms.txt`、`llms-full.txt`、`sitemap.xml` 及全站 HTML 中的 JSON-LD `installUrl`），并执行 `make geo-check` 一致性检查全部通过。

## 2026-10-20 · 接入 Google Analytics 4 + 百度统计全站与 SPA 路由统计
- `site.config.json` 新增 `site.ga4: "G-1CQNQNPK1Y"` 与 `site.baidu: "b3a7b6fedcba22d39897693d6f716035"`，与 `ai-chen2050.github.io` 主站共用同一统计 ID，解决 GitHub Pages 子路径（`/yanghaowa/`）独立仓库页面不继承主站统计代码导致无访问数据的问题。
- 升级 `tools/gen_geo.py`、`tools/build_devlog.py` 与 `tools/geo_check.py`：向全站 16 个 HTML 页面（含中英双语、华为渠道合规页及 `devlog/*.html`）自动注入 `gtag.js`、`hm.baidu.com/hm.js` 及 `history.pushState` / `replaceState` / `popstate` / `hashchange` 路由切换 `page_view` + `_trackPageview` 上报，并通过 `geo-check` 校验。
