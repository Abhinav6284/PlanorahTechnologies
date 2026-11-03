"""The six service pages: their content, and the one template they share."""
import html

def esc(s):
    return s  # content below is written as HTML already (&amp; etc. where needed)


def render(d):
    meta = {"title": d['title'], "desc": d['desc'], "page": d['page'], "field": "or"}
    hero = d['hero']
    if hero.get('video'):
        media = (f'<video class="ph-mono" autoplay muted loop playsinline preload="metadata" poster="{{R}}assets/img/{hero["poster"]}" '
                 f'width="640" height="480" aria-hidden="true"><source src="{{R}}assets/img/{hero["video"]}" type="video/webm"></video>')
    else:
        media = f'<img class="ph-mono" src="{{R}}assets/img/{hero["img"]}" width="{hero["w"]}" height="{hero["h"]}" alt="{hero["alt"]}">'
    side = d['side']
    included = ''.join(f'<li data-in>{x}</li>' for x in d['included'])
    facts = ''.join(f'<div><dt>{k}</dt><dd>{v}</dd></div>' for k, v in d['glance'])
    pics = KIND_PICS.get(d['slug'], [])
    def kpic(i):
        if i >= len(pics): return ''
        f, w, h = IMG[pics[i][0]]
        return f'<img class="ph-mono" src="{{R}}assets/img/{f}" width="{w}" height="{h}" alt="{pics[i][1]}" loading="lazy">'
    kinds = ''.join(f'<div class="kind" data-in><h3>{h}</h3><p>{p}</p><p class="uses">{u}</p>{kpic(i)}</div>' for i, (h, p, u) in enumerate(d['kinds']))
    steps = ''.join(f'<li style="flex-grow:{w}"><div class="bar-seg">{t}</div><h3>{h}</h3><p>{p}</p></li>'
                    for (h, p, t), w in zip(d['steps'], d['weights']))
    qs = ''.join(f'<details class="qa" data-in><summary>{q}</summary><div><p>{a}</p></div></details>' for q, a in d['qs'])
    q = d['quote']
    paras = ''.join(f'<p>{p}</p>' for p in d['what'])
    body = f'''
<section class="ch ph" data-field="or" data-in-group>
  <nav class="crumb" aria-label="Breadcrumb" data-in><a href="{{R}}index.html">Home</a><span aria-hidden="true">/</span><a href="index.html">Services</a><span aria-hidden="true">/</span><span aria-current="page">{d['crumb']}</span></nav>
  <h1 data-in>{d['h1']}</h1>
  <div class="ph-body" data-in>
    <p class="lead">{d['lede']}</p>
    <div class="acts"><a class="btn" href="{{R}}contact.html?service={q}">{d['cta']} {{ARROW}}</a><a class="lnk" href="{d['second'][0]}">{d['second'][1]}</a></div>
  </div>
  <figure class="ph-fig" data-in>{media}<figcaption>{hero['cap']}</figcaption></figure>
</section>

<section class="ch" data-field="wh" data-in-group>
  <div class="split">
    <h2 class="sh" data-in>{d['what_h']}</h2>
    <div class="prose" data-in>{paras}</div>
    <aside class="side" data-in><figure><img class="ph-mono" src="{{R}}assets/img/{side['img']}" width="{side['w']}" height="{side['h']}" alt="{side['alt']}" loading="lazy"><figcaption>{side['cap']}</figcaption></figure></aside>
  </div>
</section>

<section class="ch" data-field="bk" id="included" data-in-group>
  <div class="big">
    <div class="bh" data-in><h2>{d['inc_h']}</h2></div>
    <ul>{included}</ul>
    <div class="glance" data-in>
      <h3>At a glance</h3>
      <dl class="facts">{facts}</dl>
      <a class="btn" href="{{R}}contact.html?service={q}">Send your requirement {{ARROW}}</a>
    </div>
  </div>
</section>

<section class="ch" data-field="or" data-in-group>
  <div class="kinds-h"><h2 data-in>{d['kinds_h']}</h2><p data-in>{d['kinds_p']}</p></div>
  <div class="kinds">{kinds}</div>
</section>

<section class="ch" data-field="wh" data-in-group>
  <h2 class="bar-h" data-in>{d['ship_h']}</h2>
  <p class="lead" data-in style="margin:-32px 0 56px">{d['ship_p']}</p>
  <ol class="bar">{steps}</ol>
</section>

<section class="ch" data-field="bk" data-in-group>
  <div class="qa-wrap">
    <div class="qh" data-in><h2>{d['q_h']}</h2><p>Ask anything else on <a class="lnk" href="#" data-wa-link>WhatsApp</a> or read the <a class="lnk" href="{{R}}faq.html">full FAQ</a>.</p></div>
    <div class="qs">{qs}</div>
  </div>
</section>

<section class="ch close" data-field="or" data-in-group>
  <h2 data-in>{d['close_h']}</h2>
  <div class="close-low">
    <p data-in>{d['close_p']}</p>
    <div class="acts" data-in><a class="btn" href="{{R}}contact.html?service={q}">Send your requirement {{ARROW}}</a><a class="lnk" href="{d['close2'][0]}">{d['close2'][1]}</a></div>
  </div>
</section>
'''
    return meta, body


