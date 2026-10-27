# CHANGELOG

> 记「改了什么 + 为什么」。数值调整必须写出 旧值 → 新值。
> 这份文件是解释"某个数字为什么长这样"的第一去处，CLAUDE.md 会指向它。
> 用 `/devlog` 让 Claude 自动追加。

## 2026-10-26 · 官方宣传片电影级重构：真实交互微手势、九维性格雷达动态形变、亲子温情专属钢琴配乐与全套拟音落地

- **告别静态假动效，全片植入真机操作微动效与触控手势**：
  - 引入真实触控光标组件（`TouchCursor`），支持贝塞尔自然滑动、下压点击（`scale: 0.82`）与水波纹扩散光环（ripple）；
  - **镜头 1（顺手记实机交互）**：触控光标点击户外时长 `+` 键，数值由 `45` 弹跳递增至 `60 分钟` 并点亮达成徽章；点击亲子任务弹出绿勾 `✓`；
  - **镜头 2（iPhone Duo 3D 双屏折叠客厅）**：单屏丝滑展开为 8.1" 双屏（`940×640`）；点击左屏相框热点，右屏伴随纸张翻折声推入真实相册回忆墙；点击信箱热点切换时光信；
  - **镜头 3（核心王牌：九维性格雷达模拟器）**：触控光标拖拽教养滑块（回应程度由 55% 拖至 88%，规则清晰由 45% 拖至 85%），**SVG 九维性格雷达多边形顶点同帧平滑向外舒展形变**，绿色真实投点脉动，因果推演直观震撼；
  - **镜头 4（WHO 生长曲线与疫苗时钟）**：SVG 动态路径绘制生长轨迹线，在 108.5 cm 处点亮高光光斑，疫苗闹钟准点排期；
  - **镜头 5（3D 伴宠问问与 BYOK AI 隐私卡）**：问问探头弹跳后，一张超大高对比度毛玻璃「发送前取数说明」卡片向屏幕中央飞跃放大，绿勾授权、红标严格封锁姓名与生日；
  - **镜头 6（拍立得时光家书与 3D 翻转火漆印）**：真实微距摄影拍立得相框，点击后在三维空间中 **180° 翻转（`rotateY: 180deg`）**，展现带有猩红立体滴蜡火漆印章与温情手写家书的古雅信笺；
  - **镜头 7（纯本地无云端与定价矩阵）**：数据安全盾牌与 ¥0 免费版 / ¥188 终身买断版 / 弹性订阅双方案矩阵；
  - **镜头 8（品牌终章定格）**：App 图标居中展开，配合长达 3.5 秒的静谧呼吸留白。
- **配乐与声音设计彻底贴合育儿主题**：
  - 剔除原本快节奏的做饭 Pop 音乐，换用 Kevin MacLeod 为家庭纪录片创作的经典温情钢琴弦乐作品 **《Heartwarming》（暖心时刻）** 原声（`bgm-parenting-heartwarming.mp3`）；
  - 编排全片温润低频电影拟音系统（柔光升起 `transition-soft`、微触控 `ui-select-modern`、纸张翻阅 `paper-page-turn`、晶莹微光 `chime-crystal`、深邃落版 `impact-deep-whoosh`）。
- **画面对比度与色彩饱和度大幅提升**：
  - 文本采用深邃暖黑 `#1C1917`（900 字重）与 `#44403C`，彻底杜绝发虚发灰；
  - 悬浮卡片配合纯白 `#FFFFFF` 与多层深度物理阴影（`box-shadow: 0 28px 60px rgba(60,20,10,0.18)`）；
  - 渲染生成中英双语 1080p 60fps 成片，并将对应语种封面同时写入视频 Stream 0:0 第 0 帧与 MP4 容器 `attached_pic`。

## 2026-10-26 · 官网商业化全面升级：主流商业级排版设计、终身买断与灵活订阅定价矩阵、11 组定制商业图样与真机实机截图画廊上线

