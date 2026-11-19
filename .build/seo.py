"""Search and sharing: the tags in each page's <head>, the structured data, and the sitemap.

Everything here is generated from the page sources at build time, so a new page or a new
question on a page is picked up without editing this file.
"""
import datetime, html, json, re
from urllib.parse import urljoin

SITE = 'https://www.planorahtechnologies.com/'
NAME = 'Planorah Technologies'
PHONE = '+91-77102-23342'
EMAIL = 'planorahtechnologies@gmail.com'
INSTAGRAM = 'https://www.instagram.com/planorahtechnologies/'
OG_IMAGE = SITE + 'assets/og.jpg'
LOGO = SITE + 'assets/logo.png'

# Where clients are served from the Ludhiana studio
CITIES = ['Ludhiana', 'Jalandhar', 'Amritsar', 'Patiala', 'Mohali', 'Chandigarh', 'Bathinda', 'Khanna',
          'Phagwara', 'Hoshiarpur', 'Moga', 'Kapurthala', 'Firozpur', 'Pathankot', 'Sangrur', 'Barnala']

SERVICES = [
    ('Website design & development', 'services/websites.html'),
    ('CRM & custom software development', 'services/crm.html'),
    ('Android & iOS app development', 'services/mobile.html'),
    ('TV app development', 'services/tv.html'),
    ('Google Business Profile & local SEO', 'services/google.html'),
    ('Software integrations & automation', 'services/integrations.html'),
]


def url(path):
    """The public address of a built page: folders, never index.html."""
    return SITE + ('' if path == 'index.html' else path.replace('index.html', ''))


def organisation():
    return {
        '@type': 'ProfessionalService',
        '@id': SITE + '#business',
        'name': NAME,
        'alternateName': 'Planorah',
        'description': 'Software studio in Ludhiana, Punjab building websites, Android and iOS apps, TV apps, '
                       'CRM and custom software for businesses across Punjab and India.',
        'url': SITE,
        'logo': LOGO,
        'image': OG_IMAGE,
        'email': EMAIL,
        'telephone': PHONE,
        'priceRange': '₹40,000+',
        'currenciesAccepted': 'INR',
        'paymentAccepted': 'Bank transfer, UPI',
        'address': {
            '@type': 'PostalAddress',
            'streetAddress': 'Chaudhary Complex, Rahon Road',
            'addressLocality': 'Ludhiana',
            'addressRegion': 'Punjab',
            'postalCode': '141007',
            'addressCountry': 'IN',
        },
        'areaServed': [{'@type': 'State', 'name': 'Punjab'}]
                      + [{'@type': 'City', 'name': c} for c in CITIES]
                      + [{'@type': 'Country', 'name': 'India'}],
        'openingHoursSpecification': [{
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            'opens': '10:00', 'closes': '19:00',
        }],
        'contactPoint': [{
            '@type': 'ContactPoint', 'telephone': PHONE, 'email': EMAIL, 'contactType': 'sales',
            'areaServed': 'IN', 'availableLanguage': ['English', 'Hindi', 'Punjabi'],
        }],
        'knowsLanguage': ['en', 'hi', 'pa'],
        'sameAs': [INSTAGRAM],
        'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Software development services',
            'itemListElement': [{'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': n, 'url': SITE + p}}
                                for n, p in SERVICES],
        },
    }


def breadcrumbs(body, path):
    """BreadcrumbList from the page's own breadcrumb, if it has one."""
    m = re.search(r'<nav class="crumb"[^>]*>(.*?)</nav>', body, re.S)
    if not m:
        return None
    base = SITE + path
    items = [(html.unescape(label), urljoin(base, href).replace('index.html', ''))
             for href, label in re.findall(r'<a href="([^"]*)">([^<]+)</a>', m.group(1))]
    current = re.search(r'aria-current="page">([^<]+)<', m.group(1))
    if current:
        items.append((html.unescape(current.group(1)), url(path)))
    return {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': u} for i, (n, u) in enumerate(items)]}


def faqs(body):
    """FAQPage from every question-and-answer pair on the page."""
    pairs = re.findall(r'<details class="qa"[^>]*><summary>(.*?)</summary><div>(.*?)</div></details>', body, re.S)
    if not pairs:
        return None
    text = lambda s: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', s))).strip()
    return {'@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': text(q), 'acceptedAnswer': {'@type': 'Answer', 'text': text(a)}} for q, a in pairs]}


