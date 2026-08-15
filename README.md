# Planorah Technologies — website

Static multi-page site. No build step, no dependencies, no npm. Every page is plain HTML
sharing one stylesheet and one script.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

You can also just double-click `index.html` — all links are relative, so it works from the
filesystem too.

## Deploy

Upload the whole folder to any static host. Nothing needs compiling.

| Host | How |
|---|---|
| Netlify | Drag the folder onto the Netlify dashboard |
| Vercel | `vercel deploy` in this folder, or connect the repo |
| Cloudflare Pages | Connect the repo, leave the build command empty, output dir `/` |
| cPanel / shared hosting | Upload the folder contents into `public_html` |
| Amazon S3 | Sync the folder, enable static website hosting |

Point the host's 404 handler at `404.html`.

## Change your contact details in one place

Both the WhatsApp number and the email live at the top of `assets/planorah.js`:

```js
var PLANORAH = {
  whatsapp : "916284219729",                    // country code + number, digits only
  email    : "planorahtechnologies@gmail.com",
  company  : "Planorah Technologies"
};
```

Editing `whatsapp` updates every WhatsApp link, the floating chat button, and the number
printed in the footer and contact block automatically.

Note: `mailto:` links and the `tel:` link in the footer are written directly into each page's
HTML, so if you change the email or phone number, search and replace across the `.html` files
as well.

## Layout

```
index.html            Home — 3D device constellation hero
services/index.html   Services hub
services/*.html       Six service detail pages
work.html             Case studies
process.html          How a project runs, step by step
about.html            The studio
contact.html          Enquiry form → WhatsApp, plus Google/Maps card
faq.html              Pricing, timelines, handover, after launch
privacy.html          Privacy policy
terms.html            Terms of service
404.html              Not found
robots.txt            Crawler rules
sitemap.xml           Update the domain here if it is not planorah.com

assets/
  planorah.css        Every style on the site
  planorah.js         Config, nav, 3D hero, form, accordion
  favicon.svg         Logo mark
```

## The 3D hero

`assets/planorah.js` builds the hero constellation with three.js (loaded from a CDN on
`index.html` only). Every screen Planorah ships to — TV, monitor, tablet, phone, watch —
orbits the Planorah mark, wired to it with connector lines that carry travelling pulses.

Devices are defined in the `SCREENS` array. Each entry is width, height, depth, corner
radius, bezel, shell colour, screen colour, position, rotation, and optionally a stand or a
strap. Add or remove a screen by editing that array — the connectors and pulses are generated
from it automatically.

If WebGL is unavailable the hero falls back to the blurred colour orbs in `.fallback`, and if
the visitor has reduced motion enabled all animation stops after the first frame.

## Editing content

Every page is hand-editable HTML. The shared design system lives in `assets/planorah.css` —
use the existing classes rather than adding new ones, and pass an accent to a component with
`style="--ac:#6248F5"`.

Available accents: `#6248F5` violet · `#FF6B3D` coral · `#0FB981` mint · `#2F7CF6` sky ·
`#FFC53D` sun.

## Before going live

- [ ] Replace `https://planorah.com/` in `sitemap.xml` and each page's `<link rel="canonical">` if the domain differs
- [ ] Set the real Google Place ID in the "Write a review" link on `contact.html`
- [ ] Confirm the Google Maps embed on `contact.html` points at the real Business Profile
- [ ] Verify the WhatsApp number receives the formatted enquiry message
- [ ] **Replace the six case studies on `work.html`** — they are illustrative, written before real projects were supplied
- [ ] **Check `12` projects shipped on `work.html`** and `2–5` team size on `about.html` against reality
- [ ] Review pricing ranges on the six service pages before quoting from them

## Analytics

Google Analytics 4 (`G-6SPV5MMPMT`) is installed in the `<head>` of every page. `privacy.html`
documents it, including the cookie it sets. If you remove or change the tag, update that page
to match — a privacy policy that describes tracking you do not run, or omits tracking you do,
is the kind of error that matters.

There is currently no cookie consent banner. Analytics cookies are generally acceptable under
India's DPDP Act on a notice basis, but if you start taking EU traffic seriously you will want
consent before the tag fires.

## Regenerating pages

`.build/` holds the page skeletons (`skeleton-root`, `skeleton-sub`), the shared nav/footer
partials, and two scripts: `check.py` validates every page's links, duplicate ids, classes and
structure; `dedupe.py` is a one-off repair kept for reference. Run the checker after any edit:

```bash
python3 .build/check.py
```
# PlanorahTechnologies