- **视觉与商业排版主流化（比照企业级设计系统 v2.5）**：
  - 彻底摒弃传统个人开源站质感，全面引入主流 SaaS/商业工具标准排版体系（Canvas 粒子星轨、动态导航版本药丸 `v1.1.0`、大厂背书信任条、8.1" iPhone Duo 展开态与 6.9" 旗舰机同屏双机舞台）。
  - **杜绝一切偷懒套用吉祥物（问问）占位行为**：生成并置入 11 组高精度定制商业插画与里程碑实拍摄影：
    - `assets/memory-bike.jpg`、`assets/memory-grad.jpg`、`assets/memory-leaf.jpg`（真实童年里程碑摄影，用于沙盘 03 拍立得与时光家书）；
    - `assets/stage-0-1.jpg`、`assets/stage-1-3.jpg`、`assets/stage-3-6.jpg`、`assets/stage-6-18.jpg`（3D 等轴测微缩温情儿童房场景，用于沙盘 01 0-18岁分龄生命周期切换台）；
    - `assets/pillar-health.jpg`、`assets/pillar-mind.jpg`、`assets/pillar-money.jpg`（健康/心理/财商 3D 等轴测艺术卡片，用于三条主线）；
    - `assets/living-room-3d.jpg`（高精 3D 全景家庭客厅画卷，用于沙盘 02 iPhone Duo 双屏客厅）。
- **实机截图画廊 (#shots) 与全屏灯箱 (#lb)**：
  - 彻底用 App Store 真实实机截图替换旧版纯 CSS 原型卡片；
  - 引入 `shots/s-duo-home.jpg`、`shots/s-duo-report.jpg`、`shots/s-duo-memory.jpg`（iPhone Duo 8.1" 展开态双屏）、`shots/s-home.jpg`、`shots/s-report.jpg`、`shots/s-growth.jpg`、`shots/s-interests.jpg`、`shots/s-hub.jpg`、`shots/s-privacy.jpg`（单屏真机高清样张）；
  - 支持多分类过滤（全部、iPhone Duo、日常与报告、健康与心理、隐私安全）与点击放大灯箱查看；与六大功能卡片（`.feat[data-shot]`）点击直接联动唤起。
- **全新商业定价矩阵体系上线 (#pricing)**：
  - **🌱 基础免费版**：¥0 / $0 永久免费，核心功能无广告、0 门槛随身速记；
  - **👑 Pro 终身买断版（主推）**：¥188 / $27.99 一次性买断，永久尊享（华为渠道版为 ¥69 买断），多孩档案、无限纪念墙、时光信滴蜡封存、深度成长趋势与 AI 解读；
  - **⚡ Pro 弹性订阅版**：支持年付 ¥168/年（$24.99/yr，折合 ¥14/月，立省 22%）与月付 ¥18/月（$2.99/mo），带交互式按年/按月切换开关（`billing-opt`）；
  - **🧠 专家技能包**：¥6 / $0.99 每个独立买断，按需选装、不绑架主套餐。
- **沙盘深度互动升级**：
  - **沙盘 01**：集成 0-18 岁生命周期 3D 模型看板 + 九维性格雷达控制台（4 大教养预设芯片、6 项教养滑块联动形变 SVG 多边形、真实投点与心理学推演结论）；
  - **沙盘 02**：集成 3D 全景客厅 4 大交互热点（回忆墙、慢递信箱、问问、成长手账），点击左屏热点右屏实时联动更新；
  - **沙盘 03**：拍立得时光卡片点击即时换装，支持 3D 翻转查看滴蜡信件。
- **法律条款与渠道同步**：
  - 更新 `terms.html` 与 `terms.en.html` 第三条商业定价规范；
  - 执行 `make legal-huawei` 自动重新生成去 AI 的华为渠道法律条款；
  - 执行 `make build && make geo-check`，全站 14 页面及 llms/sitemap 一致性体检 100% 通过。

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