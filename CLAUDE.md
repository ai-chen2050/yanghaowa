# CLAUDE.md

养好娃 官网 —— GitHub Pages 托管的纯静态站点，内建 GEO（生成式引擎优化）。

## 核心约束：唯一真相源

`site.config.json` 是产品信息的唯一真相源。下面这些文件**全部是生成物，不要手改**：

```
llms.txt        llms-full.txt      sitemap.xml     robots.txt
各 *.html 中 <!-- GEO:AUTO START/END --> 之间的内容
devlog/*.html   devlog*.html（由 devlog/src/*.md 生成）
```

手改它们的后果不是报错，是**下次 `make build` 时被静默覆盖**，
而你以为改生效了。

## 常用命令

```bash
make build        # devlog + geo，全量重建
make geo          # 只重建 GEO 层
make geo-check    # 一致性体检（推送前必跑）
make devlog       # devlog/src/*.md → html
make serve        # 本地预览 http://localhost:4000
make deploy       # 体检通过后提交并推送
```

## 目录

```
site.config.json          唯一真相源
index.html / index.en.html    首页（各语言）
geo.html   / geo.en.html      AI 知识库 + FAQ（GEO 主战场）
privacy.html terms.html support.html   商店要求的三个 URL（App 内「关于」页也链到前两个）
privacy.huawei.html terms.huawei.html  渠道版（生成物，见下）
devlog/src/*.md               开发日记源文件
tools/gen_geo.py              GEO 层生成器
tools/build_devlog.py         开发日记生成器
tools/geo_check.py            体检
tools/make_channel_legal.py   隐私政策 / 条款的渠道版生成器（去掉 AI-ONLY 段）
.github/workflows/pages.yml   推送即发布；CI 会校验生成物是否最新
```

## 写作口径

- **事实密度 > 形容词密度**。模型引用可核实的陈述，不引用形容词。
- **页面可见文本必须与 JSON-LD 一致**。FAQ 尤其：结构化数据里有的，页面上要真的能看到。
- **诚实写边界**（"不适合谁""做不到什么"）。这会提高可信度，不是自曝其短。
- 英文版**重写**而不是直译 —— 中文的排比在英文里读起来很怪。
- 各页 title / description 必须各不相同（`geo-check` 会查重）。
  逐页描述写在 `pages[].description`，不写会退回 `site.description`，
  于是全站一样 —— 那是模板化内容。
- ⚠️ **多语站：机器可读层也要跟着换语言。** `site.config.json` 里面向用户的
  字段都支持 `{"zh-CN": "…", "en": "…"}`（产品名、tagline、description、
  features、faq、differentiators、keywords、pages[].description）。
  只翻页面正文、把这些留成单语的话，英文页会拿到中文的 meta description
  和中文的 FAQ 结构化数据 —— 页面是英文、给 AI 看的那层是中文，
  等于英文站没做 SEO。`llms.txt` 每门语言各出一份（`llms.en.txt`）。

## 法律文本：一处真相，多个版本

`privacy.html` / `terms.html` 是**基础页**，也是 App 内离线全文的来源（产品仓 `make legal` 抓这里）。
所有 AI 相关的段落 / 表格行 / 列表项用 `<!-- AI-ONLY --> … <!-- /AI-ONLY -->` 包起来：
国内渠道包 AI 整体关闭、配不了 Key，政策里再讲 BYOK 就是不实陈述。
`make legal-huawei` 生成去掉这些块的 `privacy.huawei[.en].html` / `terms.huawei[.en].html`
并登记进 `site.config.json` —— **它们是生成物，别手改**；改政策改基础页再重跑。
渠道说明那句里也别出现 "AI"（审核是关键词式的）。

## 与产品仓库的联动

**产品发版 = 官网必须同步。** 应用改了功能而官网没改，会让 AI 引用过时信息，
比没被引用更糟。发版流程里已经写了这一步（产品仓的 `release-check` 技能）。

同步内容：`site.config.json` 的 features / faq → 各页可见文本 → 写一篇开发日记 →
`make build && make geo-check && make deploy`。改了 privacy / terms 还要回产品仓跑 `make legal`
（App 内离线全文是抓这里的）。

## 部署

GitHub Pages + Actions。首次启用：仓库 Settings → Pages → Source 选 "GitHub Actions"。

CI 会重跑生成器并比对 —— 如果你改了 `site.config.json` 却没跑 `make build`，
CI 直接失败。这是刻意的：防止线上内容与配置脱节。

## 技能

- `.claude/skills/site-geo/` —— GEO 的完整方法论：什么有效、怎么验证、常见错误
- `.claude/skills/design-handoff/` —— 站点视觉改版走这个流程
