/* ==========================================================================
   养好娃 (Grow Together) · 商业级互动引擎 v2.5 (app.js)
   支持中英双语 (自动识别 document.documentElement.lang)
   包含：明暗主题切换、滚动进度条、官方产品宣传片章节快跳联动、Hero 光斑粒子、
         0-18岁分龄生命周期切换台（配 3D 微缩场景插画）、
         九维性格成长模拟器实时雷达工作台、
         iPhone Duo 3D 家庭客厅热点联动与折叠外屏沙盘、
         拍立得时光家书工作台（定制里程碑摄影动态切换）、
         真实实机截图分类画廊与灯箱 (#lb)、
         Pro 订阅年/月计费切换器、漫游伴宠问问 (Wenwen)
   ========================================================================== */
(function () {
  var IS_EN = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. 明暗主题切换 */
  (function () {
    var btn = document.getElementById('theme-toggle') || document.getElementById('themeBtn');
    if (!btn) return;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    function cur() {
      var t = document.documentElement.getAttribute('data-theme');
      return t || (mq.matches ? 'dark' : 'light');
    }
    function paint() {
      var d = cur() === 'dark';
      btn.textContent = d ? '☀️' : '🌙';
      btn.setAttribute('aria-label', d ? (IS_EN ? 'Switch to light theme' : '切换到浅色主题') : (IS_EN ? 'Switch to dark theme' : '切换到深色主题'));
    }
    paint();
    btn.addEventListener('click', function () {
      var next = cur() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      paint();
    });
  })();

  /* 2. 顶部滚动进度条 */
  (function () {
    var bar = document.getElementById('prog');
    if (!bar) return;
    function upd() {
      var h = document.documentElement;
      var p = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1);
      bar.style.width = Math.min(100, Math.max(0, p * 100)) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    upd();
  })();

  /* 3. 官方实机宣传片章节快跳与联动控制 (#promoVideo) */
  (function () {
    var vid = document.getElementById('promoVideo');
    var pills = document.querySelectorAll('.chapter-pill[data-seek]');
    var watchBtn = document.getElementById('heroWatchBtn');
    if (!vid) return;

    var times = [];
    pills.forEach(function (btn, idx) {
      var t = parseFloat(btn.getAttribute('data-seek')) || 0;
      times.push({ btn: btn, t: t, idx: idx });
      btn.addEventListener('click', function () {
        pills.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        try {
          vid.currentTime = t;
          var p = vid.play();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        } catch (e) {}
      });
    });

    vid.addEventListener('timeupdate', function () {
      var cur = vid.currentTime || 0;
      var activeIdx = 0;
      for (var i = 0; i < times.length; i++) {
        if (cur >= times[i].t - 0.25) activeIdx = i;
      }
      times.forEach(function (item, idx) {
        item.btn.classList.toggle('active', idx === activeIdx);
      });
    });

    if (watchBtn) {
      watchBtn.addEventListener('click', function (e) {
        var sec = document.getElementById('video');
        if (!sec) return;
        e.preventDefault();
        sec.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
        setTimeout(function () {
          try {
            var p = vid.play();
            if (p && typeof p.catch === 'function') p.catch(function () {});
          } catch (_) {}
        }, 350);
      });
    }
  })();

  /* 4. Hero 粒子与光斑跟随 */
  (function () {
    var hero = document.getElementById('hero');
    var spot = document.getElementById('spot');
    if (hero && spot && !REDUCE) {
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        spot.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        spot.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    }

    var cvs = document.getElementById('heroCanvas');
    if (!cvs || REDUCE) return;
    var ctx = cvs.getContext('2d');
    var w = 0, h = 0, raf = null, running = true;
    var pts = [];
    function resize() {
      var r = cvs.parentElement.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cvs.width = w * dpr; cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    for (var i = 0; i < 28; i++) {
      pts.push({
        x: Math.random() * (w || 1000),
        y: Math.random() * (h || 600),
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.18 - Math.random() * 0.35,
        r: 2 + Math.random() * 3.2,
        a: 0.14 + Math.random() * 0.38
      });
    }
    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 138, 91, ' + p.a + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    var io = new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      if (running && !raf) draw();
      else if (!running && raf) { cancelAnimationFrame(raf); raf = null; }
    }, { threshold: 0.05 });
    io.observe(cvs);
  })();

  /* 5. 沙盘一：0-18岁分龄生命周期切换台（含 3D 微缩房间插画） */
  (function () {
    var btns = document.querySelectorAll('.stage-tab-btn[data-stage]');
    var container = document.getElementById('stageSandboxView');
    if (!btns.length || !container) return;

    var STAGES_DATA = {
      '0-1': {
        avatar: '👶',
        img: 'assets/stage-0-1.jpg',
        imgCap: IS_EN ? '0-1Y Nursery · WHO Growth & Vaccine Schedule' : '0-1 岁婴儿房 · WHO 曲线与百白破疫苗排期',
        title: IS_EN ? '0-1 Years · Infant Health & Routine' : '0-1 岁 · 婴儿萌芽与节律舱',
        stageTag: IS_EN ? 'Infant Milestone' : '婴儿发育里程碑',
        summary: IS_EN
          ? 'Tracking milk feeding, sleep cycles, WHO percentiles, and vaccine schedules with zero cloud leaks. No pocket-money clutter at age zero.'
          : '奶量与辅食记录、昼夜睡眠节律、WHO 权威百分位身高体重头围曲线，出生后疫苗按生日精准推算。此阶段自动隐藏零花钱等高龄面板。',
        metrics: [
          { l: IS_EN ? 'Feeding' : '母乳与辅食', v: IS_EN ? '6 feeds / 780ml' : '6 次 / 780ml', badge: IS_EN ? 'Balanced' : '达标' },
          { l: IS_EN ? 'Sleep Cycles' : '昼夜作息', v: IS_EN ? '14.5 hrs / day' : '14.5 小时 / 天', badge: IS_EN ? 'Optimal' : '良好' },
          { l: IS_EN ? 'Next Vaccine' : '下一针疫苗', v: IS_EN ? 'Polio DTP #3' : '百白破第 3 针 (本机闹钟)', badge: IS_EN ? '7 Days Left' : '剩 7 天' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Standard WHO percentile curves for weight, length, and head circumference.' : 'WHO 生长曲线对照，出牙期与翻身、独坐大动作发育里程碑。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Attachment bond, eye contact, responsive soothing without sleep-training stress.' : '母婴安全依恋建立、视线追焦、温和回应式安抚与感官探索。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商萌芽', desc: IS_EN ? 'Zero chores at this stage; baby cost bookkeeping for diapers & care.' : '婴儿期不弹心愿储蓄；专注记录家庭尿布、奶粉与医疗真实开销账本。' }
        ]
      },
      '1-3': {
        avatar: '🧒',
        img: 'assets/stage-1-3.jpg',
        imgCap: IS_EN ? '1-3Y Toddler Room · Motor Skills & Vocabulary' : '1-3 岁学步探索房 · 语言爆发与物权启蒙',
        title: IS_EN ? '1-3 Years · Toddler Exploration & Language' : '1-3 岁 · 幼童探索与语言舱',
        stageTag: IS_EN ? 'Toddler Language & Autonomy' : '学步与语言爆发期',
        summary: IS_EN
          ? 'Potty independence, language explosion, responsive feeding, and 9-axis personality radar initial setup.'
          : '自主如厕过渡、双词短句语言爆发、自主进食、九维性格雷达预填父母教养方式测评起点。',
        metrics: [
          { l: IS_EN ? 'Outdoor Active' : '户外阳光活动', v: IS_EN ? '110 mins' : '110 分钟 / 天', badge: IS_EN ? 'Goal: 120m' : '目标 120' },
          { l: IS_EN ? 'Vocabulary' : '日常表达词汇', v: IS_EN ? '260+ words' : '260+ 词汇积累', badge: IS_EN ? 'Surging' : '爆发期' },
          { l: IS_EN ? 'Personality Dots' : '家里在练什么', v: IS_EN ? '8 dimensions logged' : '8 个维度已投点', badge: IS_EN ? 'Active' : '已生成' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Step-by-step motor skills, finger food transition, oral care brushing twice daily.' : '粗大动作奔跑跳跃、自主抓握餐食、早晚乳牙氟保护与刷牙打卡。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Tantrum containment, emotional naming, bedtime picture book routine.' : '第一逆反期情绪接纳、给情绪起名字、睡前绘本高质量陪伴。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商人格', desc: IS_EN ? 'Recognizing toy ownership, sharing concepts, delayed gratification play.' : '物权意识萌芽（「这是我的」）、不强迫分享、简单等待与交换游戏。' }
        ]
      },
      '3-6': {
        avatar: '👧',
        img: 'assets/stage-3-6.jpg',
        imgCap: IS_EN ? '3-6Y Preschool · Emotion Cards & Wish Piggy Bank' : '3-6 岁学龄前 · 情绪卡片、护眼与第一个心愿罐',
        title: IS_EN ? '3-6 Years · Kindergarten & Emotional IQ' : '3-6 岁 · 学龄前期自理与情商舱',
        stageTag: IS_EN ? 'Preschool EQ & Rules' : '入园适应与规则延迟满足',
        summary: IS_EN
          ? 'Strict screen time limits, peer conflict resolution, interest spark star-map, and first wish-savings piggy bank.'
          : '护眼户外与屏幕限额、入园社交冲突化解、兴趣火花八维星图，以及人生第一个心愿储蓄罐。',
        metrics: [
          { l: IS_EN ? 'Screen Guard' : '娱乐屏幕限额', v: IS_EN ? '30m / 60m max' : '30 分钟 / 上限 60', badge: IS_EN ? 'Safe' : '护眼达标' },
          { l: IS_EN ? 'Interest Spark' : '近 4 周兴趣火花', v: IS_EN ? 'Drawing · 11 days' : '画画涂色 · 11 天', badge: IS_EN ? '6 Self-initiated' : '6天主动' },
          { l: IS_EN ? 'Wish Savings' : '心愿储蓄进度', v: IS_EN ? '44% · LEGO Fire Truck' : '44% · 乐高消防车', badge: IS_EN ? 'Saving' : '攒钱中' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Far-sight reserve checks every 6 months, outdoor natural sunlight 2 hrs/day.' : '每半年远视储备与屈光检查、户外自然光照 2 小时/天、乳牙龋高发防护。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Peer sharing, recognizing frustration, daily parent praise reinforcement.' : '情绪识别与命名、规则与延迟满足、每周亲子任务与家庭挑战。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商人格', desc: IS_EN ? 'Growth fund & wish jar, distinguishing needs vs wants, family business game.' : '开启成长金与心愿储蓄、分清「需要」与「想要」、亲子小生意模拟。' }
        ]
      },
      '6-18': {
        avatar: '🧑‍🎓',
        img: 'assets/stage-6-18.jpg',
        imgCap: IS_EN ? '6-18Y Youth Desk · Allowance Ledger & Time Capsule' : '6-18 岁少儿与青春期 · 自主预算账本与 18 岁封存家书',
        title: IS_EN ? '6-18 Years · School Age & Autonomy' : '6-18 岁 · 学龄阶段与独立人格舱',
        stageTag: IS_EN ? 'Adolescent Autonomy' : '自主规划与青春期边界',
        summary: IS_EN
          ? 'Pocket money ledger, long-term wish goals, non-violent communication kits, and wax-sealed time capsules for age 18.'
          : '零花钱月度自主预算、长线心愿储蓄、青春期非暴力沟通锦囊，以及滴蜡封存至 18 岁成人礼的时光家书。',
        metrics: [
          { l: IS_EN ? 'Allowance Bank' : '独立零花钱预算', v: IS_EN ? '¥80 / month' : '¥80 / 月自主支配', badge: IS_EN ? 'Tracked' : '记账中' },
          { l: IS_EN ? 'Wish Goal' : '长线心愿目标', v: IS_EN ? '72% (Telescope)' : '天文望远镜 72%', badge: IS_EN ? 'On Track' : '进行中' },
          { l: IS_EN ? 'Time Capsule' : '封存时光家书', v: IS_EN ? 'Sealed for 18th B-Day' : '封存至 18 岁成人礼', badge: IS_EN ? 'Encrypted' : '滴蜡封存' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Postural spine checks, puberty physiological changes, regular sports training.' : '脊柱侧弯与视力追踪、青春期生理变化科普、睡眠与运动体能节律。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Boundary respect, intrinsic motivation, non-confrontational empathy.' : '尊重个人隐私边界、内驱力与抗挫力培养、把说教换成平视倾听。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商人格', desc: IS_EN ? 'Monthly budget allocation, duty vs paid chores, charity & responsibility.' : '月度预算自主分配、区分分内家务与劳动报酬、公益金与财富责任感。' }
        ]
      }
    };

    function renderStage(key) {
      var d = STAGES_DATA[key];
      if (!d) return;

      var metricsHtml = d.metrics.map(function (m) {
        return '<div class="stage-metric-card">' +
          '<div class="metric-top"><span class="metric-label">' + m.l + '</span><span class="metric-badge">' + m.badge + '</span></div>' +
          '<div class="metric-val">' + m.v + '</div>' +
          '</div>';
      }).join('');

      var threadsHtml = d.threads.map(function (t) {
        return '<div class="stage-thread-item">' +
          '<span class="thread-ic">' + t.icon + '</span>' +
          '<div><strong>' + t.name + '</strong><p>' + t.desc + '</p></div>' +
          '</div>';
      }).join('');

      container.innerHTML =
        '<div class="stage-hero-panel">' +
          '<div class="stage-top-grid">' +
            '<div class="stage-head-row" style="margin:0">' +
              '<div class="stage-avatar-box">' + d.avatar + '</div>' +
              '<div class="stage-titles">' +
                '<span class="stage-kicker-tag">' + d.stageTag + '</span>' +
                '<h3 class="stage-main-title">' + d.title + '</h3>' +
                '<p class="stage-desc-text">' + d.summary + '</p>' +
              '</div>' +
            '</div>' +
            '<div class="stage-visual-card">' +
              '<img src="' + d.img + '" alt="' + d.title + '" loading="lazy">' +
              '<div class="stage-visual-caption"><span>' + d.imgCap + '</span><span>✨ 3D 分龄场景</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="stage-metrics-row">' + metricsHtml + '</div>' +
          '<div class="stage-threads-grid">' + threadsHtml + '</div>' +
        '</div>';
    }

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderStage(btn.getAttribute('data-stage'));
      });
    });

    renderStage('3-6');
  })();

  /* 5B. 九维性格成长模拟器实时雷达工作台 (9-Axis Personality Radar Console) */
  (function () {
    var chips = document.querySelectorAll('.preset-chip[data-preset]');
    var poly = document.getElementById('simRadarPolygon');
    var verdict = document.getElementById('simRadarVerdict');
    if (!chips.length || !poly || !verdict) return;

    var PRESETS = {
      authoritative: {
        pts: '100,26 146,42 168,84 152,130 124,158 76,158 46,128 34,84 56,42',
        vals: ['65%', '88%', '75%', '35%', '60%', '85%'],
        text: IS_EN
          ? 'Warm responsiveness + clear boundaries: balanced development across confidence, empathy, resilience, and delayed gratification.'
          : '【温和而坚定 · 权威型】高情感回应 + 清晰规则边界：九维性格均衡舒展，自信心、同理心、抗挫力与延迟满足同步稳步拉升。'
      },
      gentle: {
        pts: '100,32 154,36 148,90 142,132 114,146 78,148 56,126 42,82 50,38',
        vals: ['42%', '95%', '60%', '22%', '72%', '62%'],
        text: IS_EN
          ? 'High empathy & emotional security; consider strengthening rule clarity to support delayed gratification and spending sense.'
          : '【高共情陪伴型】同理心与情绪安全感极高；可适度提升「规则清晰度」，帮助孩子在延迟满足与消费理性上更稳。'
      },
      autonomy: {
        pts: '100,24 138,48 174,80 156,136 128,162 72,160 44,124 38,86 62,46',
        vals: ['55%', '82%', '78%', '20%', '55%', '88%'],
        text: IS_EN
          ? 'Low intrusive control + clear rules: strong independence, resilience, and financial responsibility.'
          : '【自主探索型】低控制强度 + 高规则清晰度：独立性、抗挫力与财富责任感突出，适合学龄前至青春期逐步放权。'
      },
      strict: {
        pts: '100,48 122,64 136,92 128,118 118,142 82,140 68,116 62,90 74,62',
        vals: ['90%', '45%', '92%', '85%', '40%', '80%'],
        text: IS_EN
          ? 'High strictness & control with lower emotional responsiveness may compress confidence, empathy, and emotional stability.'
          : '【高压严管型】严格度与控制感过高、情感回应偏低时，虽短期服从，但自信心、同理心与情绪稳定性容易受压收缩。'
      }
    };

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        var k = chip.getAttribute('data-preset');
        var p = PRESETS[k];
        if (!p) return;
        poly.setAttribute('points', p.pts);
        verdict.textContent = p.text;
        for (var i = 0; i < 6; i++) {
          var el = document.getElementById('sv' + (i + 1));
          if (el && p.vals[i]) el.textContent = p.vals[i];
        }
      });
    });
  })();

  /* 6. 沙盘二：iPhone Duo 3D 双屏折叠手账与 3D 家庭客厅热点交互 */
  (function () {
    var duoBtns = document.querySelectorAll('.duo-mode-btn[data-mode]');
    var stage = document.getElementById('duoInteractiveStage');
    if (duoBtns.length && stage) {
      duoBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          duoBtns.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          stage.setAttribute('data-duo-mode', btn.getAttribute('data-mode'));
        });
      });
    }

    var hotspots = document.querySelectorAll('.room-hotspot[data-hs]');
    var rightTitle = document.getElementById('duoRightTitle');
    var rightSub = document.getElementById('duoRightSub');
    var rightBody = document.getElementById('duoRightBody');
    if (!hotspots.length || !rightTitle || !rightSub || !rightBody) return;

    var HS_PANELS = {
      wall: {
        t: IS_EN ? '🖼️ Memory Wall · 2026 Autumn' : '🖼️ 小满的纪念墙 · 副屏联动预览',
        s: IS_EN ? 'Synced with 3D Living Room Frame' : '点击左屏相框实时联动 · 导出纪念册',
        html:
          '<div class="ph-card" style="margin:0">' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
              '<div style="background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px">' +
                '<img src="assets/memory-bike.jpg" alt="" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px;margin-bottom:6px">' +
                '<b style="font-size:12.5px;display:block">第一次独立骑过石桥</b>' +
                '<small style="font-size:11px;color:var(--sub)">2026-04 · 5岁2个月</small>' +
              '</div>' +
              '<div style="background:var(--card);border:1px solid var(--line);border-radius:14px;padding:8px">' +
                '<img src="assets/memory-grad.jpg" alt="" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:10px;margin-bottom:6px">' +
                '<b style="font-size:12.5px;display:block">第一张挂上墙的画</b>' +
                '<small style="font-size:11px;color:var(--sub)">2026-09 · 阳光花苗园</small>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="rowcard"><span class="k" style="background:var(--brand-soft)">✨</span><div><b>左屏客厅相框自动轮播</b><small>Pro 解锁无限张照片与 PDF 纪念册导出</small></div></div>'
      },
      mail: {
        t: IS_EN ? '💌 Slow-Mail Time Capsule' : '💌 慢递信箱 · 写给未来的时光信',
        s: IS_EN ? 'Wax-Sealed On-Device Encryption' : '滴蜡封存 · 到期自动提醒开启',
        html:
          '<div class="ph-card" style="margin:0;background:linear-gradient(135deg,var(--brand-soft),var(--bg2))">' +
            '<div class="ttl">📮 寄往 2039 年 · 小满 18 岁生日</div>' +
            '<div class="hint">封存状态：🔒 已滴蜡封存（还剩 4,680 天解封）</div>' +
            '<p style="font-size:12.5px;color:var(--ink);line-height:1.6;margin-top:6px">“今天你拆掉了自行车的辅助轮，摔了一跤却回头冲我们大笑。愿你十八岁时依然有不怕摔倒的勇气……”</p>' +
          '</div>' +
          '<div class="rowcard"><span class="k" style="background:var(--mint-soft)">🛡️</span><div><b>本机加密保存 · 进加密备份 (.yhw)</b><small>不经过任何云端服务器，只有你们一家人能拆封</small></div></div>'
      },
      mascot: {
        t: IS_EN ? '🍊 Wenwen & Half-Year Stage Report' : '🍊 问问与这半年的小满 · 阶段报告',
        s: IS_EN ? 'BYOK Transparent Context Preview' : '自带 Key 透明取数 · 每半年成长对比',
        html:
          '<div class="ph-card" style="margin:0">' +
            '<div class="ttl">📊 这半年，小满长高了，也开始学着等一等</div>' +
            '<div class="hint">2026年4月 — 2026年10月 · 阶段出炉</div>' +
            '<div class="ph-row"><div class="l"><b>身高稳步长高 +1.5 cm</b><small>109.5 cm → 111.0 cm (P60 百分位)</small></div><span class="metric-badge">达标</span></div>' +
            '<div class="ph-row"><div class="l"><b>第一次为心愿攒钱</b><small>心愿账户已存 ¥44 · 学会延迟满足</small></div><span class="metric-badge">进步</span></div>' +
          '</div>' +
          '<div class="rowcard"><span class="k" style="background:var(--blue-soft)">🔑</span><div><b>发送前逐条预览上下文</b><small>绝不发送真实姓名、生日与具体医疗明细</small></div></div>'
      },
      book: {
        t: IS_EN ? '📖 Family Growth Journal · Today' : '📖 家庭成长手账 · 今日顺手记一笔',
        s: IS_EN ? 'Age 5y 3m · Preschool Stage' : '5 岁 3 个月 · 学龄前期主线面板',
        html:
          '<div class="ph-card" style="margin:0">' +
            '<div class="ttl">今天记一笔 · 一键落库不弹窗</div>' +
            '<div class="hint">点错当场可撤回 · 无连续打卡焦虑</div>' +
            '<div class="ph-row"><div class="l"><b>☀️ 户外自然光时长</b><small>今日已达 90 分钟 · 护眼良好</small></div><span class="ph-slot"><i class="on">+15m</i></span></div>' +
            '<div class="ph-row"><div class="l"><b>🦷 早晚刷牙守护</b><small>早晚各一次 · 预防乳牙龋</small></div><span class="ph-slot"><i class="on">早 ✓</i><i class="on">晚 ✓</i></span></div>' +
            '<div class="ph-row"><div class="l"><b>😊 今日情绪认出</b><small>给情绪起名字：平静与自豪</small></div><span class="ph-check">✓</span></div>' +
          '</div>'
      }
    };

    hotspots.forEach(function (hs) {
      hs.addEventListener('click', function () {
        hotspots.forEach(function (h) { h.classList.remove('active'); });
        hs.classList.add('active');
        var p = HS_PANELS[hs.getAttribute('data-hs')];
        if (!p) return;
        rightTitle.textContent = p.t;
        rightSub.textContent = p.s;
        rightBody.innerHTML = p.html;
      });
    });
  })();

  /* 7. 沙盘三：拍立得时光家书与回忆相框生成台（真实童年里程碑插画切换） */
  (function () {
    var cards = document.querySelectorAll('.polaroid-choice[data-memory]');
    var frame = document.getElementById('polaroidFrame');
    var imgEl = document.getElementById('polaroidImg');
    var capTitle = document.getElementById('polaroidCaption');
    var capMeta = document.getElementById('polaroidDate');
    var letterBody = document.getElementById('capsuleLetterText');
    if (!cards.length || !frame || !capTitle || !capMeta || !letterBody) return;

    var MEMORIES = {
      bike: {
        title: IS_EN ? 'First Time Riding Two Wheels' : '第一次独立骑过小石桥',
        meta: IS_EN ? 'Age 5y 2m · Park Sunshine · Spring 2026' : '5 岁 2 个月 · 滨江公园 · 2026年春',
        img: 'assets/memory-bike.jpg',
        letter: IS_EN
          ? 'Dear child, today you took off the training wheels. You wobbled, fell once, scraped your knee, but immediately brushed off the dust and looked back at us grinning with sparkling eyes. We cried with joy. Remember this courage!'
          : '亲爱的小满：今天你终于拆掉了自行车的辅助轮。摇摇晃晃骑了七八米后摔了一跤，但你爬起来拍了拍裤子上的灰，回头冲我们笑得满头大汗。那一刻爸爸妈妈眼眶湿润了。愿你一生都葆有拆掉辅助轮的勇敢。'
      },
      grad: {
        title: IS_EN ? 'Kindergarten Graduation Ceremony' : '幼儿园向日葵班毕业礼',
        meta: IS_EN ? 'Age 6y 0m · Sunny Garden · Summer 2026' : '6 岁 0 个月 · 阳光花苗园 · 2026年夏',
        img: 'assets/memory-grad.jpg',
        letter: IS_EN
          ? 'Dear child, wearing your little graduation cap, you proudly held up your rocket drawing and told your teacher you wanted to paint the stars. No matter which galaxy you explore, home is always your warm landing dock.'
          : '小满：今天你戴上了小小的毕业学士帽，举着自己画的火箭与星空，大声说梦想是当一名给星星画画的宇航员。无论你未来飞向哪片星系，家永远是你最温暖的补给站。'
      },
      leaf: {
        title: IS_EN ? 'First Golden Autumn Leaf Picked' : '秋天捡的第一片银杏落叶',
        meta: IS_EN ? 'Age 4y 8m · Neighborhood Lane · Autumn 2025' : '4 岁 8 个月 · 梧桐树下 · 2025年秋',
        img: 'assets/memory-leaf.jpg',
        letter: IS_EN
          ? 'You squatted down and inspected the veins of the ginkgo leaf for 20 minutes, saying it was a golden fan given by mother earth to little squirrels. Keep this gentle wonder forever.'
          : '你蹲在金黄的银杏树下足足观察了二十分钟叶脉，认真地对我们说这是大自然送给小松鼠的金扇子。孩子，愿你永远保持这双发现世间微小美好的眼睛。'
      }
    };

    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        cards.forEach(function (other) { other.classList.remove('active'); });
        c.classList.add('active');
        var item = MEMORIES[c.getAttribute('data-memory')];
        if (!item) return;

        if (imgEl) imgEl.src = item.img;
        capTitle.textContent = item.title;
        capMeta.textContent = item.meta;
        letterBody.textContent = item.letter;
      });
    });

    var flipBtn = document.getElementById('flipLetterBtn');
    var capsuleCard = document.getElementById('capsuleCardWrap');
    if (flipBtn && capsuleCard) {
      flipBtn.addEventListener('click', function () {
        capsuleCard.classList.toggle('flipped');
        var flipped = capsuleCard.classList.contains('flipped');
        flipBtn.textContent = flipped
          ? (IS_EN ? '📷 View Polaroid Photo' : '📷 翻转查看拍立得照片')
          : (IS_EN ? '✉️ Open Time Capsule Letter' : '✉️ 展开翻阅时光家书');
      });
    }
  })();

  /* 8. 实机截图画廊分类过滤 + 点击灯箱放大 (#shots & #lb) */
  (function () {
    var lb = document.getElementById('lb');
    var lbImg = document.getElementById('lbImg');
    var lbCap = document.getElementById('lbCap');
    var lbClose = document.getElementById('lbClose');

    function openLightbox(src, cap) {
      if (!lb || !lbImg) return;
      lbImg.src = src;
      if (lbCap) lbCap.textContent = cap || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
    }
    function closeLightbox() {
      if (!lb) return;
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
    }

    if (lb) {
      lb.addEventListener('click', closeLightbox);
      if (lbClose) lbClose.addEventListener('click', closeLightbox);
      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lb.classList.contains('open')) closeLightbox();
      });
    }

    document.querySelectorAll('[data-shot]').forEach(function (el) {
      el.addEventListener('click', function () {
        var src = el.getAttribute('data-shot');
        var cap = el.getAttribute('data-cap') || '';
        if (src) openLightbox(src, cap);
      });
    });

    var tabs = document.querySelectorAll('.shot-tab[data-filter]');
    var cards = document.querySelectorAll('.shot-card[data-cat]');
    if (tabs.length && cards.length) {
      tabs.forEach(function (t) {
        t.addEventListener('click', function () {
          tabs.forEach(function (b) { b.classList.remove('active'); });
          t.classList.add('active');
          var f = t.getAttribute('data-filter');
          cards.forEach(function (c) {
            var match = (f === 'all') || (c.getAttribute('data-cat') === f);
            c.style.display = match ? '' : 'none';
          });
        });
      });
    }
  })();

  /* 9. 定价模块：Pro 灵活订阅版 年度/月度 计费切换器 */
  (function () {
    var btns = document.querySelectorAll('.billing-opt[data-bill]');
    var amt = document.getElementById('subPriceAmt');
    var unit = document.getElementById('subPriceUnit');
    var note = document.getElementById('subPriceNote');
    if (!btns.length || !amt || !unit || !note) return;

    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var mode = b.getAttribute('data-bill');
        if (mode === 'yearly') {
          amt.textContent = amt.getAttribute('data-yearly') || (IS_EN ? '$24.99' : '¥168');
          unit.textContent = unit.getAttribute('data-yearly-unit') || (IS_EN ? '/ year' : '/ 年');
          note.textContent = note.getAttribute('data-yearly-note') || (IS_EN ? 'Equals ~$2.08/mo · Save 22% vs monthly' : '折合 ¥14 / 月 · 较按月连续订阅立省 22%');
        } else {
          amt.textContent = amt.getAttribute('data-monthly') || (IS_EN ? '$2.99' : '¥18');
          unit.textContent = unit.getAttribute('data-monthly-unit') || (IS_EN ? '/ month' : '/ 月');
          note.textContent = note.getAttribute('data-monthly-note') || (IS_EN ? 'Flexible monthly billing · Cancel anytime in Settings' : '按月灵活自动续费 · 可随时在系统设置中取消');
        }
      });
    });
  })();

  /* 10. 问问闲逛与交互动效 */
  (function () {
    var fig = document.getElementById('wwfig');
    if (fig) {
      fig.addEventListener('click', function () {
        fig.classList.add('happy');
        setTimeout(function () { fig.classList.remove('happy'); }, 1400);
      });
    }

    var pet = document.getElementById('pet');
    var bub = document.getElementById('petBubble');
    var line = document.getElementById('petLine');
    if (!pet || !bub || !line) return;

    var hint = pet.querySelector('.pet-hint');
    var lines = IS_EN ? [
      'How is your child feeling today? Tap to record!',
      'Hydration reminder: 15:00 · 20 mins remaining.',
      'Parenting is hard work—take a warm tea break!',
      'For ages 3-6, the key is naming feelings together.',
      'All data stays strictly on your device; zero cloud tracking.'
    ] : [
      '今天小满的心情怎么样？点我记一下～',
      '喝水提醒 15:00 · 还有 20 分钟',
      '你今天带娃也很辛苦，歇会儿喝杯水吧。',
      '3-6 岁这一段，最该练的是「认出情绪、给情绪起名」。',
      '数据都在你手机里，我这儿一个字都没存。'
    ];

    var i = 0, open = false, roamTimer = null, hideTimer = null;
    var dragging = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0, pid = null;

    function sz() { return pet.offsetWidth; }
    function vw() { return window.innerWidth; }
    function vh() { return window.innerHeight; }
    function cx(x) { return Math.min(Math.max(x, 8), vw() - sz() - 8); }
    function cy(y) { return Math.min(Math.max(y, 8), vh() - sz() - 8); }

    pet.style.bottom = 'auto';
    pet.style.left = cx(vw() * 0.05) + 'px';
    pet.style.top = cy(vh() - sz() - 20) + 'px';

    function place() {
      var r = pet.getBoundingClientRect();
      bub.style.top = 'auto';
      bub.style.bottom = (vh() - r.top + 10) + 'px';
      bub.style.left = Math.min(Math.max(r.left + r.width / 2 - 125, 12), vw() - 262) + 'px';
    }

    function grin(ms) {
      pet.classList.add('happy');
      setTimeout(function () { pet.classList.remove('happy'); }, ms || 1200);
    }

    function roam() {
      if (REDUCE || open || dragging) return;
      var tx = cx(8 + Math.random() * (vw() - sz() - 16));
      var ty = cy(vh() * 0.4 + Math.random() * (vh() * 0.5 - sz()));
      var curX = parseFloat(pet.style.left) || 0, curY = parseFloat(pet.style.top) || 0;
      pet.classList.toggle('flip', tx < curX);
      var dur = Math.min(5, Math.max(1.8, Math.hypot(tx - curX, ty - curY) / 160));
      pet.style.transitionDuration = dur + 's, ' + dur + 's';
      pet.style.left = tx + 'px'; pet.style.top = ty + 'px';
      roamTimer = setTimeout(roam, dur * 1000 + 4000 + Math.random() * 5000);
    }

    function openBubble() {
      open = true; clearTimeout(roamTimer); clearTimeout(hideTimer);
      if (hint) hint.style.display = 'none';
      line.textContent = lines[i % lines.length]; i++;
      place(); bub.classList.add('show'); grin(1400);
      hideTimer = setTimeout(closeBubble, 7000);
    }

    function closeBubble() {
      open = false; bub.classList.remove('show'); clearTimeout(hideTimer);
      if (hint) hint.style.display = '';
      if (!REDUCE) roamTimer = setTimeout(roam, 2500);
    }

    pet.addEventListener('pointerdown', function (e) {
      pid = e.pointerId; try { pet.setPointerCapture(pid); } catch (_) {}
      dragging = false; moved = false; sx = e.clientX; sy = e.clientY; clearTimeout(roamTimer);
      var r = pet.getBoundingClientRect();
      pet.style.left = r.left + 'px'; pet.style.top = r.top + 'px';
      ox = e.clientX - r.left; oy = e.clientY - r.top; pet.classList.add('dragging');
    });

    pet.addEventListener('pointermove', function (e) {
      if (pid === null) return;
      if (!dragging && Math.abs(e.clientX - sx) + Math.abs(e.clientY - sy) > 6) {
        dragging = true; moved = true; pet.classList.add('happy');
      }
      if (dragging) {
        pet.style.left = cx(e.clientX - ox) + 'px';
        pet.style.top = cy(e.clientY - oy) + 'px';
        if (open) place();
      }
    });

    function endDrag() {
      if (pid === null) return;
      try { pet.releasePointerCapture(pid); } catch (_) {}
      pid = null; pet.classList.remove('dragging');
      if (moved) {
        dragging = false; pet.classList.remove('happy');
        if (!REDUCE && !open) roamTimer = setTimeout(roam, 2500);
      } else {
        open ? closeBubble() : openBubble();
      }
    }

    pet.addEventListener('pointerup', endDrag);
    pet.addEventListener('pointercancel', endDrag);
    pet.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open ? closeBubble() : openBubble();
      }
    });

    var pClose = document.getElementById('petClose');
    if (pClose) {
      pClose.addEventListener('click', function (e) {
        e.stopPropagation();
        closeBubble();
      });
    }

    window.addEventListener('scroll', function () { if (open) place(); }, { passive: true });
    window.addEventListener('resize', function () {
      pet.style.left = cx(parseFloat(pet.style.left) || 0) + 'px';
      pet.style.top = cy(parseFloat(pet.style.top) || 0) + 'px';
      if (open) place();
    });

    setTimeout(openBubble, 2600);
    if (!REDUCE) roamTimer = setTimeout(roam, 12000);
  })();

  /* 11. 入场淡入动画 (IntersectionObserver) */
  (function () {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  })();

  /* 12. 技能包跑马灯填充 */
  (function () {
    var tagsZh = ['🌙 婴幼儿睡眠安抚 · ¥6', '😤 情绪引导与高敏感 · ¥6', '🎒 入园适应与分离焦虑 · ¥6', '🐷 零花钱与财商启蒙 · ¥6', '📚 小学学习习惯与内驱力 · ¥6', '🗣️ 青春期非暴力沟通 · ¥6', '🦷 乳牙与换牙期护理', '👁️ 远视储备与护眼', '🏃 大动作与体能达标', '🤝 二胎三胎同胞相处', '🎨 兴趣火花八维星图', '👵 隔代养育共识'];
    var tagsEn = ['🌙 Infant Sleep & Soothing · $0.99', '😤 Emotion & High Sensitivity · $0.99', '🎒 Kindergarten Transition · $0.99', '🐷 Pocket Money & Finance · $0.99', '📚 Study Habits & Drive · $0.99', '🗣️ Teen Non-Violent Talk · $0.99', '🦷 Dental & Cavity Care', '👁️ Far-Sight Eye Reserve', '🏃 Motor Skills & Sports', '🤝 Sibling Harmony', '🎨 8-Axis Interest Star-Map', '👵 Family Alignment'];
    var tags = IS_EN ? tagsEn : tagsZh;
    function fill(id, arr) {
      var t = document.getElementById(id);
      if (!t) return;
      var html = arr.concat(arr).map(function (s) { return '<span class="stag">' + s + '</span>'; }).join('');
      t.innerHTML = html;
    }
    fill('tk1', tags);
    fill('tk2', tags.slice().reverse());
  })();

})();
