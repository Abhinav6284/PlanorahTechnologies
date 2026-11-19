"""Smaller copies of every photograph, so a phone never downloads a 1600px picture to show it 400px wide.

For each assets/img/NAME.jpg used by a page, the build keeps NAME-480.webp, NAME-800.webp and
NAME-1200.webp beside it (made once, with Pillow) and gives the <img> a srcset and sizes. The
original JPEG stays as the fallback src.
"""
import os, re

WIDTHS = (480, 800, 1200)
_made = {}


def _variants(root, name):
    """Make the WebP copies of assets/img/<name>.jpg if they are missing; return [(width, file)]."""
    if name in _made:
        return _made[name]
    src = os.path.join(root, 'assets', 'img', name + '.jpg')
    out = []
    try:
        from PIL import Image
        with Image.open(src) as im:
            im = im.convert('RGB')
            for w in WIDTHS:
                if w >= im.width:
                    continue
                f = '%s-%d.webp' % (name, w)
                path = os.path.join(root, 'assets', 'img', f)
                if not os.path.exists(path):
                    im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(path, 'WEBP', quality=74, method=6)
                out.append((w, f))
    except (ImportError, OSError):
        # without Pillow, use whatever copies already exist
        out = [(w, '%s-%d.webp' % (name, w)) for w in WIDTHS
               if os.path.exists(os.path.join(root, 'assets', 'img', '%s-%d.webp' % (name, w)))]
    _made[name] = out
    return out


def _sizes(tag):
    """How wide the picture is drawn, so the browser can choose the right copy."""
    if re.search(r'class="[^"]*\b(hx-pic|cta-pic)\b', tag) or 'data-full' in tag:
        return '100vw'
    if 'data-thumb' in tag:
        return '40px'
    return '(max-width: 760px) 100vw, (max-width: 1240px) 50vw, 640px'


def responsive(html, root):
    """Add srcset and sizes to every <img> of a JPEG in assets/img."""
    def fix(m):
        tag = m.group(0)
        if 'srcset=' in tag:
            return tag
        src = re.search(r'src="((?:\.\./)*)assets/img/([^"/]+)\.jpg"', tag)
        if not src:
            return tag
        prefix, name = src.groups()
        vs = _variants(root, name)
        if not vs:
            return tag
        srcset = ', '.join('%sassets/img/%s %dw' % (prefix, f, w) for w, f in vs)
        width = re.search(r'width="(\d+)"', tag)
        if width:
            srcset += ', %sassets/img/%s.jpg %sw' % (prefix, name, width.group(1))
        return tag[:-1].rstrip('/').rstrip() + ' srcset="%s" sizes="%s">' % (srcset, _sizes(tag))
    return re.sub(r'<img\b[^>]*>', fix, html)


def preload_first(html):
    """Preload the page's main picture: the one marked fetchpriority=high, else the opening panel's."""
    m = re.search(r'<img\b[^>]*fetchpriority="high"[^>]*>', html)
    if not m:
        fig = re.search(r'<figure class="ph-fig"[^>]*>\s*(<img\b[^>]*>)', html)
        if not fig:
            return html
        tag = fig.group(1)
        new = tag.replace('<img ', '<img fetchpriority="high" ', 1)
        html = html.replace(tag, new, 1)
        m = re.search(re.escape(new), html)
    tag = m.group(0)
    srcset, sizes = re.search(r'srcset="([^"]+)"', tag), re.search(r'sizes="([^"]+)"', tag)
    if not srcset:
        return html
    link = '<link rel="preload" as="image" imagesrcset="%s" imagesizes="%s" fetchpriority="high">\n' % (srcset.group(1), sizes.group(1) if sizes else '100vw')
    return html.replace('</head>', link + '</head>', 1)
