#!/usr/bin/env python3
"""Build every page of the site from .build/pages/*.html and .build/services.py.

Each page source starts with one line of front matter:
    <!--meta {"title": "...", "desc": "...", "page": "Home", "field": "or", "three": false} -->
followed by the contents of <main>. `{R}` is replaced by the path back to the site root
("" for top-level pages, "../" for services/). The script adds the head, header, footer,
floating WhatsApp button and the credit line for every picture the page uses.

    python .build/build.py
"""
import json, os, re, html
import services

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '.build', 'pages')
SITE = 'https://www.planorahtechnologies.com/'

# Details printed on the visiting card
ADDRESS = 'Chaudhary Complex, Rahon Rd., Ludhiana, 141007'
INSTAGRAM = 'https://www.instagram.com/planorahtechnologies/'
EMAIL = 'planorahtechnologies@gmail.com'
MAPQ = 'Chaudhary+Complex,+Rahon+Road,+Ludhiana,+Punjab+141007'
MAP = ('<iframe class="map" src="https://maps.google.com/maps?q=' + MAPQ + '&amp;z=16&amp;output=embed" '
       'title="Map: Planorah Technologies, ' + ADDRESS + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>')
DIRECTIONS = 'https://www.google.com/maps/dir/?api=1&amp;destination=' + MAPQ
MAPLINK = 'https://www.google.com/maps/search/?api=1&amp;query=' + MAPQ

WA = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm4.52 12.99c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>')
ARROW = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

# Line icons, written into page sources as {I:name}
ICONS = {
    'web': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
    'phone': '<rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/>',
    'tv': '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    'crm': '<path d="M4 20V11M10 20V5M16 20v-6M21 20H3"/>',
    'link': '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M8 7.5l2.8 8.3M16 7.5l-2.8 8.3M8.5 6h7"/>',
    'pin': '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    'bag': '<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    'health': '<path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7z"/>',
    'play': '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
    'truck': '<path d="M2 6h11v10H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    'cap': '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    'cup': '<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"/>',
    'chat': '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
    'doc': '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    'code': '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12"/>',
    'rocket': '<path d="M12 3c4 2 6 6 5 11l-2 3H9l-2-3C6 9 8 5 12 3z"/><circle cx="12" cy="10" r="1.8"/><path d="M9.5 17L8 21M14.5 17L16 21"/>',
    'chev': '<path d="M9 6l6 6-6 6"/>',
}
def icons(body):
    return re.sub(r'\{I:(\w+)\}', lambda m: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[m.group(1)] + '</svg>', body)

NAV = [('services/index.html', 'Services'), ('work.html', 'Work'), ('process.html', 'Process'),
       ('about.html', 'About'), ('contact.html', 'Contact')]


def head(m, R, path):
    canon = SITE + ('' if path == 'index.html' else path.replace('index.html', ''))
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6SPV5MMPMT"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'G-6SPV5MMPMT');
</script>

<title>{m["title"]}</title>
<meta name="description" content="{html.escape(m["desc"])}" />
<link rel="canonical" href="{canon}" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600&family=Instrument+Serif:ital@1&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="icon" type="image/svg+xml" href="{R}assets/favicon.svg">
<meta name="theme-color" content="#050505">
<link rel="stylesheet" href="{R}assets/planorah.css">
</head>'''


def header(m, R):
    links = ''.join(f'<a href="{R}{h}">{t}</a>' for h, t in NAV)
    return f'''<body data-page="{m["page"]}">
<a class="skip" href="#main">Skip to content</a>
<header class="hd" id="hd">
  <div class="hd-in">
    <a class="wm" href="{R}index.html" aria-label="Planorah Technologies, home"><img src="{R}assets/favicon.svg" width="30" height="30" alt="">Planorah</a>
    <nav class="hd-nav" aria-label="Primary">{links}</nav>
    <a class="btn btn-talk" href="{R}contact.html">Let’s talk <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg></a>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="mob">Menu</button>
  </div>
</header>
<nav class="mob" id="mob" aria-label="Menu">
  {links}
  <a class="btn" href="{R}contact.html">Send your requirement</a>
</nav>
'''


def credits_for(body):
    data = json.load(open(os.path.join(ROOT, 'assets', 'img', 'credits.json'), encoding='utf-8'))
    used = []
    for c in data:
        f = c['file'].split('/')[-1]
        if f in body and c['credit'] not in [u['credit'] for u in used]:
            used.append(c)
    if not used:
        return ''
    items = '; '.join(f'<a href="{c["page"]}" rel="noopener">{html.escape(c["title"])}</a> by {html.escape(c["creator"] or "unknown")}, {c["license"]}'
                      for c in used)
    return f'<div class="ft-credits"><p>Pictures on this page, via Wikimedia Commons, shown in black and white: {items}.</p></div>'


def footer(R, body):
    svc = [('services/websites.html', 'Websites'), ('services/crm.html', 'CRM'), ('services/mobile.html', 'Mobile apps'),
           ('services/tv.html', 'TV apps'), ('services/google.html', 'Google'), ('services/integrations.html', 'Integrations')]
    co = [('work.html', 'Work'), ('process.html', 'Process'), ('about.html', 'About'), ('faq.html', 'FAQ'), ('contact.html', 'Contact')]
    col = lambda items: ''.join(f'<li><a href="{R}{h}">{t}</a></li>' for h, t in items)
    return f'''
<footer class="ft">
  <div class="ft-top">
    <div class="ft-say">
      <p class="ft-big">Have something to build? <a href="{R}contact.html">Send your requirement</a></p>
      <div class="ft-places">
        <a href="mailto:{EMAIL}">{EMAIL}</a>
        <a href="#" data-wa-link>WhatsApp <span data-wa-num>+91 62842 19729</span></a>
        <a href="{INSTAGRAM}" target="_blank" rel="noopener">@planorahtechnologies</a>
        <address>{ADDRESS}</address>
      </div>
    </div>
    <div class="ft-cols">
      <nav aria-label="Services"><p class="ft-h">Services</p><ul>{col(svc)}</ul></nav>
      <nav aria-label="Studio"><p class="ft-h">Studio</p><ul>{col(co)}</ul></nav>
      <div><p class="ft-h">Ludhiana now</p><p id="ldh-time">IST</p><p class="small soft" id="ldh-open">Mon–Fri, 10am–7pm IST</p></div>
    </div>
  </div>
  <div class="ft-name" aria-hidden="true">Planorah<sup>+</sup></div>
  <div class="ft-legal">
    <span>© <span id="yr">2026</span> Planorah Technologies · <a href="{R}privacy.html">Privacy</a> · <a href="{R}terms.html">Terms</a></span>
    <a href="#main">Back to top</a>
  </div>
  {credits_for(body)}
</footer>

<a class="fab" id="fab" href="#" aria-label="Chat with Planorah on WhatsApp">{WA}</a>
'''


def glass(body):
    """Put the fluted-glass light behind each page's opening and closing sections."""
    def add(m, side):
        canvas = '<canvas class="glass" data-glass="' + side + '" aria-hidden="true"></canvas>'
        return m.group(0).replace('class="', 'class="glassy ', 1) + '\n  ' + canvas
    body = re.sub(r'<section class="ch ph[^"]*"[^>]*>', lambda m: add(m, 'left'), body)
    body = re.sub(r'<section class="ch close[^"]*"[^>]*>', lambda m: add(m, 'right'), body)
    return body


def scripts(m, R):
    three = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n' if m.get('three') else ''
    lenis = '<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>\n'
    return f'{three}{lenis}<script src="{R}assets/planorah.js"></script>\n</body>\n</html>\n'


def page(path, meta, body):
    R = '../' * path.count('/')
    body = icons(glass(body))
    body = (body.replace('{R}', R).replace('{WA}', WA).replace('{ARROW}', ARROW)
                .replace('{ADDRESS}', ADDRESS).replace('{INSTAGRAM}', INSTAGRAM).replace('{EMAIL}', EMAIL)
                .replace('{MAP}', MAP).replace('{DIRECTIONS}', DIRECTIONS).replace('{MAPLINK}', MAPLINK))
    out = (head(meta, R, path) + '\n' + header(meta, R) + '\n<main id="main">\n' + body.strip() + '\n</main>\n'
           + footer(R, body) + scripts(meta, R))
    with open(os.path.join(ROOT, path), 'w', encoding='utf-8', newline='\n') as f:
        f.write(out)
    print('built', path)


def main():
    for name in sorted(os.listdir(SRC)):
        if not name.endswith('.html'):
            continue
        src = open(os.path.join(SRC, name), encoding='utf-8').read()
        m = re.match(r'<!--meta (\{.*?\}) -->\n', src)
        meta = json.loads(m.group(1))
        path = meta.get('path', name)
        page(path, meta, src[m.end():])
    for d in services.SERVICES:
        meta, body = services.render(d)
        page('services/' + d['slug'] + '.html', meta, body)


if __name__ == '__main__':
    main()
