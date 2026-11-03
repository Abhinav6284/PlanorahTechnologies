# Planorah Technologies — website

Static multi-page site. The published pages are plain HTML sharing one stylesheet and one
script; nothing needs compiling to deploy. The design is taken from the Planorah visiting card:
black, orange light through fluted glass, the geometric wordmark, the P, and condensed capitals.

## Run it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

You can also double-click `index.html` — all links are relative.

## Edit, then rebuild

The pages are generated from sources in `.build/` so the header, footer, picture credits and the
glass light stay identical everywhere. Edit the source, not the built page:

| To change | Edit |
|---|---|
| A page's content (home, work, process, about, contact, FAQ, 404, privacy, terms, services hub) | `.build/pages/<name>.html` |
| The six service pages | the data in `.build/services.py` (one template, six entries) |
| Header, footer, fonts, address, Instagram, domain | `.build/build.py` (`ADDRESS`, `INSTAGRAM`, `EMAIL`, `SITE` at the top) |
| Every style | `assets/planorah.css` |

Then rebuild and check:

```bash
python3 .build/build.py   # writes every .html page
python3 .build/check.py   # links, duplicate ids, unknown classes, scripts, form ids
```

In a page source, `{R}` becomes the path back to the site root, and `{WA}`, `{ARROW}`,
`{EMAIL}`, `{ADDRESS}` and `{INSTAGRAM}` are filled in by the build.

## WhatsApp number and email

The WhatsApp number used by every WhatsApp link, the form and the floating button lives at the top
of `assets/planorah.js`:

```js
var PLANORAH = {
  whatsapp : "916284219729",                    // country code + number, digits only
  email    : "planorahtechnologies@gmail.com",
  company  : "Planorah Technologies"
};
```

The `tel:` link and the number printed in the page sources are written into `.build/pages/` and
`.build/build.py` — search and replace there if the number changes, then rebuild.

## The light and the 3D device

- **Fluted glass** (`glassAll` in `assets/planorah.js`): a small WebGL shader that draws orange and
  red light refracted through vertical glass flutes, drifting slowly and following the pointer. It
  sits behind the home hero, the services list, the live device, the contact section, and every
  inner page's opening and closing sections (`<canvas class="glass" data-glass="left|right">`).
  Without WebGL the same light is drawn in CSS (`.no-gl .glassy`).
- **Your name on every screen** (home page, `.wave` in `assets/planorah.js`): a pinned section where the
  scroll plays an example WhatsApp conversation with Planorah (website → phone → tablet → TV → watch). Beside
  it one device takes the shape of each screen and its screen is built top to bottom over a blueprint grid.
  The chat's compose bar is the business-name box; its send button opens WhatsApp with the message written.

Both pause when off screen. Scrolling is smoothed with Lenis (loaded from jsDelivr). Motion stays on even
when a visitor's device asks for reduced motion; set `respectReducedMotion: true` in `PLANORAH` at the top
of `assets/planorah.js` to switch it off for those visitors instead.

## Pictures

All photographs are real pictures from Wikimedia Commons, downloaded into `assets/img/` with their
licences in `assets/img/credits.json`. The build prints a credit line for each picture in the footer
of the page that uses it. They show Ludhiana, Punjab and the history of screens — never a client's
project — so swap in your own project photographs when you have them.

## Deploy

Upload the whole folder (the `.build/` and `.taste-skill/` folders are not needed on the server).

| Host | How |
|---|---|
| Netlify | Drag the folder onto the Netlify dashboard |
| Vercel | `vercel deploy` in this folder, or connect the repo |
| Cloudflare Pages | Connect the repo, leave the build command empty, output dir `/` |
| cPanel / shared hosting | Upload the folder contents into `public_html` |

Point the host's 404 handler at `404.html`.

## Before going live

- [ ] Confirm the phone number: the card says +91 77102 23342, the site uses +91 62842 19729 for WhatsApp
- [ ] Set the real Google Place ID in the "Write a review" link on `contact.html`
- [ ] **Replace the six case studies on `work.html`** — they are illustrative, written before real projects were supplied
- [ ] **Check `12` projects shipped** and `2–5` team size against reality
- [ ] Review pricing ranges on the six service pages before quoting from them

## Analytics

Google Analytics 4 (`G-6SPV5MMPMT`) is in the `<head>` of every page, written by `.build/build.py`.
`privacy.html` documents it. If you remove or change the tag, update that page to match.