IMG = {
    'skyline': ('ludhiana-skyline.jpg', 1920, 1315),
    'tower': ('programmers.jpg', 1600, 1067),
    'tv': ('smart-tv-on-lg.jpg', 1600, 1200),
    'terminal': ('student-with-computer.jpg', 1600, 1200),
    'operators': ('lacuca-card-reader-payment-terminal-at-supermarket.jpg', 1600, 1205),
    'nokia': ('smartphone-with-navigation-map-app.jpg', 1600, 1200),
    'static': ('fediverse-smartphone-apps-photo-by-elena-rossini.jpg', 1600, 1067),
    'bazaar': ('cashier-handing-receipt.jpg', 1600, 1126),
    'mill': ('programmer-writing-code-with-unit-tests.jpg', 1404, 936),
    'wheat': ('wendy-s-in-bilton-kingston-upon-hull.jpg', 1600, 1067),
    'station': ('software-developer-at-work.jpg', 1600, 1200),
    'antenna': ('lg-smart-tv-web-browser.jpg', 1600, 1005),
    'trucks': ('delivery-driver-delivering-takeout.jpg', 1600, 1067),
}
A = {
    'bazaar': 'A cashier handing a receipt to a customer across a shop counter',
    'mill': 'A programmer writing and testing code at a desktop computer',
    'wheat': 'Self-ordering touchscreen kiosks along the wall of a restaurant',
    'station': 'A software developer at work on a laptop in an office',
    'antenna': 'An LG smart TV running an app, with its on-screen keyboard open',
    'trucks': 'Illustration of an order placed on a phone and a rider out for delivery',
    'static': 'A hand holding a phone showing a folder of apps',
    'terminal': 'A student working on a laptop in a classroom',
    'nokia': 'A hand holding a smartphone with a map app open',
    'skyline': 'Rooftops of Ludhiana under a cloudy sky',
    'tv': 'An LG smart TV showing a web app on its screen',
}
KIND_PICS = {
    'websites': [('bazaar', A['bazaar']), ('mill', A['mill']), ('static', A['static'])],
    'crm': [('bazaar', A['bazaar']), ('mill', A['mill']), ('station', A['station'])],
    'mobile': [('bazaar', A['bazaar']), ('trucks', A['trucks']), ('antenna', A['antenna'])],
    'tv': [('antenna', A['antenna']), ('bazaar', A['bazaar']), ('static', A['static'])],
    'google': [('bazaar', A['bazaar']), ('skyline', A['skyline']), ('nokia', A['nokia'])],
    'integrations': [('trucks', A['trucks']), ('nokia', A['nokia']), ('mill', A['mill'])],
}
def pic(key, alt, cap):
    f, w, h = IMG[key]
    return {'img': f, 'w': w, 'h': h, 'alt': alt, 'cap': cap}


