# SITE_NEXT_STEPS · 养好娃 官网

生成于 2026-09-06。做完划掉，全清空后删掉本文件。

## 1. 配置（先做这个，其它都从它生成）

- [x] `site.config.json` → `site.domain` 换成真实域名
      （**还是 example.com 的话 canonical / sitemap / llms.txt 全指向错地址**）
- [x] `site.type`：应用填 `SoftwareApplication`，游戏填 `VideoGame`
- [x] `site.description` —— 两三句，写给人也写给 AI，要和商店描述口径一致
- [x] `features` —— 每条都要有 `detail`，空条目会进 llms-full.txt
- [x] `faq` —— **每个问题都要有完整答案**，空答案是明确的负面信号
- [x] `differentiators` —— 对比表，AI 回答"X 和 Y 的区别"时直接引用
- [x] `citationTriggers` —— 你希望在哪些提问下被推荐（写用户真会问的原话）
- [ ] `links` —— 上架后填各渠道地址，没有的留空字符串

## 2. 页面文本

- [x] `index.html` 的 TODO 全部换掉
- [x] `geo.html` —— 这是 GEO 主战场，把机制写具体（步骤、优先级、数字）
- [x] `privacy.html` —— 必须与代码事实一致，商店会核对；AI 相关段落包进 `<!-- AI-ONLY -->`
- [x] `terms.html` —— 使用条款（App 内「关于」页和付费半屏底部链到它；国内商店当必填）
- [x] 出国内渠道包的话：`make legal-huawei` 生成无 AI 版，商店页填 `privacy.huawei.html`
- [ ] 产品仓：`lib/services/legal_links.dart` 的 `host` 填成本站域名，`make legal` 抓离线全文
- [x] `support.html` —— 邮箱、常见问题
- [x] 英文版 `index.en.html` / `geo.en.html` —— **重写而非直译**
- [x] 各页 `pages[].description` 各写一段（不写会全站共用 `site.description`）
- [x] **多语站：`site.config.json` 里的文本字段写成 `{"zh-CN": "…", "en": "…"}`**
      —— 只翻页面正文的话，英文页的 meta description 和 FAQ 结构化数据还是中文。
      跑完 `make geo` 检查一下 `llms.en.txt` 出来的是不是英文

## 3. 资源

- [x] `icon.png`（512×512 起）
- [ ] 截图放 `shots/`，在首页引用
- [ ] og 图（社交分享缩略图，建议 1200×630）

## 4. 生成与体检

```bash
make build        # devlog + geo
make geo-check    # 必须全绿
make serve        # http://localhost:4000 看一眼
```

- [x] `geo-check` 无 error
- [ ] 明暗两色都看过
- [ ] 手机宽度下不横向滚动

## 5. 部署

- [ ] 推到 GitHub
- [ ] 仓库 Settings → Pages → Source 选 **GitHub Actions**
- [ ] 自定义域名：Settings → Pages → Custom domain，并在 DNS 加 CNAME
- [ ] 部署后线上验：
      ```bash
      curl -s https://你的域名/llms.txt | head -20
      curl -sI https://你的域名/ | head -5
      ```

## 6. 接进发版流程

- [ ] 在产品仓库的发版清单里确认有"同步官网"这一步
- [ ] 每次发版跑 `/geo-refresh <产品仓路径>`

## 7. 持续

- [x] 每月在 ChatGPT / Claude / Perplexity 里问一遍 `citationTriggers` 里的问题，
      记录会不会提到你、信息对不对
- [ ] 每次有值得讲的技术决策就写一篇开发日记（`/devlog-new`）——
      长内容才是被 AI 引用的主体
