# CHANGELOG

> 记「改了什么 + 为什么」。数值调整必须写出 旧值 → 新值。
> 这份文件是解释"某个数字为什么长这样"的第一去处，CLAUDE.md 会指向它。
> 用 `/devlog` 让 Claude 自动追加。

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