SERVICES = [
  dict(
    slug='websites', page='Websites', crumb='Websites', quote='Website',
    title='Websites &amp; landing pages — Planorah Technologies',
    desc='Fast, mobile-first websites with a CMS your own team can edit. Search, speed and analytics built in. Fixed quote, 3–5 weeks, handed over in full.',
    h1='Websites that load fast and stay yours.',
    lede='Marketing sites, online stores and campaign pages — mobile-first, editable by your own team, and wired to search and analytics before they go live.',
    cta='Get a fixed quote', second=('../work.html', 'See recent work'),
    hero=pic('skyline', 'Flat rooftops of Ludhiana stretching to the horizon under a cloudy sky', 'Rooftops of Ludhiana, 2021. Where most sites get opened: a mid-range phone, on 4G.'),
    what_h='What we build',
    what=['Most business websites are slow because nobody was watching. We build in Next.js, render pages ahead of time wherever the content allows, and keep the JavaScript that reaches the phone as small as the design permits. The site should open in a second or two on a mid-range Android over 4G — not only on a laptop sitting next to the office router.',
          'Content lives in a headless CMS, so your team edits text, images, pages, products and posts from a browser without calling us. We shape the fields around your content rather than handing over one blank rich-text box: a product has a price, a spec sheet and a gallery, a case study has a client type and a result. Layouts stay intact no matter who is editing.',
          'Search and speed are part of the build, not a later phase. Every page gets a real title and description, schema markup where it applies — LocalBusiness, Product, FAQ, Article — a generated sitemap, a sensible robots file and clean internal links. Images are converted and sized at build time so Core Web Vitals still pass a month after launch. Where you sell online, checkout, payments and stock sit on the same stack instead of on a second platform that disagrees with the first.'],
    side=pic('tower', 'Two developers working through code together on a laptop', 'Developers working through a build together.'),
    inc_h='What’s included',
    included=['Design and build of every page, mobile-first, on a live preview link you can open at any point in the project',
              'A headless CMS with fields shaped to your content, plus a handover session for whoever will actually be editing',
              'Technical SEO — titles, meta descriptions, schema markup, XML sitemap, robots.txt and redirects from every old URL',
              'Image optimisation, font loading and caching tuned until Core Web Vitals pass on mobile, measured not assumed',
              'Hosting, domain and SSL set up in your own accounts, with deploys running from your own repository',
              'Google Analytics 4 and Search Console connected and verified, tracking the handful of events that matter to you',
              'Thirty days of fixes after launch, then the whole thing is yours — code, content, accounts and all'],
    glance=[('Platforms', 'Web · PWA'), ('Typical timeline', '3–5 weeks'), ('Starting from', '₹45,000 – ₹1,80,000'), ('You receive', 'Code, CMS, accounts'), ('Support', '30 days of fixes')],
    kinds_h='Three kinds of site, one way of building.',
    kinds_p='Nearly every enquiry lands in one of these. The stack, the CMS and the handover stay the same either way — only the scope moves.',
    kinds=[('Marketing sites', 'The site most companies actually need: what you do, who it is for, proof that it works, and an obvious way to get in touch. Five to fifteen pages, a blog if you will keep it fed, and a CMS behind all of it.', 'Next.js, headless CMS, blog, schema'),
           ('E-commerce', 'Catalogue, cart, checkout and stock, with Razorpay or Stripe handling payments and order updates going out over WhatsApp or email. One codebase, one place to log in, no second platform to reconcile.', 'Catalogue, payments, stock, orders'),
           ('Landing pages &amp; campaigns', 'Single-purpose pages for an ad campaign, a product launch or a trade show — built in days, with the form, the thank-you step and conversion tracking wired to Analytics and the ad platform so you can tell which version paid for itself.', 'Ads, forms, tracking, speed')],
    ship_h='From sitemap to go-live.',
    ship_p='You see the real site on a live link from the second week. Nothing about launch day should be a surprise.',
    steps=[('Sitemap and content', 'First, every page listed, what it has to say, and who writes it. Missing copy is the usual reason a site slips.', 'Days 1–3'),
           ('Design, page by page', 'Then clickable screens for the home page and each template, reviewed on a phone before a line is coded.', 'Week 1–2'),
           ('Build and load content', 'Next, pages, CMS and integrations, deployed to a preview link that updates every time we push.', 'Week 2–4'),
           ('Launch and measure', 'Last, DNS switch, redirects from the old URLs, Search Console and Analytics — then 30 days of fixes.', 'Week 4–5')],
    weights=[3, 7, 10, 7],
    q_h='The ones we get most.',
    qs=[('How long does a website take?', 'Three to five weeks for most marketing sites, counted from the day the content is ready rather than the day we start. A single landing page is usually under a week. An online store with a large catalogue and payment integration runs six to eight. If a date matters — a launch, an exhibition, a funding round — say so at the quote stage and we will scope to fit it rather than discover the problem in week four.'),
        ('Can our own team update the site afterwards?', 'Yes, and that is the whole point of the CMS. Text, images, pages, blog posts, team members, products and prices are all editable from a browser with no developer involved. We shape the fields around your content so nothing can break a layout, run a handover session for whoever will be doing the editing, and leave a short written guide behind. If you would rather we handled updates, that is a separate arrangement — never a requirement.'),
        ('What does it cost to run every month?', 'Less than most people expect. Hosting a standard marketing site runs from nothing to roughly ₹1,500 a month depending on traffic. A domain is about ₹800 to ₹1,500 a year. A headless CMS is free at small volumes and around ₹1,000 to ₹4,000 a month once you have several editors. Everything sits in your own accounts, so you pay the providers directly at their published rates and there is no margin added by us.'),
        ('Do we own the code and the accounts?', 'Completely. The repository, the hosting, the domain, the CMS, the analytics — every account is created in your name or transferred to it at handover, along with the source code. We do not tie a site to a maintenance contract. If you decide next year to move to another studio, you can, and you will not need anything from us to do it.')],
    close_h='Tell us what the site has to do.',
    close_p='A paragraph is enough — what you sell, who buys it, and what the current site gets wrong. You get a reply the same working day and a fixed quote within 48 hours.',
    close2=('mailto:planorahtechnologies@gmail.com', 'Email us instead'),
  ),
  dict(
    slug='crm', page='CRM', crumb='CRM &amp; custom software', quote='CRM',
    title='CRM &amp; custom software — Planorah Technologies',
    desc='Leads, quotations, billing, stock and reporting in one system built around how your team already works. Fixed quote, role-based access, full handover.',
    h1='Software shaped around your process.',
    lede='Leads, quotations, billing, stock and reporting in one system built to match how your team already works — not a rented template you bend the business around.',
    cta='Get a fixed quote', second=('../work.html', 'See recent work'),
    hero=pic('bazaar', 'A cashier handing a receipt to a customer across a shop counter', 'Every sale at the counter, recorded once.'),
    what_h='What we build',
    what=['A system is only useful if it matches the way work already happens. So we start by watching it — the shared spreadsheet, the WhatsApp group, the register at the counter, the follow-up that lives in one person’s head. We write that process down, you correct it, and then we build software that follows it and quietly removes the steps that existed only because a spreadsheet could not do better. Nobody should have to learn new vocabulary to use their own system.',
          'Most builds cover the same spine: leads and pipelines, quotations and follow-ups, invoices and payment status, stock and purchase orders, and role-based access so an executive sees their own accounts while the owner sees everything. On top of that sits reporting — the four or five numbers someone currently compiles by hand on the first of every month, available at any hour instead.',
          'Your existing data comes with you. We migrate from Excel, from Tally exports, from whatever the last system produced, clean the duplicates and keep a record of what changed. Notifications go out over WhatsApp and email — quotation sent, payment overdue, stock below reorder level — so people stop chasing each other for status. Every record carries an audit trail of who changed what and when, and everything exports to CSV or Excel on demand, because data you cannot get out is data you do not really own.'],
    side=pic('operators', 'A card payment terminal at a supermarket checkout', 'A payment terminal at a checkout.'),
    inc_h='What’s included',
    included=['A written map of how your team works today, agreed and signed off before we build anything',
              'Leads, pipelines, quotations, invoices and stock — scoped to the parts you will genuinely use, not a feature list',
              'Role-based access with per-action permissions, so people see and change only what belongs to them',
              'Migration from your spreadsheets or current system, with a duplicate and consistency check you review first',
              'WhatsApp and email notifications for the events that matter — new lead, quote sent, payment due, low stock',
              'Audit trails on every record and one-click export to CSV or Excel from every screen',
              'Training per role, a short written manual, the source code, the database, and 30 days of fixes after go-live'],
    glance=[('Platforms', 'Web · Tablet · Mobile'), ('Typical timeline', '6–10 weeks'), ('Starting from', '₹1,50,000 – ₹6,00,000'), ('You receive', 'Code, database, docs'), ('Support', '30 days, AMC optional')],
    kinds_h='Three parts of one system.',
    kinds_p='Most companies need two of these on day one and the third by the second quarter. They are built on the same data, so adding the next one is not a new project.',
    kinds=[('Sales pipeline', 'Leads from the website, WhatsApp and walk-ins land in one list, each with an owner and a next action. Stages you name yourself, follow-up reminders that actually fire, quotations generated from your own template, and a recorded reason every time a deal is lost.', 'Leads, stages, quotations, reminders'),
           ('Billing &amp; inventory', 'GST-ready invoices on your own numbering series, payment status against each one, and stock that moves as orders are raised rather than at month end. Purchase orders, reorder levels and a count that no longer needs a Sunday to reconcile.', 'Invoices, GST, stock, purchase orders'),
           ('Reporting &amp; roles', 'Dashboards for the numbers you check weekly — pipeline value, collections due, stock ageing, performance by executive. Each role opens to its own view, every table exports to Excel, and every change is logged with a name and a timestamp.', 'Dashboards, roles, exports, audit trail')],
    ship_h='From spreadsheet to go-live.',
    ship_p='Working software every fortnight on a test link, starting with the module that hurts most. Your team uses it while it grows, so training is half done by launch.',
    steps=[('Sit with the process', 'First, sessions with the people doing the work — the spreadsheet, the register, the group chat. We write it down, you correct it.', 'Days 1–5'),
           ('Data model and screens', 'Then records, fields, roles and permissions agreed on paper, and clickable screens for each role before any code.', 'Week 2–3'),
           ('Build in fortnightly releases', 'Next, a working module on a test link every two weeks. You use each one and tell us what is wrong while it is cheap to change.', 'Week 3–8'),
           ('Migrate, train, go live', 'Last, data moved and checked, training per role, a short parallel run against the old way, then the switch.', 'Week 9–10')],
    weights=[5, 10, 30, 10],
    q_h='The ones we get most.',
    qs=[('Why build a CRM instead of subscribing to one?', 'For plenty of teams a subscription is the right answer, and we will tell you so. Building makes sense when your process is the thing that earns the money and no product matches it, when per-user pricing at your headcount costs more over three years than building once, or when the data has to sit next to billing and stock that a generic CRM will never touch. If an off-the-shelf tool fits, we would rather set that up properly for you than sell you a build you did not need.'),
        ('Can you move our existing spreadsheets in?', 'Yes, and it is usually the first thing we do. We take the exports — Excel, CSV, Tally, or a dump from whatever you run now — map the columns to the new records, and run a duplicate and consistency check that you review before anything is loaded. Rows that cannot be matched come back to you as a list to decide on, never quietly dropped. Old files stay untouched so there is always something to compare against.'),
        ('Who can see what?', 'You decide, role by role. A common setup gives an executive their own leads and quotations, a manager the team pipeline and approvals, accounts the billing side, and the owner everything including reports and audit logs. Permissions are per action rather than per screen, so a person can view an invoice without being able to edit or delete it, and every change is recorded with a name and a timestamp you can look up later.'),
        ('What happens after it goes live?', 'Thirty days of fixes are included — anything that does not behave as scoped, we correct at no cost. After that most clients take an annual support arrangement, typically 12 to 18 per cent of the build cost per year, covering hosting oversight, updates, small changes and a response time we agree in writing. It is optional. The source code, the database and the documentation are yours either way, so another team could pick it up if you ever wanted them to.')],
    close_h='Show us the spreadsheet.',
    close_p='Send a note about how the work happens today and where it breaks. You get a reply the same working day and a fixed quote within 48 hours.',
    close2=('mailto:planorahtechnologies@gmail.com', 'Email us instead'),
  ),
  dict(
    slug='mobile', page='Mobile', crumb='Mobile apps', quote='Mobile',
    title='Mobile apps for iOS &amp; Android — Planorah Technologies',
    desc='One codebase, both app stores. Design, native modules, push, payments, signing and store release handled — then the accounts and source handed to you.',
    h1='One codebase, both app stores.',
    lede='We design, build and release apps for iPhone and Android from a single codebase — dropping to native code where the hardware demands it, handling signing and store submission ourselves, and handing you the accounts and the source at the end.',
    cta='Get a fixed quote', second=('#included', 'What is included'),
    hero=pic('nokia', 'A hand holding a smartphone with a map app open', 'A map app open on a phone.'),
    what_h='What we build',
    what=['Most businesses need the same app on iPhone and Android. We build it once in React Native, share the screens and the logic across both platforms, and drop to native Swift or Kotlin only where the platform genuinely differs — camera pipelines, Bluetooth hardware, background location, biometric login. Two store listings come out of one codebase, so a change ships to both platforms in the same week rather than two months apart.',
          'Phones lose signal, and we assume that from the first screen. Data is cached on the device, actions taken offline are queued, and everything syncs when the connection returns instead of failing behind a spinner. Push notifications are wired to deep links, so a tap opens the specific order or message rather than the home screen. Payments run through Razorpay, UPI or cards — or through Apple and Google in-app purchase where the stores require it for digital goods.',
          'The release is part of the job, not something handed back to you at the end. We create the signing certificates and the Android keystore, write the listing copy, produce screenshots at every size both stores demand, complete the privacy and data-safety declarations, and submit for review. You supply two things: an Apple Developer Program account and a Google Play Console account, both registered to your business. Apple and Google verify organisation accounts against a D-U-N-S number and company documents, which takes several days, so we ask for them in week one rather than the week you want to launch.'],
    side=pic('skyline', 'Flat rooftops of Ludhiana stretching to the horizon under a cloudy sky', 'Ludhiana, 2021. Basements and dead patches included.'),
    inc_h='What is included',
    included=['Design for both platforms — iOS and Android patterns respected, not one layout skinned twice',
              'A single codebase building to the App Store and Google Play from the same source',
              'Native modules where the hardware demands them — camera, Bluetooth, biometrics, background location',
              'Offline handling: local cache, queued actions and sync when the connection returns',
              'Push notifications with deep links, plus crash reporting and analytics from day one',
              'Payments through Razorpay, UPI and cards, or in-app purchase where the stores require it',
              'Signing keys, store listings, screenshots, privacy declarations and the review submission'],
    glance=[('Platforms', 'iOS 15+ · Android 8+'), ('Typical timeline', '6–10 weeks'), ('Starting from', '₹1,80,000 – ₹6,00,000'), ('You receive', 'Code, keys &amp; store accounts'), ('Support', '30 days free, then monthly')],
    kinds_h='Three kinds of app, one way of working.',
    kinds_p='Most requests fall into one of these. The build process is the same; what changes is who holds the phone and what they need it to do in the first ten seconds.',
    kinds=[('Customer apps', 'Ordering, booking, loyalty, tracking and account management — the app your customers install. Built around one clear job on the home screen, with sign-in that survives a weak connection and a checkout that does not lose the cart.', 'Ordering, bookings, accounts, payments'),
           ('Field &amp; staff apps', 'Delivery runs, site inspections, stock counts and service calls. Works in a basement or on a highway with no signal, captures photos and GPS against each job, and syncs into your CRM the moment the network comes back.', 'Offline-first, photos and GPS, role access'),
           ('Store release &amp; maintenance', 'Certificates, listings, phased rollout and the review queue. After launch we keep the app meeting each yearly target-API deadline Apple and Google enforce, so it stays installable instead of quietly disappearing from search.', 'Signing, store listing, SDK updates, monitoring')],
    ship_h='Ten weeks, start to store.',
    ship_p='You see the app on your own phone from week two. Nothing is saved up for a reveal at the end.',
    steps=[('Scope and fixed quote', 'First, a screen-by-screen list, the platforms we build for, what sits outside the scope and one fixed price — before any code.', 'Days 1–3'),
           ('Design and prototype', 'Then clickable screens for both platforms on a link you open on your own phone. Changes happen here, where they cost an afternoon.', 'Weeks 1–2'),
           ('Build and test builds', 'Next, weekly builds through TestFlight and Play internal testing, on the real devices your team carries. You use it while we build it.', 'Weeks 2–7'),
           ('Submission and release', 'Last, listings, signing, review submission, then a staged rollout that we watch. Thirty days of fixes are included after launch.', 'Weeks 8–10')],
    weights=[3, 10, 30, 15],
    q_h='Before you commit.',
    qs=[('Do we need our own Apple and Google developer accounts?', 'Yes, and they should be in your company’s name so the app is legally yours. Apple charges 99 US dollars a year for the Developer Program. Google charges a one-time 25 US dollars for a Play Console account. Both verify organisation accounts against a D-U-N-S number and business documents, which can take several days and occasionally longer if the registered address does not match. We walk you through the signup and then work inside your accounts — we never publish your app under ours, because that makes moving away from us expensive later.'),
        ('How long does store review actually take?', 'Apple usually returns a decision within a day or two. Google Play is often similar for an established account, but a brand-new developer account goes through extra identity checks and the first release can sit for a week or more. Rejections are normal and almost always about metadata, permission justifications, login credentials for the reviewer or account deletion. We respond and resubmit at no extra cost until the app is approved.'),
        ('React Native or fully native — which do we get?', 'React Native by default, because one team and one codebase costs you less and reaches both stores in the same week. Where an app is built around sustained camera work, heavy 3D, low-level Bluetooth or continuous background processing, we say so during scoping and quote native Swift and Kotlin instead. We would rather lose the shortcut than ship something that stutters on a mid-range Android phone.'),
        ('What does it cost to keep the app running after launch?', 'Thirty days of fixes are included. After that most clients move to a monthly retainer of ₹15,000 – ₹45,000, which covers operating system updates, the yearly target-API deadlines both stores enforce, dependency and security upgrades, crash monitoring and small changes. You can also take the code and run it with your own team — the repository, the keys and the accounts are yours either way.')],
    close_h='Tell us what the app has to do.',
    close_p='Send the requirement on WhatsApp — a paragraph is enough. You get a screen list, a fixed price and a launch date back within two working days.',
    close2=('../process.html', 'See how we work'),
  ),
  dict(
    slug='tv', page='TV', crumb='TV apps', quote='TV',
    title='TV apps for tvOS, Android TV &amp; webOS — Planorah Technologies',
    desc='Apps for the ten-foot screen: focus model, large type, video playback, DRM and certification on tvOS, Android TV, Fire TV, LG webOS and Samsung Tizen.',
    h1='Apps for the ten-foot screen.',
    lede='Television is not a bigger phone. The only input is a D-pad remote, the viewer is three metres away, and every store reviews the app by hand. We build for those constraints from the first screen.',
    cta='Get a fixed quote', second=('#included', 'What is included'),
    hero={'video': 'analog-tv-noise.webm', 'poster': 'analog-tv-noise-poster.jpg', 'cap': 'Analogue television noise. Focus model, large type, video playback, DRM and certification on five platforms.'},
    what_h='What we build',
    what=['A television app has one input: four directions and an OK button, held by someone sitting across the room. Every screen has to answer two questions at all times — where is the focus now, and where does it go when the viewer presses right. We design that as a real spatial navigation map before any layout work, because a focus ring that gets stuck in a corner or skips a row is the fault viewers notice in the first ten seconds. Type is sized to read from three metres, contrast is raised, and the safe area is respected so nothing important lands on the edge that older sets crop.',
          'Video is the other half of the work. We handle adaptive bitrate streaming over HLS and DASH, resume points, subtitle and audio track switching, and DRM where the content licence requires it — FairPlay on tvOS, Widevine on Android TV and Fire TV, PlayReady on Samsung and LG. All of it is tested on the hardware people actually own, which is usually a set bought four or five years ago with a slow processor and a fraction of the memory in a current phone. An app that feels instant on a development machine and takes eight seconds to open a catalogue on a real television has not been finished.',
          'TV is a genuinely different discipline from mobile, and treating it as a resized phone app is the most common way these projects fail. There is no touch and no hover, so nothing can depend on a gesture, a long press or a tooltip. Store review is stricter and slower: Apple, Google, Amazon, Samsung and LG each put a person in front of a real remote to check focus behaviour, the back button, playback controls and recovery from a dropped connection. Samsung and LG go further and run the build on their own certified device pool. We build against those checklists from week one instead of meeting them for the first time at submission.'],
    side=pic('tv', 'An LG smart TV showing a web app on its screen', 'A web app on a smart TV.'),
    inc_h='What is included',
    included=['A spatial navigation model — every D-pad direction from every element decided, built and tested',
              'Ten-foot layouts: large type, raised contrast, visible focus states, safe areas honoured',
              'Video playback over HLS and DASH with resume points, subtitles and audio track switching',
              'DRM where your licence requires it — FairPlay, Widevine or PlayReady, with the licence server wired in',
              'Builds for tvOS, Android TV, Fire TV, LG webOS and Samsung Tizen from one design system',
              'Testing on real hardware, including low-powered sets several generations old',
              'Store submission on every platform, including the Samsung and LG certified device review'],
    glance=[('Platforms', 'tvOS, Android TV, Fire TV, webOS, Tizen'), ('Typical timeline', '10–16 weeks'), ('Starting from', '₹3,50,000 – ₹12,00,000'), ('You receive', 'Code, keys &amp; store accounts'), ('Support', '30 days free, then monthly')],
    kinds_h='Three kinds of screen in the room.',
    kinds_p='Not every television app is a streaming service. The remote and the viewing distance are the same; what changes is who is watching and why the screen is on.',
    kinds=[('Streaming &amp; video', 'Catalogue browsing, continue-watching, live channels and pay-per-view events. Adaptive streaming, DRM and playback analytics are wired in together, so you can see what people finish and exactly where they drop out.', 'HLS and DASH, DRM, live, analytics'),
           ('Catalogue &amp; retail TV', 'Product ranges, showreels, menus and property listings on the big screen, driven by the same catalogue your website already uses. One update, every screen, and no second content team keeping the television in sync by hand.', 'Catalogue sync, search, multi-language'),
           ('Signage &amp; kiosk screens', 'Menu boards, waiting-room displays and in-store screens that run unattended for months. Scheduled playlists, updates pushed from a browser, and a device that restarts into the right app on its own after a power cut.', 'Playlists, remote update, auto-recovery')],
    ship_h='Focus first, certification last.',
    ship_p='The navigation model is settled before anyone writes a layout, because rebuilding focus after the fact means rebuilding the app.',
    steps=[('Targets and remote map', 'First, we agree which devices ship first, then map every D-pad move on every screen. Ambiguity here becomes a rebuild later.', 'Week 1'),
           ('Ten-foot design', 'Then full-size layouts reviewed on an actual television, not a laptop. Type, focus states and safe areas are signed off before code.', 'Weeks 2–3'),
           ('Build and device testing', 'Next, weekly builds side-loaded onto real Apple TV, Android TV, Fire TV and smart-TV hardware — including the slow older sets your audience owns.', 'Weeks 3–10'),
           ('Certification and rollout', 'Last, each store reviews separately. Samsung and LG run the build on their certified device pool, which adds weeks on top of Apple and Google.', 'Weeks 11–16')],
    weights=[5, 10, 40, 30],
    q_h='Before you commit.',
    qs=[('Can you reuse our mobile app for TV?', 'The business logic and the API layer, yes — that is real saving and we plan for it. The interface, no. A phone app assumes touch targets, scrolling, hover and gestures. A TV app has four directions, an OK button and a viewer three metres away who cannot see a 14-pixel label. Shipping a stretched phone layout is the most common reason television apps get rejected in review and abandoned by viewers after one session. Budget for a new interface built on top of the data layer you already own.'),
        ('Which platform should we launch on first?', 'It depends on who is watching. In India, Android TV and Fire TV cover most connected sets and streaming sticks and are the quickest to reach, so they usually go first. tvOS matters when your audience is already on iPhones and Apple TV boxes. Samsung Tizen and LG webOS reach millions of televisions with nothing plugged in at all, but they carry the longest certification cycle and their own SDK quirks, so we normally add them as a second release six to eight weeks after launch.'),
        ('Do we need DRM?', 'Only if your content licence requires it. Owned marketing footage, product catalogues, training material and in-house video do not need DRM, and adding it would only cost you money. Licensed film, television and sport almost always do, and the rights holder will name the systems — FairPlay for Apple, Widevine for Android TV and Fire TV, PlayReady for Samsung and LG. DRM brings a licence server, a recurring monthly cost and roughly two weeks of extra build time, so we settle the question during scoping rather than after the quote is signed.'),
        ('How is TV store review different from the App Store?', 'It is slower and it is manual. A reviewer sits with a remote and checks that focus never gets stuck, that the back button always goes somewhere sensible, that playback controls respond, and that the app recovers when the network drops mid-stream. Samsung and LG go further again and run the build on their own certified device pool covering several model years. Plan on two to four weeks for certification per platform rather than the day or two a phone app takes, and expect at least one round of comments on the first submission.')],
    close_h='Tell us which screens you need to reach.',
    close_p='Send us the platforms, the content and the deadline. You get a device list, a fixed price and a certification timeline back within two working days.',
    close2=('../process.html', 'See how we work'),
  ),
  dict(
    slug='google', page='Google', crumb='Google presence', quote='Google',
    title='Google Business Profile, Search &amp; Workspace — Planorah Technologies',
    desc='Business Profile created and verified, the map pin on your real door, Search Console and Analytics 4 connected, and Workspace email on your own domain.',
    h1='Your business, correct on Google.',
    lede='We create and verify your Business Profile, put the map pin on the door customers actually walk through, connect Search Console and Analytics 4, and move your email to Google Workspace on your own domain.',
    cta='Get a quote on WhatsApp', second=('../work.html', 'See our work'),
    hero=pic('nokia', 'A hand holding a smartphone with a map app open', 'Where most customers find you first: a map on a phone.'),
    what_h='What we set up',
    what=['Most local searches end on a Google listing, not on a website. Someone types your trade and their area, taps the first result that looks open and nearby, and calls the number shown. If that listing has the wrong pin, last year’s hours or a category nobody searches for, the search still happens — it just ends somewhere else.',
          'So we start with the listing and work outwards. The Business Profile that customers see on Search and Maps gets created or claimed, verified, and filled in completely. Then the measurement side — Search Console and Google Analytics 4 — goes on your website so you can see which searches brought people and what they did next. Then Google Workspace, so replies come from you@yourcompany.com instead of a free address that makes a real company look temporary.',
          'We are also clear about the line between what we control and what Google controls. We control accuracy and completeness: name, categories, hours, service areas, photos, products, posts and how quickly reviews get answered. Google controls who appears where, and it changes that on its own schedule. Nobody can buy or promise a position. A verified, complete, consistently updated profile is the part you can actually influence — and it is the part most businesses never finish.'],
    side=pic('tower', 'Two developers working through code together on a laptop', 'Developers working through a build together.'),
    inc_h='What’s included',
    included=['Business Profile created or claimed, then taken through whichever verification Google asks for',
              'Map pin moved to your actual entrance, with service areas set if you travel to customers',
              'Primary and secondary categories chosen from what people search for, not what sounds impressive',
              'Hours, holiday hours, phone, website and booking links, attributes, photos, logo and a products list',
              'Duplicate and unclaimed listings found and merged, so two versions of you stop competing',
              'Search Console and Analytics 4 connected, with events for calls, directions and form submissions',
              'Workspace mailboxes on your own domain plus LocalBusiness schema on your site, so the name, address and phone match everywhere'],
    glance=[('Typical price', '₹15,000 – ₹45,000'), ('Setup time', '1–3 weeks'), ('Verification', '2–14 days, Google’s pace'), ('Workspace licence', 'Billed by Google'), ('Handover', 'All accounts in your name')],
    kinds_h='The listing, the numbers, the email.',
    kinds_p='These are usually bought from three different people and never quite line up. Set up together, they agree with each other and with your website.',
    kinds=[('Business Profile &amp; Maps', 'Claim, verify, and fill in every field Google offers — categories, hours, service areas, attributes, photos and products. We check the pin against a real address on the map, merge duplicate listings, and set up a routine for posts and for replying to every review, good or bad, within a couple of days.', 'Verification, map pin, categories, reviews'),
           ('Search Console &amp; Analytics', 'Search Console verified on your domain with the sitemap submitted, so you can see the queries you appear for and any page Google cannot index. Analytics 4 goes on next, with conversion events for calls, direction requests and form submissions — the actions worth counting, not raw visits.', 'Search Console, GA4, events, sitemap'),
           ('Workspace email &amp; domain', 'Mailboxes on your own domain, groups like accounts@ and support@, shared Drive folders, and old mail imported so nothing is left behind. DNS is the part people get wrong: we set MX, SPF, DKIM and DMARC properly, then test delivery in both directions before you switch.', 'Workspace, DNS and MX, SPF and DKIM, migration')],
    ship_h='Verification starts on day one.',
    ship_p='Google sets the pace on verification, so we begin it immediately and do everything else while it runs. Three weeks end to end for most businesses.',
    steps=[('Audit &amp; access', 'First, we search Google the way your customer would, find every listing carrying your name, and get owner access to the right one.', 'Days 1–2'),
           ('Verify &amp; fill in', 'Then verification is requested. While it runs, we write the description, pick categories, set hours and prepare photos.', 'Days 2–10'),
           ('Measurement &amp; email', 'Next, Search Console, Analytics 4 and conversion events go on the site. Workspace mailboxes, DNS and mail migration happen the same week.', 'Week 2'),
           ('Handover &amp; first month', 'Last, ownership moves to your Google account with us as a manager, plus a one-page guide and 30 days of fixes on us.', 'Week 3')],
    weights=[2, 8, 5, 5],
    q_h='The ones worth asking first.',
    qs=[('How long does Google verification take?', 'Between two days and two weeks, and it is not ours to control. Video verification is usually the fastest — a short recording of your premises, signage and equipment. Postcard verification is the slowest and occasionally has to be requested a second time. We start it on day one precisely because it is the one step nobody can speed up, and we keep working on everything else while it runs.'),
        ('Can you get us to the top of Google?', 'No, and neither can anyone who tells you they can. Google decides ranking, it weighs distance from the person searching, and it changes how it works several times a year. What we can do is make your listing verified, complete, correctly categorised and consistent with your website — the information Google actually reads. That improves how often you appear and how much a person learns when you do. It is not a promised position, and we will not sell it as one.'),
        ('Can you remove a bad review?', 'Only Google can, and only when a review breaks its policies — spam, a competitor, abuse, or a review of a business you are not. We will report those and tell you honestly when one does not qualify. For genuine complaints the answer is a reply, not a deletion: a short, specific, unemotional response within a day or two. Everyone reading the listing sees how you handle a bad week, and that is usually worth more than the star it cost you.'),
        ('Who owns the accounts afterwards?', 'You do, without exception. The Business Profile, Search Console, Analytics and the Workspace admin console all sit in your Google account, and we are added as a manager or delegated admin. If you stop working with us you remove our access in a minute and nothing breaks, nothing is held back, and no login has to be bought from us. We have seen too many businesses locked out of a listing an ex-agency still owns.')],
    close_h='Find out what Google shows for you today.',
    close_p='Send us your business name, city and website. We will check what is already listed under your name and reply with what is missing or wrong — whether or not you hire us for the fix.',
    close2=('mailto:planorahtechnologies@gmail.com', 'Email us instead'),
  ),
  dict(
    slug='integrations', page='Integrations', crumb='Integrations', quote='Integrations',
    title='Integrations &amp; automation — Planorah Technologies',
    desc='Payment gateways, WhatsApp Business API, Tally, Zoho Books and ERP connected properly, with retries and alerts — so an order is entered once.',
    h1='The same data, entered once.',
    lede='We connect the systems you already pay for — payment gateway, WhatsApp, accounting, ERP — so an order becomes a payment, a message and a ledger entry without anyone retyping it. And when a connection fails, it raises an alert instead of going quiet.',
    cta='Get a quote on WhatsApp', second=('../process.html', 'How we work'),
    hero=pic('operators', 'A card payment terminal at a supermarket checkout', 'A payment terminal at a checkout.'),
    what_h='What we build',
    what=['Most small companies do not have a data problem. They have a retyping problem. An order arrives on the website, someone copies it into a spreadsheet, someone else messages the customer on WhatsApp from a personal phone, and accounts hears about it on Friday. Every copy is a chance for the three systems to disagree, and by month-end they always do.',
          'We build the connections that remove the retyping. A payment gateway that confirms the order the moment money is actually captured. A WhatsApp Business API sender that tells the customer what happened, from your verified business number rather than a staff member’s. An accounting sync that posts invoices and payments into Tally or Zoho Books on the schedule you choose. Where a system has a proper API we use it; where it does not, we use its import format and a scheduled job — and we tell you which of the two you are getting before you pay for it.',
          'The part that decides whether any of this survives contact with a real month is what happens when a connection fails, because it will. Gateways have outages, tokens expire, a GST number gets rejected, an ERP is rebooted mid-sync. Every job we build retries with a back-off, records what it sent and what came back, and raises an alert to email or WhatsApp when it finally gives up. Failures become visible instead of silent — the difference between a two-minute fix and a reconciliation nightmare in the last week of the quarter.'],
    side=pic('mill', 'A programmer writing and testing code at a desktop computer', 'Writing and testing code.'),
    inc_h='What’s included',
    included=['Payment gateway with UPI, cards and netbanking — Razorpay or the provider you already use',
              'WhatsApp Business API on your own verified number, with message templates submitted for approval',
              'Accounting sync to Tally or Zoho Books — invoices, payments and customer records, on your schedule',
              'ERP and inventory connections over an API where one exists, scheduled file imports where it does not',
              'Webhook endpoints with signature checks and idempotency, so a repeated callback cannot double-charge',
              'Retries with back-off, a searchable log of every request and response, and alerts when a job gives up',
              'A one-page map of what talks to what, plus keys, credentials and documentation handed to your team'],
    glance=[('Typical project', '₹25,000 – ₹1,50,000'), ('Single connection', 'From ₹18,000'), ('Build time', '2–5 weeks'), ('Gateway &amp; API fees', 'Billed by the provider'), ('Handover', 'Code, keys and docs')],
    kinds_h='Money in, message out, books updated.',
    kinds_p='Three connections cover most of the retyping in a small business. We build them one at a time, in the order that saves your team the most hours first.',
    kinds=[('Payments', 'UPI, cards, netbanking and wallets through Razorpay or the gateway you already hold. Order status is driven by the gateway’s signed webhook, not by the customer’s browser — so an order is paid only when the money is. Refunds, partial refunds and settlement reports included.', 'Razorpay, UPI, refunds, webhooks'),
           ('WhatsApp Business API', 'Order confirmations, dispatch updates, appointment reminders and payment links sent from your own verified business number. We write the templates, submit them to Meta for approval, and write delivery and read status back into your system so you can see what actually landed.', 'Templates, notifications, verified number'),
           ('Accounting &amp; ERP sync', 'Invoices, receipts, customers and stock moved between your site, Tally, Zoho Books and the ERP — event by event or on a nightly schedule. Field mapping is agreed in writing first, and a reconciliation report shows you exactly which records crossed and which were rejected.', 'Tally, Zoho Books, ERP, scheduled sync')],
    ship_h='Test keys first, live keys last.',
    ship_p='Nothing touches real money or real customers until the same flow has run end to end in a sandbox. Four to five weeks for a typical set of three connections.',
    steps=[('Map what exists', 'First, we list every system holding the same record, who types into each one, and which is the source of truth when two disagree.', 'Days 1–3'),
           ('Build in a sandbox', 'Then test gateway keys, a sample WhatsApp template, a copy of your Tally company — replayed against fake data until the edge cases stop surprising us.', 'Weeks 1–3'),
           ('Go live, watched', 'Next, production keys on a quiet day, real transactions end to end, and the logs watched for the first few days of genuine volume.', 'Week 4'),
           ('Alerts &amp; handover', 'Last, failure alerts point at your inbox, not only ours. You get the keys, the logs, the map of what talks to what, and 30 days of fixes.', 'Week 5')],
    weights=[3, 15, 5, 5],
    q_h='The ones worth asking first.',
    qs=[('Do we need the official WhatsApp Business API?', 'Only if your system needs to send messages on its own. If a person types every message, the free WhatsApp Business app is enough and we will say so rather than sell you an integration. The API is for order confirmations, reminders and status updates at volume, from a verified number, using templates Meta approves in advance. Meta charges per conversation and bills you directly, and template approval takes a few days — both are built into the quote and the schedule.'),
        ('What happens when a payment succeeds but our site does not update?', 'That is the exact failure the design prevents. The gateway is the source of truth: we verify its signed callback and set the order from that, never from the browser the customer closed too early. Handlers are idempotent, so a repeated callback cannot create a second order or a second charge. If a callback never arrives at all, a daily reconciliation job compares the gateway’s settlement report against your orders and flags every difference by name and amount.'),
        ('Can you connect to Tally? It runs on a PC in our office.', 'Usually yes, with a caveat worth saying before you pay anything. Tally Prime speaks XML over a local port on the machine it runs on, so a sync needs that machine switched on and reachable — either a connector service inside your network that pushes out, or a fixed link in. Zoho Books and most cloud ERPs are simpler because they have real APIs and are always on. We work out which category you fall into in the first conversation, and the quote says plainly what is required from your side.'),
        ('What if a third-party API changes or breaks?', 'Providers do change things, sometimes with short notice. Every integration logs its requests and responses, so when something shifts we can see exactly what came back instead of guessing from a blank screen. The first 30 days of fixes are included. After that most clients keep a small monthly retainer for upkeep, or simply call us when something breaks — either is fine. The code, the keys and the documentation are yours, so another developer can pick it up without starting over.')],
    close_h='Tell us which two systems disagree.',
    close_p='Send a short list of the tools you run and where the retyping happens. We will reply with what can be connected, what genuinely cannot, and a fixed price for the piece worth doing first.',
    close2=('mailto:planorahtechnologies@gmail.com', 'Email us instead'),
  ),
]
