#!/usr/bin/env python3
"""Remove the duplicated FAB anchor emitted by the first (buggy) skeleton."""
import re, sys, glob

files = sorted(set(glob.glob('*.html') + glob.glob('services/*.html')) - {'planaro-v3.html'})
pat = re.compile(r'\n*<a class="fab".*?</a>\n*', re.S)
fixed = []
for f in files:
    s = open(f, encoding='utf-8').read()
    hits = pat.findall(s)
    if len(hits) < 2:
        continue
    # keep exactly one, placed where the last one was
    s = pat.sub('\n', s)
    s = s.replace('<script src=', hits[-1].strip() + '\n\n<script src=', 1)
    open(f, 'w', encoding='utf-8').write(s)
    fixed.append((f, len(hits)))

for f, n in fixed:
    print('deduped %-30s (had %d)' % (f, n))
print('%d file(s) fixed, %d checked' % (len(fixed), len(files)))
