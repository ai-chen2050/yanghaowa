/* ==========================================================================
   养好娃 (Grow Together) · 企业级互动引擎 (app.js)
   支持中英双语 (自动识别 document.documentElement.lang)
   包含：明暗主题切换、滚动进度条、官方产品宣传片章节快跳联动、Hero 光斑粒子、
         0-18岁分龄生命周期切换台、iPhone Duo 双屏折叠沙盘、拍立得时光家书工作台、
         定价方案联动、漫游可拖动伴宠问问 (Wenwen)
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
    for (var i = 0; i < 26; i++) {
      pts.push({
        x: Math.random() * (w || 1000),
        y: Math.random() * (h || 600),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.4,
        r: 2 + Math.random() * 3.5,
        a: 0.15 + Math.random() * 0.45
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
        ctx.fillStyle = 'rgba(235, 94, 40, ' + p.a + ')';
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

  /* 5. 沙盘一：0-18岁分龄生命周期切换台 (Age-Band Life Cycle Console) */
  (function () {
    var btns = document.querySelectorAll('.stage-tab-btn[data-stage]');
    var container = document.getElementById('stageSandboxView');
    if (!btns.length || !container) return;

    var STAGES_DATA = {
      '0-1': {
        avatar: '👶',
        title: IS_EN ? '0-1 Years · Infant Health & Routine' : '0-1 岁 · 婴儿萌芽与节律舱',
        stageTag: IS_EN ? 'Infant Milestone' : '婴儿发育里程碑',
        summary: IS_EN ? 'Tracking milk feeding, sleep cycles, WHO percentiles, and jaundice & vaccine schedules with zero cloud leaks.' : '奶量打卡、睡眠节律、WHO 权威百分位身高体重曲线，出生后疫苗精准推算，不漏每一针。',
        metrics: [
          { l: IS_EN ? 'Feeding' : '母乳与辅食', v: IS_EN ? '6 feeds / 780ml' : '6 次 / 780ml', badge: IS_EN ? 'Balanced' : '达标' },
          { l: IS_EN ? 'Sleep Cycles' : '昼夜作息', v: IS_EN ? '14.5 hrs / day' : '14.5 小时 / 天', badge: IS_EN ? 'Optimal' : '良好' },
          { l: IS_EN ? 'Next Vaccine' : '下一针疫苗', v: IS_EN ? 'Polio DTP #3' : '百白破第 3 针 (到点提醒)', badge: IS_EN ? '7 Days Left' : '剩 7 天' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Standard WHO percentile curves for weight, length, and head circumference.' : 'WHO 生长曲线对照，出牙期与翻身抬头大动作发育里程碑。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Attachment bond, eye contact, responsive soothing without sleep training stress.' : '母婴安全依恋建立、视线追焦、温和回应式安抚与睡眠习惯。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商萌芽', desc: IS_EN ? 'Zero chores at this stage; baby cost bookkeeping for diapers & care.' : '婴儿期免于财商说教；专注记录家庭尿布与育儿真实开销账本。' }
        ]
      },
      '1-3': {
        avatar: '🧒',
        title: IS_EN ? '1-3 Years · Toddler Exploration & Language' : '1-3 岁 · 幼童探索与语言舱',
        stageTag: IS_EN ? 'Toddler Language & Autonomy' : '学步与语言爆发期',
        summary: IS_EN ? 'Potty independence, language explosion, responsive feeding, and 9-axis personality radar initial setup.' : '自主如厕过渡、双词短句语言爆发、自主进食、九维性格雷达预填父母教养投入。',
        metrics: [
          { l: IS_EN ? 'Outdoor Active' : '户外活动', v: IS_EN ? '110 mins' : '110 分钟', badge: IS_EN ? 'Goal: 120m' : '目标 120' },
          { l: IS_EN ? 'Vocabulary' : '日常词汇量', v: IS_EN ? '260+ words' : '260+ 词汇积累', badge: IS_EN ? 'Surging' : '爆发期' },
          { l: IS_EN ? 'Personality Dots' : '教养雷达投点', v: IS_EN ? '8 dimensions logged' : '已记录 8 个维度', badge: IS_EN ? 'Active' : '已生成' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Step-by-step motor skills, finger food transition, oral care brushing twice daily.' : '粗大动作奔跑跳跃、自主抓握餐食、早晚乳牙清洁打卡。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Tantrum containment, emotional naming, bedtime picture book routine.' : '分离焦虑与发脾气接纳、情绪给名字、睡前绘本陪伴共读。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商人格', desc: IS_EN ? 'Recognizing toy ownership, sharing concepts, delayed gratification play.' : '物权意识萌芽（“这是我的”）、学会交换与简单的延迟满足游戏。' }
        ]
      },
      '3-6': {
        avatar: '👧',
        title: IS_EN ? '3-6 Years · Kindergarten & Emotional IQ' : '3-6 岁 · 学龄前期自理与情商舱',
        stageTag: IS_EN ? 'Preschool EQ & Rules' : '幼儿园社交与自控力',
        summary: IS_EN ? 'Strict screen time limits, peer conflict resolution, daily family tasks, and interactive Wenwen prompt guidance.' : '严格控制娱乐屏幕、同伴冲突化解、积木搭建家庭挑战、问问每日情绪陪伴。',
        metrics: [
          { l: IS_EN ? 'Screen Guard' : '娱乐屏幕限额', v: IS_EN ? '30m / 60m max' : '30 分钟 / 上限 60', badge: IS_EN ? 'Safe' : '健康' },
          { l: IS_EN ? 'Weekly Task' : '亲子共创挑战', v: IS_EN ? '3 / 4 completed' : '积木桥完成 3 / 4', badge: IS_EN ? 'Great' : '优秀' },
          { l: IS_EN ? 'Mood Check-in' : '今日情绪认出', v: IS_EN ? 'Happy & Proud 🙂' : '喜悦与自豪 🙂', badge: IS_EN ? 'Logged' : '已记录' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Far-sight eye protection checks, outdoor natural sunlight 2 hrs/day.' : '远视储备跟踪、户外自然光照 2 小时/天、精细动作握笔练习。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Peer sharing, recognizing frustration, daily parent praise reinforcement.' : '同伴合作分享、挫败感复原力、每日正向肯定与家庭睡前倾听。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商人格', desc: IS_EN ? 'Piggy bank coins, distinguishing needs vs wants, family supermarket game.' : '小猪储蓄罐、分清「需要」还是「想要」、超市模拟自主选购。' }
        ]
      },
      '6-18': {
        avatar: '🧑‍🎓',
        title: IS_EN ? '6-18 Years · School Age & Autonomy' : '6-18 岁 · 学龄阶段与独立人格舱',
        stageTag: IS_EN ? 'Adolescent Autonomy' : '青春期逆反与自主规划',
        summary: IS_EN ? 'Pocket money ledger, personal wish goals, non-violent communication kits, and future time capsules.' : '零花钱自主预算、心愿目标阶梯储蓄、非暴力沟通防逆反锦囊、未来时光家书。',
        metrics: [
          { l: IS_EN ? 'Allowance Bank' : '独立零花钱', v: IS_EN ? '¥80 / month budget' : '¥80 / 月自主支配', badge: IS_EN ? 'Tracked' : '记账中' },
          { l: IS_EN ? 'Wish Goal' : '心愿储蓄目标', v: IS_EN ? '72% funded (Telescope)' : '天文望远镜完成 72%', badge: IS_EN ? 'On Track' : '进行中' },
          { l: IS_EN ? 'Time Capsule' : '封存时光家书', v: IS_EN ? 'Sealed for 18th Birthday' : '封存至 18 岁成人礼', badge: IS_EN ? 'Encrypted' : '本地加密' }
        ],
        threads: [
          { icon: '🌿', name: IS_EN ? 'Health' : '身体健康', desc: IS_EN ? 'Postural spine checks, puberty physiological changes, regular sports training.' : '脊柱侧弯筛查、青春期生理发育健康指导、羽毛球与体能达标。' },
          { icon: '💙', name: IS_EN ? 'Mind' : '心理成长', desc: IS_EN ? 'Boundary respect, peer pressure guidance, non-confrontational empathy.' : '尊重边界、化解同伴压力与容貌焦虑、平视探讨人生方向与学业。' },
          { icon: '🐷', name: IS_EN ? 'Sense' : '财商人格', desc: IS_EN ? 'Compound interest basics, budgeting, work-value awareness and saving.' : '复利基础常识、个人月度预算支配、劳动价值认知与长期投资观念。' }
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
          '<div class="stage-head-row">' +
            '<div class="stage-avatar-box">' + d.avatar + '</div>' +
            '<div class="stage-titles">' +
              '<span class="stage-kicker-tag">' + d.stageTag + '</span>' +
              '<h3 class="stage-main-title">' + d.title + '</h3>' +
              '<p class="stage-desc-text">' + d.summary + '</p>' +
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
        var k = btn.getAttribute('data-stage');
        renderStage(k);
      });
    });

    // 默认展示 3-6 岁
    renderStage('3-6');
  })();

  /* 6. 沙盘二：iPhone Duo 3D 双屏折叠手账与 3D 客厅仿真模拟器 */
  (function () {
    var duoBtns = document.querySelectorAll('.duo-mode-btn[data-mode]');
    var stage = document.getElementById('duoInteractiveStage');
    if (!duoBtns.length || !stage) return;

    duoBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        duoBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var mode = btn.getAttribute('data-mode');
        stage.setAttribute('data-duo-mode', mode);
      });
    });
  })();

  /* 7. 沙盘三：拍立得时光家书与回忆相框生成台 */
  (function () {
    var cards = document.querySelectorAll('.polaroid-choice[data-memory]');
    var frame = document.getElementById('polaroidFrame');
    var capTitle = document.getElementById('polaroidCaption');
    var capMeta = document.getElementById('polaroidDate');
    var letterBody = document.getElementById('capsuleLetterText');
    if (!cards.length || !frame || !capTitle || !capMeta || !letterBody) return;

    var MEMORIES = {
      bike: {
        title: IS_EN ? 'First Time Riding Two Wheels' : '第一次独立骑过小石桥',
        meta: IS_EN ? 'Age 5y 2m · Park Sunshine · Spring 2026' : '5 岁 2 个月 · 滨江公园 · 2026年春',
        img: 'wenwen_happy.png',
        letter: IS_EN ?
          'Dear child, today you took off the training wheels. You wobbled, fell once, scraped your knee, but immediately brushed off the dust and looked back at us grinning with sparkling eyes. We cried with joy. Remember this courage!' :
          '亲爱的小满：今天你终于拆掉了自行车的辅助轮。摇摇晃晃骑了七八米后摔了一跤，但你爬起来拍了拍裤子上的灰，回头冲我们笑得满头大汗。那一刻爸爸妈妈眼眶湿润了。愿你一生都葆有拆掉辅助轮的勇敢。'
      },
      grad: {
        title: IS_EN ? 'Kindergarten Graduation Ceremony' : '幼儿园向日葵班毕业礼',
        meta: IS_EN ? 'Age 6y 0m · Sunny Garden · Summer 2026' : '6 岁 0 个月 · 阳光花苗园 · 2026年夏',
        img: 'logo.png',
        letter: IS_EN ?
          'Dear child, wearing your little graduation cap, you proudly told your teacher you wanted to be an astronaut who paints the stars. No matter which galaxy you explore in the future, our home will always be your softest landing dock.' :
          '小满：今天你戴上了小小的毕业学士帽，在台上大声说梦想是当一名给星星画画的宇航员。台下掌声雷动。无论你未来飞向哪片星系，家永远是你最温暖的补给站。'
      },
      leaf: {
        title: IS_EN ? 'First Golden Autumn Leaf Picked' : '秋天捡的第一片银杏落叶',
        meta: IS_EN ? 'Age 4y 8m · Neighborhood Lane · Autumn 2025' : '4 岁 8 个月 · 梧桐树下 · 2025年秋',
        img: 'wenwen_idle.png',
        letter: IS_EN ?
          'You squatted down and inspected the veins of the leaf for 20 minutes, saying it was a golden fan given by mother earth. The world is full of wonder when seen through your gentle eyes.' :
          '你蹲在路边足足观察了二十分钟银杏叶的叶脉，认真地对我们说这是大自然送给小松鼠的金扇子。孩子，愿你永远保持这双发现世间微小美好的眼睛。'
      }
    };

    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        cards.forEach(function (other) { other.classList.remove('active'); });
        c.classList.add('active');
        var k = c.getAttribute('data-memory');
        var item = MEMORIES[k];
        if (!item) return;

        capTitle.textContent = item.title;
        capMeta.textContent = item.meta;
        letterBody.textContent = item.letter;

        frame.classList.add('shake');
        setTimeout(function () { frame.classList.remove('shake'); }, 400);
      });
    });

    var flipBtn = document.getElementById('flipLetterBtn');
    var capsuleCard = document.getElementById('capsuleCardWrap');
    if (flipBtn && capsuleCard) {
      flipBtn.addEventListener('click', function () {
        capsuleCard.classList.toggle('flipped');
        var flipped = capsuleCard.classList.contains('flipped');
        flipBtn.textContent = flipped ?
          (IS_EN ? '📷 View Polaroid Photo' : '📷 翻转查看拍立得照片') :
          (IS_EN ? '✉️ Open Time Capsule Letter' : '✉️ 展开翻阅时光家书');
      });
    }
  })();

  /* 8. 问问闲逛与交互动效 */
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

  /* 9. 入场淡入动画 (IntersectionObserver) */
  (function () {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  })();

  /* 10. 技能包跑马灯填充 */
  (function () {
    var tagsZh = ['🌙 睡眠与安抚', '🥣 辅食与挑食', '😤 情绪与发脾气', '👁️ 护眼与屏幕', '🐷 零花钱与财商启蒙', '🗣️ 青春期沟通', '🦷 口腔护理', '📚 学习习惯', '🏃 运动与体能', '🤝 二胎相处', '🎨 兴趣启蒙', '👵 隔代共识'];
    var tagsEn = ['🌙 Sleep & Soothing', '🥣 Solid Foods & Picky Eating', '😤 Tantrums & Meltdowns', '👁️ Screen Time & Eye Care', '🐷 Pocket Money & Finances', '🗣️ Teen Communication', '🦷 Dental & Cavity Care', '📚 Study Habits & Routine', '🏃 Sports & Coordination', '🤝 Sibling Dynamics', '🎨 Creative Play', '👵 Multigenerational Harmony'];
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
