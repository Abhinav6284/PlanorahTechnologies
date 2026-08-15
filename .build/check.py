#!/usr/bin/env python3
"""Validate the built site: internal links, duplicate ids, required form ids, stray CSS classes."""
import re, os, glob, sys
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

PAGES = sorted(set(glob.glob('*.html') + glob.glob('services/*.html')) - {'planaro-v3.html'})
CSS = open('assets/planorah.css', encoding='utf-8').read()
CSS_CLASSES = set(re.findall(r'\.([a-zA-Z][\w-]*)', CSS))

FORM_IDS = ['i-name','i-phone','i-service','i-budget','i-msg',
            'f-name','f-phone','f-service','f-msg','send','ok']

problems = []


class Scan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids, self.classes, self.links, self.stack = [], set(), [], []
        self.void = {'meta','link','br','hr','img','input','source','path','rect','circle','use'}

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'):
            self.ids.append(a['id'])
        for c in (a.get('class') or '').split():
            self.classes.add(c)
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag in ('link','script') and (a.get('href') or a.get('src')):
            self.links.append(a.get('href') or a.get('src'))


for page in PAGES:
    src = open(page, encoding='utf-8').read()
    s = Scan()
    s.feed(src)
    base = os.path.dirname(page)

    # duplicate ids
    dupes = {i for i in s.ids if s.ids.count(i) > 1}
    for d in sorted(dupes):
        problems.append('%s: duplicate id="%s"' % (page, d))

    # internal links resolve
    for href in s.links:
        if re.match(r'^(https?:|mailto:|tel:|#|data:)', href):
            continue
        target = href.split('#')[0].split('?')[0]
        if not target:
            continue
        path = os.path.normpath(os.path.join(base, target))
        if not os.path.exists(path):
            problems.append('%s: broken link -> %s (resolves to %s)' % (page, href, path))

    # classes that have no CSS rule
    unknown = sorted(c for c in s.classes if c not in CSS_CLASSES)
    for c in unknown:
        problems.append('%s: class "%s" has no rule in planorah.css' % (page, c))

    # structural singletons
    for pat, label in ((r'id="fab"', 'FAB'), (r'<footer', '<footer>'), (r'<header', '<header>')):
        n = len(re.findall(pat, src))
        if n != 1:
            problems.append('%s: expected exactly 1 %s, found %d' % (page, label, n))

    # nobody should inline styles or scripts on interior pages
    if re.search(r'<style[\s>]', src):
        problems.append('%s: contains a <style> block' % page)
    scripts = re.findall(r'<script[^>]*>', src)
    # 2 gtag tags on every page, + planorah.js, + three.js on the home page only
    expected = 4 if page == 'index.html' else 3
    if len(scripts) != expected:
        problems.append('%s: expected %d <script>, found %d' % (page, expected, len(scripts)))
    if 'G-6SPV5MMPMT' not in src:
        problems.append('%s: missing Google tag' % page)

    # contact page must keep every id the shared JS binds to
    if page == 'contact.html':
        for fid in FORM_IDS:
            if 'id="%s"' % fid not in src:
                problems.append('contact.html: MISSING form id "%s" (shared JS binds to it)' % fid)


print('checked %d pages\n' % len(PAGES))
if problems:
    for p in problems:
        print('  ✗ ' + p)
    print('\n%d problem(s)' % len(problems))
    sys.exit(1)
print('  ✓ no problems')