def service(meta, path):
    s = meta.get('service')
    if not s:
        return None
    node = {
        '@type': 'Service', 'name': html.unescape(s['name']), 'serviceType': html.unescape(s['name']), 'url': url(path),
        'description': html.unescape(meta['desc']),
        'provider': {'@id': SITE + '#business'},
        'areaServed': [{'@type': 'State', 'name': 'Punjab'}, {'@type': 'Country', 'name': 'India'}],
    }
    prices = [int(p.replace(',', '')) for p in re.findall(r'₹([\d,]+)', s.get('price', ''))]
    if prices:
        node['offers'] = {'@type': 'Offer', 'priceCurrency': 'INR', 'priceSpecification': {
            '@type': 'PriceSpecification', 'priceCurrency': 'INR', 'minPrice': min(prices), 'maxPrice': max(prices)}}
    return node


def article(meta, path):
    """BlogPosting for a guide in the blog."""
    a = meta.get('article')
    if not a:
        return None
    return {
        '@type': 'BlogPosting', 'headline': html.unescape(meta['h1'] if 'h1' in meta else meta['title']),
        'description': html.unescape(meta['desc']), 'url': url(path), 'mainEntityOfPage': url(path) + '#page',
        'image': SITE + a['image'], 'datePublished': a['date'], 'dateModified': a.get('modified', a['date']),
        'inLanguage': 'en-IN', 'articleSection': a.get('section', 'Guides'), 'keywords': a.get('keywords', ''),
        'wordCount': a.get('words'),
        'author': {'@id': SITE + '#business'}, 'publisher': {'@id': SITE + '#business'},
        'about': [{'@type': 'Thing', 'name': k.strip()} for k in a.get('keywords', '').split(',') if k.strip()][:4],
    }


def head_tags(meta, path, body):
    """The search and sharing tags for one page."""
    title = html.unescape(meta['title'])
    desc = html.unescape(meta['desc'])
    e = lambda s: html.escape(s, quote=True)
    robots = 'noindex, follow' if meta.get('noindex') else 'index, follow, max-image-preview:large, max-snippet:-1'
    graph = [organisation()]
    if path == 'index.html':
        graph.append({'@type': 'WebSite', '@id': SITE + '#website', 'url': SITE, 'name': NAME,
                      'inLanguage': 'en-IN', 'publisher': {'@id': SITE + '#business'}})
    graph.append({'@type': 'WebPage', '@id': url(path) + '#page', 'url': url(path), 'name': title,
                  'description': desc, 'inLanguage': 'en-IN', 'isPartOf': {'@id': SITE + '#website'},
                  'about': {'@id': SITE + '#business'}, 'primaryImageOfPage': OG_IMAGE})
    for extra in (breadcrumbs(body, path), service(meta, path), article(meta, path), faqs(body)):
        if extra:
            graph.append(extra)
    data = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':'))
    return f'''<meta name="robots" content="{robots}" />
<meta name="geo.region" content="IN-PB" />
<meta name="geo.placename" content="Ludhiana, Punjab" />
<meta property="og:type" content="{'article' if meta.get('article') else 'website'}" />
<meta property="og:site_name" content="{NAME}" />
<meta property="og:locale" content="en_IN" />
<meta property="og:title" content="{e(title)}" />
<meta property="og:description" content="{e(desc)}" />
<meta property="og:url" content="{url(path)}" />
<meta property="og:image" content="{SITE + meta['article']['image'] if meta.get('article') else OG_IMAGE}" />
<meta property="og:image:alt" content="Planorah Technologies — websites, apps and software from Ludhiana, Punjab" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{e(title)}" />
<meta name="twitter:description" content="{e(desc)}" />
<meta name="twitter:image" content="{SITE + meta['article']['image'] if meta.get('article') else OG_IMAGE}" />{article_time(meta)}
<link rel="apple-touch-icon" href="{LOGO}" />
<script type="application/ld+json">{data}</script>'''


def article_time(meta):
    a = meta.get('article')
    if not a:
        return ''
    return ('\n<meta property="article:published_time" content="' + a['date'] + '" />'
            '\n<meta property="article:modified_time" content="' + a.get('modified', a['date']) + '" />')


def sitemap(pages):
    """sitemap.xml for every page that should be found in search."""
    today = datetime.date.today().isoformat()
    def weight(p):
        if p == 'index.html': return '1.0'
        if p.startswith('services/') or p == 'punjab.html': return '0.9'
        if p.startswith('blog/'): return '0.8'
        if p in ('contact.html', 'work.html'): return '0.8'
        if p in ('privacy.html', 'terms.html'): return '0.3'
        return '0.7'
    rows = ''.join(f'  <url>\n    <loc>{url(p)}</loc>\n    <lastmod>{today}</lastmod>\n    <priority>{weight(p)}</priority>\n  </url>\n'
                   for p in pages)
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + rows + '</urlset>\n'
