#!/usr/bin/env python3
"""从 privacy / terms 生成**渠道版**：去掉所有 AI 相关段落。

    python3 tools/make_channel_legal.py                 # → privacy.huawei[.en].html / terms.huawei[.en].html
    python3 tools/make_channel_legal.py --channel xiaomi

为什么要有这一版：国内渠道包没有生成式 AI 的算法备案资质，App 里 AI 功能整体关闭
（产品仓 `StoreChannel.aiEnabled = !isHuawei`），配不了 Key、没有任何请求出设备。
如果商店页和 App 内仍挂着讲 BYOK 的政策，就是**不实陈述**（产品仓 docs/HUAWEI_LAUNCH.md 一·4）。

做法：基础页里所有 AI 相关块都用 `<!-- AI-ONLY --> … <!-- /AI-ONLY -->` 包着
（表格行、列表项、整节都行），这里原样删掉；然后把 `<h2>N. ` 重新编号、页内互链指到渠道版、
生效日期那行后面加一句渠道说明，并把两个 page 登记进 site.config.json。
**基础页是唯一真相源** —— 改政策改基础页，再跑一次这里；别手改 *.huawei*.html。
跑完要 `make build`（GEO 头由 gen_geo.py 按 site.config.json 维护）。

⚠️ 渠道说明那句话里也别出现 "AI" 两个字母 —— 华为审核是关键词式的，连"不含 AI"都可能被挑。
"""
import argparse
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_PAGES = ['privacy', 'terms']
NOTE = {
    'huawei': {
        'zh-CN': '本页是华为应用市场渠道版：该版本没有任何联网分析功能，没有任何数据会离开你的设备。',
        'en': 'This is the Huawei AppGallery edition: that build has no cloud-connected analysis '
              'features, and no data ever leaves your device.',
    },
}
TITLE = {
    'huawei': {'privacy': {'zh-CN': '隐私政策（华为应用市场版）', 'en': 'Privacy Policy (Huawei AppGallery edition)'},
               'terms': {'zh-CN': '用户协议（华为应用市场版）', 'en': 'Terms of Service (Huawei AppGallery edition)'}},
}


def load_conf():
    with open(os.path.join(ROOT, 'site.config.json'), encoding='utf-8') as f:
        return json.load(f)


def strip_ai(s, src):
    s, n = re.subn(r'\s*<!-- AI-ONLY -->.*?<!-- /AI-ONLY -->', '', s, flags=re.S)
    if n == 0:
        raise SystemExit(f'{src} 里没有 AI-ONLY 标记 —— 没有 AI 段落就不需要渠道版，'
                         f'直接给商店填基础页地址即可')
    return s


def renumber(s):
    i = [0]

    def rep(m):
        i[0] += 1
        return f'{m.group(1)}{i[0]}. '
    return re.sub(r'(<h2>)\d+\. ', rep, s)


def relink(s, channel, suffix):
    # 页内互链也指到渠道版（隐私 ↔ 条款）
    for a in BASE_PAGES:
        s = s.replace(f'href="{a}{suffix}.html"', f'href="{a}.{channel}{suffix}.html"')
    return s


def add_note(s, note):
    # 生效日期那行（class 含 updated）后面加一句渠道说明
    return re.sub(r'(<p class="[^"]*updated[^"]*">.*?</p>)',
                  lambda m: m.group(1) + f'\n<p class="updated">{note}</p>', s, count=1, flags=re.S)


def register_pages(conf, channel, made):
    pages = conf['pages']
    have = {p['file']: p for p in pages}
    changed = False
    for base in BASE_PAGES:
        name = f'{base}.{channel}'
        if name in have or base not in made:
            continue
        entry = {
            '//': f'生成物：tools/make_channel_legal.py 由 {base}.html 生成，别手改页面本体；'
                  f'description 请改成渠道版口径（不提 AI）',
            'file': name,
            'title': TITLE.get(channel, {}).get(base, {'zh-CN': name, 'en': name}),
            'priority': 0.3, 'changefreq': 'yearly',
        }
        # 沿用基础页的逐页描述作起点（没有就退回 site.description，geo-check 会提示重复）
        if base in have and have[base].get('description'):
            entry['description'] = have[base]['description']
        pages.append(entry)
        changed = True
    if changed:
        with open(os.path.join(ROOT, 'site.config.json'), 'w', encoding='utf-8') as f:
            json.dump(conf, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print('  ✎ site.config.json（登记了渠道版页面）')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--channel', default='huawei')
    a = ap.parse_args()
    conf = load_conf()
    notes = NOTE.get(a.channel) or NOTE['huawei']
    made = set()
    for base in BASE_PAGES:
        for loc in conf['locales']['list']:
            src = f"{base}{loc['suffix']}.html"
            dst = f"{base}.{a.channel}{loc['suffix']}.html"
            sp = os.path.join(ROOT, src)
            if not os.path.exists(sp):
                continue
            s = open(sp, encoding='utf-8').read()
            s = renumber(relink(strip_ai(s, src), a.channel, loc['suffix']))
            s = add_note(s, notes.get(loc['code']) or next(iter(notes.values())))
            s = f'<!-- 生成物：tools/make_channel_legal.py 由 {src} 生成，不要手改 -->\n' + s
            open(os.path.join(ROOT, dst), 'w', encoding='utf-8').write(s)
            made.add(base)
            print(f'  {src} → {dst}')
    register_pages(conf, a.channel, made)
    print('下一步：make build && make geo-check')


if __name__ == '__main__':
    main()
