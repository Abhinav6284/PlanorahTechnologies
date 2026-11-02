/* ══════════════════════════════════════════════
   EDIT THIS — your WhatsApp number and email
   ══════════════════════════════════════════════ */
var PLANORAH = {
  whatsapp : "916284219729",         // country code + number, digits only
  email    : "planorahtechnologies@gmail.com",
  company  : "Planorah Technologies",
  /* true = switch motion off for visitors whose device asks for reduced motion */
  respectReducedMotion : false
};

(function(){
  'use strict';
  var doc = document.documentElement;
  doc.classList.add('js');
  var reduce = PLANORAH.respectReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) doc.classList.add('motion');

  /* ── Header turns solid once the page scrolls ── */
  var hd = document.getElementById('hd');
  function stick(){ if (hd) hd.classList.toggle('stuck', window.scrollY > 24); }
  stick(); window.addEventListener('scroll', stick, {passive:true});

  /* ── Mobile menu ── */
  (function(){
    var btn = document.getElementById('burger'), panel = document.getElementById('mob');
    if (!btn || !panel) return;
    function set(open){
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function(){ set(!panel.classList.contains('open')); });
    panel.addEventListener('click', function(e){ if (e.target.tagName === 'A') set(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') set(false); });
  })();

  /* ── Mark the current page in the navigation ── */
  (function(){
    var here = location.pathname.replace(/index\.html$/, '');
    document.querySelectorAll('.hd-nav a, .mob a').forEach(function(a){
      var p = new URL(a.href, location.href).pathname.replace(/index\.html$/, '');
      if (p !== '/' && here.indexOf(p) === 0 && p.length > 1) a.setAttribute('aria-current', 'page');
    });
  })();

  /* ── Entrances: the parts of each section rise in, staggered ── */
  (function(){
    var groups = document.querySelectorAll('[data-in-group]');
    groups.forEach(function(g){
      g.querySelectorAll('[data-in]').forEach(function(el, i){ el.style.setProperty('--i', i); });
      g.querySelectorAll('.bar-seg').forEach(function(el, i){ el.style.setProperty('--i', i); });
    });
    if (!('IntersectionObserver' in window) || reduce){
      groups.forEach(function(g){ g.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function(en){
      en.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, {rootMargin: '0px 0px -12% 0px', threshold: 0.01});
    groups.forEach(function(g){ io.observe(g); });
    /* never leave content hidden: anything still waiting after 2.5s is shown */
    setTimeout(function(){
      groups.forEach(function(g){
        if (g.getBoundingClientRect().top < innerHeight) g.classList.add('is-in');
      });
    }, 2500);
  })();

  /* ══ WhatsApp enquiry system ══ */
  var waBase = 'https://wa.me/' + PLANORAH.whatsapp;
  var pretty = '+' + PLANORAH.whatsapp.replace(/^(\d{2})(\d{5})(\d{5})$/, '$1 $2 $3');

  document.querySelectorAll('[data-wa-num]').forEach(function(s){ s.textContent = pretty; });
  document.querySelectorAll('[data-wa-link]').forEach(function(a){
    a.href = waBase + '?text=' + encodeURIComponent('Hello ' + PLANORAH.company + ', I would like to discuss a project.');
    a.target = '_blank'; a.rel = 'noopener';
  });
  var fab = document.getElementById('fab');
  if (fab){
    fab.href = waBase + '?text=' + encodeURIComponent('Hello ' + PLANORAH.company + ', I have an enquiry.');
    fab.target = '_blank'; fab.rel = 'noopener';
  }
  document.querySelectorAll('[data-wa-mail]').forEach(function(a){
    a.href = 'mailto:' + PLANORAH.email;
    if (!a.textContent.trim()) a.textContent = PLANORAH.email;
  });

  function val(id){ var el = document.getElementById(id); return el ? (el.value || '').trim() : ''; }
  function flag(fid, bad){ var f = document.getElementById(fid); if (f) f.classList.toggle('err', bad); return bad; }

  var sendBtn = document.getElementById('send');
  if (sendBtn) sendBtn.addEventListener('click', function(){
    var name = val('i-name'), phone = val('i-phone'), service = val('i-service'),
        budget = val('i-budget'), msg = val('i-msg'), bad = false;

    bad = flag('f-name', name.length < 2) || bad;
    bad = flag('f-phone', phone.replace(/\D/g,'').length < 8) || bad;
    bad = flag('f-service', !service) || bad;
    bad = flag('f-msg', msg.length < 10) || bad;
    if (bad){
      var first = document.querySelector('.field.err input, .field.err select, .field.err textarea');
      if (first){ first.focus(); first.scrollIntoView({block:'center', behavior: reduce ? 'auto' : 'smooth'}); }
      return;
    }
    var lines = ['*New enquiry — ' + PLANORAH.company + ' website*','',
      '*Name:* ' + name, '*Phone:* ' + phone, '*Service:* ' + service];
    if (budget) lines.push('*Budget:* ' + budget);
    var page = document.body.getAttribute('data-page');
    if (page) lines.push('*Page:* ' + page);
    lines.push('', '*Requirement:*', msg, '', '_Sent from planorah.com_');

    window.open(waBase + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    var ok = document.getElementById('ok');
    if (ok) ok.classList.add('show');
  });

  ['i-name','i-phone','i-service','i-msg'].forEach(function(id){
    var el = document.getElementById(id);
    if (!el) return;
    var clear = function(){ el.closest('.field').classList.remove('err'); };
    el.addEventListener('input', clear);
    el.addEventListener('change', clear);
  });

  /* A service page links here with ?service=... — preselect it so nobody re-picks */
  (function(){
    var want = new URLSearchParams(location.search).get('service');
    var sel = document.getElementById('i-service');
    if (!want || !sel) return;
    Array.prototype.forEach.call(sel.options, function(o){
      if (o.value.toLowerCase().indexOf(want.toLowerCase()) === 0 ||
          o.text.toLowerCase().indexOf(want.toLowerCase()) === 0) sel.value = o.value || o.text;
    });
  })();

  document.querySelectorAll('#yr, [data-yr]').forEach(function(el){
    el.textContent = new Date().getFullYear();
  });

  /* ── The time in Ludhiana, in the footer ── */
  (function(){
    var el = document.getElementById('ldh-time');
    if (!el) return;
    var fmt = new Intl.DateTimeFormat('en-IN', {timeZone:'Asia/Kolkata', hour:'numeric', minute:'2-digit', hour12:true});
    var day = new Intl.DateTimeFormat('en-IN', {timeZone:'Asia/Kolkata', weekday:'short', hour:'numeric', hour12:false});
    function tick(){
      el.textContent = fmt.format(new Date());
      var parts = day.formatToParts(new Date()), wd = '', h = 0;
      parts.forEach(function(p){ if (p.type === 'weekday') wd = p.value; if (p.type === 'hour') h = +p.value; });
      var open = wd !== 'Sat' && wd !== 'Sun' && h >= 10 && h < 19;
      var st = document.getElementById('ldh-open');
      if (st) st.textContent = open ? 'In the studio now — replies within the hour' : 'Out of hours — we reply from 10am IST';
    }
    tick(); setInterval(tick, 30000);
  })();


  /* ══════════════════════════════════════════════
     Screens: every device draws the same business
     name, laid out the way it would be built for it.
     ══════════════════════════════════════════════ */
  var OR = '#FF5A0A', BK = '#050505', WH = '#FFFFFF', PA = '#EFEEEA', GR = '#D2D2CE', DK = '#1B1B1B';
  var state = { name: 'Your business', screen: 'desktop' };
  var listeners = [];
  function setName(n){ state.name = (n || '').trim() || 'Your business'; listeners.forEach(function(f){ f(); }); }

  function fitText(ctx, text, weight, maxW, maxPx){
    var px = maxPx;
    ctx.font = weight + ' ' + px + 'px "Inter Tight", sans-serif';
    while (ctx.measureText(text).width > maxW && px > 10){ px -= 2; ctx.font = weight + ' ' + px + 'px "Inter Tight", sans-serif'; }
    return px;
  }
  function box(ctx, x, y, w, h, c){ ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
  function txt(ctx, s, x, y, px, weight, c, align){
    ctx.fillStyle = c; ctx.textAlign = align || 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = (weight || 500) + ' ' + px + 'px "Inter Tight", sans-serif'; ctx.fillText(s, x, y);
  }

  var DRAW = {
    tv: function(ctx, W, H, name){
      box(ctx, 0, 0, W, H, BK);
      txt(ctx, name, 56, 78, fitText(ctx, name, 900, W * .34, 40), 900, WH);
      ['Home', 'Live', 'My list', 'Search'].forEach(function(s, i){ txt(ctx, s, W * .5 + i * 150, 76, 26, 500, i ? '#9A9A97' : WH); });
      box(ctx, 56, 120, W - 112, H * .42, OR);
      txt(ctx, 'Tonight on', 96, 210, 30, 500, BK);
      var px = fitText(ctx, name, 900, W * .62, 96);
      txt(ctx, name, 92, 210 + px * .95, px, 900, BK);
      box(ctx, 96, 120 + H * .42 - 104, 190, 64, BK); txt(ctx, 'Play', 136, 120 + H * .42 - 60, 30, 900, WH);
      txt(ctx, 'Continue watching', 56, H * .42 + 196, 26, 500, WH);
      for (var i = 0; i < 5; i++){
        var x = 56 + i * ((W - 112) / 5), w = (W - 112) / 5 - 18;
        box(ctx, x, H * .42 + 220, w, H * .2, i === 0 ? WH : DK);
        if (i === 0){ box(ctx, x + 10, H * .42 + 230, w - 20, H * .2 - 20, OR); }
        txt(ctx, 'Episode ' + (i + 4), x, H * .42 + 220 + H * .2 + 36, 22, 500, '#9A9A97');
      }
    },
    desktop: function(ctx, W, H, name){
      box(ctx, 0, 0, W, H, WH);
      txt(ctx, name, 48, 64, fitText(ctx, name, 900, W * .3, 30), 900, BK);
      ['Shop', 'Stores', 'About'].forEach(function(s, i){ txt(ctx, s, W * .52 + i * 110, 62, 22, 500, BK); });
      box(ctx, W - 200, 30, 152, 48, OR); txt(ctx, 'Order now', W - 124, 62, 20, 500, BK, 'center');
      var px = fitText(ctx, name, 900, W * .56, 120);
      txt(ctx, name, 44, 150 + px * .9, px, 900, BK);
      txt(ctx, 'Order online, pick up in store.', 48, 150 + px * .9 + 60, 26, 500, BK);
      box(ctx, 48, 150 + px * .9 + 100, 220, 60, BK); txt(ctx, 'Browse the range', 158, 150 + px * .9 + 139, 20, 500, WH, 'center');
      var gx = W * .64, gy = 120, gw = (W - gx - 48 - 12) / 2, gh = (H - gy - 48 - 12) / 2;
      box(ctx, gx, gy, gw, gh, OR); box(ctx, gx + gw + 12, gy, gw, gh, BK);
      box(ctx, gx, gy + gh + 12, gw, gh, BK); box(ctx, gx + gw + 12, gy + gh + 12, gw, gh, PA);
      txt(ctx, 'Kitchen', gx + 18, gy + gh - 20, 22, 900, BK); txt(ctx, 'Home', gx + gw + 30, gy + gh - 20, 22, 900, WH);
      txt(ctx, 'Outdoor', gx + 18, gy + 2 * gh - 8, 22, 900, WH); txt(ctx, 'Lighting', gx + gw + 30, gy + 2 * gh - 8, 22, 900, BK);
      box(ctx, 0, H - 56, W, 56, PA); txt(ctx, 'Performance 98 · loads in 1.1s on 4G', 48, H - 20, 20, 500, BK);
    },
    tablet: function(ctx, W, H, name){
      box(ctx, 0, 0, W, H, PA);
      box(ctx, 0, 0, W, 110, BK);
      txt(ctx, name, 40, 70, fitText(ctx, name, 900, W * .62, 38), 900, WH);
      txt(ctx, 'Sales', W - 40, 68, 24, 500, OR, 'right');
      var tw = (W - 80 - 24) / 3;
      [['24', 'New leads', OR, BK], ['11', 'Quoted', BK, WH], ['₹4.2L', 'Won', WH, BK]].forEach(function(t, i){
        var x = 40 + i * (tw + 12);
        box(ctx, x, 140, tw, 170, t[2]); txt(ctx, t[0], x + 18, 220, 52, 900, t[3]); txt(ctx, t[1], x + 18, 286, 20, 500, t[3]);
      });
      txt(ctx, 'Won value, last six months', 40, 370, 22, 500, BK);
      [38, 56, 44, 72, 61, 88].forEach(function(v, i){
        var bw = (W - 80) / 6 - 12, bh = 260 * v / 100;
        box(ctx, 40 + i * (bw + 12), 660 - bh, bw, bh, i === 5 ? OR : BK);
      });
      [['Verma Clinics', 'Won', '₹1,80,000'], ['Singh Logistics', 'Quoted', '₹95,000'], ['Kapoor Institute', 'New', '₹1,45,000'], ['Gill Foods', 'Won', '₹2,10,000']].forEach(function(r, i){
        var y = 700 + i * 76;
        box(ctx, 40, y, W - 80, 64, i % 2 ? PA : WH);
        txt(ctx, r[0], 60, y + 41, 22, 500, BK); txt(ctx, r[1], W * .58, y + 41, 22, 500, r[1] === 'Won' ? OR : BK); txt(ctx, r[2], W - 60, y + 41, 22, 900, BK, 'right');
      });
    },
    phone: function(ctx, W, H, name){
      box(ctx, 0, 0, W, H, WH);
      txt(ctx, '9:41', 44, 62, 26, 500, BK); txt(ctx, '5G', W - 44, 62, 24, 500, BK, 'right');
      txt(ctx, name, 40, 170, fitText(ctx, name, 900, W - 80, 62), 900, BK);
      txt(ctx, 'Your orders · 2 active', 40, 214, 24, 500, BK);
      box(ctx, 40, 250, W - 80, 260, OR);
      txt(ctx, 'Order #4821', 68, 310, 28, 900, BK);
      txt(ctx, 'Out for delivery', 68, 352, 24, 500, BK);
      txt(ctx, 'Arriving today, 6–8 pm', 68, 392, 24, 500, BK);
      for (var i = 0; i < 4; i++) box(ctx, 68 + i * ((W - 136) / 4), 440, (W - 136) / 4 - 10, 14, i < 3 ? BK : WH);
      [['Order #4790', '₹2,340'], ['Order #4772', '₹890'], ['Order #4751', '₹1,120'], ['Order #4730', '₹560']].forEach(function(r, i){
        var y = 540 + i * 112;
        box(ctx, 40, y, W - 80, 96, PA);
        box(ctx, 60, y + 20, 56, 56, i % 2 ? BK : OR);
        txt(ctx, r[0], 136, y + 58, 26, 500, BK); txt(ctx, r[1], W - 64, y + 58, 26, 900, BK, 'right');
      });
      box(ctx, 0, H - 120, W, 120, BK);
      for (var j = 0; j < 4; j++) box(ctx, 60 + j * ((W - 120) / 4) + 28, H - 76, 36, 36, j ? '#5A5A57' : OR);
    },
    watch: function(ctx, W, H, name){
      box(ctx, 0, 0, W, H, BK);
      var d = new Date();
      var t = new Intl.DateTimeFormat('en-IN', {timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit', hour12:false}).format(d);
      txt(ctx, t, W / 2, 150, 120, 900, WH, 'center');
      txt(ctx, name, W / 2, 230, fitText(ctx, name, 900, W - 80, 46), 900, OR, 'center');
      box(ctx, 40, 290, W - 80, 220, DK);
      txt(ctx, 'New order', 70, 350, 30, 500, WH);
      txt(ctx, '₹2,340', 70, 420, 64, 900, WH);
      box(ctx, 70, 448, W - 140, 40, OR); txt(ctx, 'Accept', W / 2, 477, 24, 900, BK, 'center');
    }
  };

  var SPECS = {
    tv:      { label: 'TV',      w: 3.2,  h: 1.85, d: .08, r: .05, bez: .05, tex: [1600, 925], stand: 'feet' },
    desktop: { label: 'Desktop', w: 2.5,  h: 1.56, d: .1,  r: .07, bez: .07, tex: [1280, 800], stand: 'neck' },
    tablet:  { label: 'Tablet',  w: 1.16, h: 1.56, d: .07, r: .09, bez: .07, tex: [820, 1140] },
    phone:   { label: 'Phone',   w: .64,  h: 1.32, d: .075, r: .1, bez: .03, tex: [640, 1380] },
    watch:   { label: 'Watch',   w: .54,  h: .64, d: .14, r: .14, bez: .05, tex: [500, 600], strap: true }
  };

  function makeCanvas(kind){
    var c = document.createElement('canvas');
    c.width = SPECS[kind].tex[0]; c.height = SPECS[kind].tex[1];
    return c;
  }
  function paint(c, kind){ var ctx = c.getContext('2d'); ctx.clearRect(0, 0, c.width, c.height); DRAW[kind](ctx, c.width, c.height, state.name); }

  /* ── Live control: the visitor's name and screen ── */
  (function(){
    var input = document.getElementById('live-name');
    var word = document.getElementById('live-word');
    var send = document.getElementById('live-send');
    var segs = document.querySelectorAll('.seg button');
    if (!input) return;
    var words = { tv: 'on a TV', desktop: 'as a website', tablet: 'on a tablet', phone: 'on a phone', watch: 'on a watch' };
    var asks = { tv: 'a TV app', desktop: 'a website', tablet: 'a tablet system', phone: 'a mobile app', watch: 'a watch app' };
    function updateSend(){
      if (!send) return;
      var who = state.name === 'Your business' ? 'my business' : state.name;
      send.href = waBase + '?text=' + encodeURIComponent('Hello ' + PLANORAH.company + ', I would like ' + asks[state.screen] + ' for ' + who + '. Can we talk?');
      send.target = '_blank'; send.rel = 'noopener';
    }
    var outs = document.querySelectorAll('[data-live-name]');
    input.addEventListener('input', function(){
      setName(input.value); updateSend();
      outs.forEach(function(o){ o.textContent = state.name; });
    });
    segs.forEach(function(b){
      b.addEventListener('click', function(){
        segs.forEach(function(o){ o.setAttribute('aria-checked', o === b ? 'true' : 'false'); o.tabIndex = o === b ? 0 : -1; });
        state.screen = b.getAttribute('data-screen');
        if (word && word.textContent !== words[state.screen] + '.'){
          word.classList.add('swap');
          setTimeout(function(){ word.textContent = words[state.screen] + '.'; word.classList.remove('swap'); }, reduce ? 0 : 220);
        }
        listeners.forEach(function(f){ f(); });
        updateSend();
      });
      b.addEventListener('keydown', function(e){
        var list = Array.prototype.slice.call(segs), i = list.indexOf(b), n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = list[(i + 1) % list.length];
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = list[(i - 1 + list.length) % list.length];
        if (n){ e.preventDefault(); n.focus(); n.click(); }
      });
    });
    updateSend();
  })();

  /* ── Flat fallback: the screens drawn in 2D when WebGL is missing ── */
  function flat(canvasEl, kinds){
    var ctx = canvasEl.getContext('2d');
    function draw(){
      var r = canvasEl.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      canvasEl.width = r.width * dpr; canvasEl.height = r.height * dpr;
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      var list = kinds(), n = list.length, gap = 16 * dpr, total = 0;
      list.forEach(function(k){ total += SPECS[k].w; });
      var scale = Math.min((canvasEl.width - gap * (n + 1)) / total, canvasEl.height * .8 / 1.85);
      var x = gap;
      list.forEach(function(k){
        var s = SPECS[k], w = s.w * scale, h = s.h * scale, y = (canvasEl.height - h) / 2;
        ctx.fillStyle = BK; ctx.fillRect(x, y, w, h);
        var c = makeCanvas(k); paint(c, k);
        var b = s.bez * scale; ctx.drawImage(c, x + b, y + b, w - 2 * b, h - 2 * b);
        x += w + gap;
      });
    }
    draw(); listeners.push(draw); window.addEventListener('resize', draw);
  }

  /* ══ three.js: devices built from rounded slabs ══ */
  function hasGL(){
    try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); }
    catch(e){ return false; }
  }

  function buildDevice(THREE, kind, shellHex){
    var s = SPECS[kind], g = new THREE.Group();
    function rr(w, h, r){
      var sh = new THREE.Shape(), x = -w / 2, y = -h / 2;
      sh.moveTo(x + r, y); sh.lineTo(x + w - r, y); sh.quadraticCurveTo(x + w, y, x + w, y + r);
      sh.lineTo(x + w, y + h - r); sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      sh.lineTo(x + r, y + h); sh.quadraticCurveTo(x, y + h, x, y + h - r);
      sh.lineTo(x, y + r); sh.quadraticCurveTo(x, y, x + r, y);
      return sh;
    }
    var shellCol = new THREE.Color(shellHex); if (shellCol.convertSRGBToLinear) shellCol.convertSRGBToLinear();
    var shellMat = new THREE.MeshStandardMaterial({ color: shellCol, roughness: .38, metalness: .25 });
    var bodyGeo = new THREE.ExtrudeGeometry(rr(s.w, s.h, s.r), { depth: s.d, bevelEnabled: true, bevelThickness: .012, bevelSize: .012, bevelSegments: 3, curveSegments: 10 });
    bodyGeo.translate(0, 0, -s.d / 2);
    g.add(new THREE.Mesh(bodyGeo, shellMat));

    var sw = s.w - 2 * s.bez, shh = s.h - 2 * s.bez;
    var scrGeo = new THREE.ShapeGeometry(rr(sw, shh, Math.max(.01, s.r - s.bez * .6)), 10);
    var pos = scrGeo.attributes.position, uv = scrGeo.attributes.uv;
    for (var i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + sw / 2) / sw, (pos.getY(i) + shh / 2) / shh);
    var cv = makeCanvas(kind); paint(cv, kind);
    var tex = new THREE.CanvasTexture(cv);
    tex.anisotropy = 4;
    if ('encoding' in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    var scr = new THREE.Mesh(scrGeo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
    scr.position.z = s.d / 2 + .014;
    g.add(scr);

    if (s.stand === 'feet'){
      [-1, 1].forEach(function(dir){
        var leg = new THREE.Mesh(new THREE.BoxGeometry(.05, .28, .05), shellMat);
        leg.position.set(dir * s.w * .36, -s.h / 2 - .1, 0); leg.rotation.z = dir * .35; g.add(leg);
      });
    } else if (s.stand === 'neck'){
      var neck = new THREE.Mesh(new THREE.BoxGeometry(.16, .42, .06), shellMat); neck.position.set(0, -s.h / 2 - .19, -.06); g.add(neck);
      var base = new THREE.Mesh(new THREE.BoxGeometry(.8, .04, .42), shellMat); base.position.set(0, -s.h / 2 - .4, 0); g.add(base);
    }
    if (s.strap){
      [1, -1].forEach(function(dir){
        var st = new THREE.Mesh(new THREE.BoxGeometry(s.w * .74, .5, .06), new THREE.MeshStandardMaterial({ color: 0x1D1D1D, roughness: .8 }));
        st.position.set(0, dir * (s.h / 2 + .24), -.02); g.add(st);
      });
    }
    g.userData = { kind: kind, canvas: cv, tex: tex, spec: s };
    return g;
  }

  function lights(THREE, scene, rim){
    scene.add(new THREE.AmbientLight(0xffffff, .55));
    var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(3, 4, 6); scene.add(key);
    var back = new THREE.DirectionalLight(rim, 2.2); back.position.set(-4, 2, -3); scene.add(back);
    var side = new THREE.PointLight(rim, 1.6, 20); side.position.set(3.5, -1, 2); scene.add(side);
  }

  function makeRenderer(THREE, canvas){
    var r = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    r.setClearColor(0x000000, 0);
    if ('outputEncoding' in r && THREE.sRGBEncoding) r.outputEncoding = THREE.sRGBEncoding;
    return r;
  }

  /* run a render loop only while its canvas is on screen */
  function loop(canvas, frame){
    var on = false, raf = 0;
    function tick(t){ frame(t); if (on) raf = requestAnimationFrame(tick); }
    if (reduce){ requestAnimationFrame(frame); return function(){ requestAnimationFrame(frame); }; }
    new IntersectionObserver(function(en){
      var v = en[0].isIntersecting;
      if (v && !on){ on = true; raf = requestAnimationFrame(tick); }
      if (!v){ on = false; cancelAnimationFrame(raf); }
    }).observe(canvas);
    return function(){ if (!on) requestAnimationFrame(frame); };
  }

  /* ── Hero: five screens float around one name ── */
  function hero(THREE){
    var canvas = document.getElementById('gl');
    if (!canvas) return;
    var stage = canvas.parentElement;
    var renderer = makeRenderer(THREE, canvas);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, .1, 100);
    cam.position.set(0, .2, 8);
    lights(THREE, scene, 0xffffff);
    var rig = new THREE.Group(); scene.add(rig);
    var layout = [
      ['tv',      0,    .55, -1.1,  .0,  -.06],
      ['desktop', -2.25, -.05, -.2,  .32,  .04],
      ['tablet',  2.3,  -.1, -.1, -.34, -.05],
      ['phone',   1.25,  -.82, 1.25, -.18,  .08],
      ['watch',  -1.2,  -.95, 1.5,   .26, -.1]
    ];
    var devs = layout.map(function(l, i){
      var d = buildDevice(THREE, l[0], 0x0B0B0B);
      d.position.set(l[1], l[2], l[3]); d.rotation.set(0, l[4], l[5]);
      d.userData.base = { x: l[1], y: l[2], z: l[3], ry: l[4], rz: l[5], ph: i * 1.3 };
      rig.add(d); return d;
    });
    listeners.push(function(){ devs.forEach(function(d){ paint(d.userData.canvas, d.userData.kind); d.userData.tex.needsUpdate = true; }); kick(); });

    var mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', function(e){ tx = (e.clientX / innerWidth - .5); ty = (e.clientY / innerHeight - .5); }, {passive:true});

    function size(){
      var w = stage.clientWidth, h = stage.clientHeight;
      renderer.setSize(w, h, false); cam.aspect = w / h;
      var fit = w / h < 1.4 ? 1.4 / (w / h) : 1;
      cam.position.z = 8 * Math.min(fit, 2.1);
      cam.updateProjectionMatrix(); kick();
    }
    var kick = loop(canvas, function(t){
      t = (t || 0) / 1000;
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      var sc = Math.min(1, Math.max(0, window.scrollY / (innerHeight * .9)));
      rig.rotation.y = mx * .35 + (reduce ? 0 : Math.sin(t * .25) * .06);
      rig.rotation.x = my * .18 + sc * .25;
      devs.forEach(function(d){
        var b = d.userData.base, bob = reduce ? 0 : Math.sin(t * .9 + b.ph) * .06;
        d.position.set(b.x * (1 + sc * .35), b.y + bob - sc * .4, b.z + sc * .6);
        d.rotation.y = b.ry + (reduce ? 0 : Math.sin(t * .5 + b.ph) * .05);
      });
      renderer.render(scene, cam);
    });
    size(); window.addEventListener('resize', size);
  }

  /* ── Live: one device that turns into whichever screen is chosen ── */
  function live(THREE){
    var canvas = document.getElementById('gl2');
    if (!canvas) return;
    var holder = canvas.parentElement;
    var renderer = makeRenderer(THREE, canvas);
    var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(28, 1, .1, 100);
    cam.position.set(0, .1, 7);
    lights(THREE, scene, 0xFF5A0A);
    var spin = new THREE.Group(); scene.add(spin);
    var cache = {}, cur = null, morph = 1, from = null;
    var FIT = { tv: 1.0, desktop: 1.15, tablet: 1.3, phone: 1.5, watch: 2.4 };
    function get(k){
      if (!cache[k]){ cache[k] = buildDevice(THREE, k, 0x161616); }
      return cache[k];
    }
    function show(k){
      var next = get(k);
      if (next === cur) return;
      from = cur; cur = next; morph = reduce ? 1 : 0;
      paint(cur.userData.canvas, k); cur.userData.tex.needsUpdate = true;
      spin.add(cur); kick();
    }
    listeners.push(function(){
      if (cur){ paint(cur.userData.canvas, cur.userData.kind); cur.userData.tex.needsUpdate = true; }
      show(state.screen); kick();
    });

    var drag = false, lastX = 0, vel = 0, rot = -.35;
    canvas.addEventListener('pointerdown', function(e){ drag = true; lastX = e.clientX; vel = 0; });
    window.addEventListener('pointerup', function(){ drag = false; });
    window.addEventListener('pointermove', function(e){
      if (!drag) return;
      var dx = e.clientX - lastX; lastX = e.clientX; vel = dx * .01; rot += vel; kick();
    });

    function size(){
      var w = holder.clientWidth, h = holder.clientHeight;
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); kick();
    }
    var kick = loop(canvas, function(t){
      t = (t || 0) / 1000;
      if (!drag){ vel *= .94; rot += vel; if (!reduce) rot += (Math.sin(t * .4) * .35 - .1 - rot) * .01; }
      spin.rotation.y = rot;
      spin.rotation.x = reduce ? 0 : Math.sin(t * .6) * .04;
      if (morph < 1) morph = Math.min(1, morph + .06);
      var e = 1 - Math.pow(1 - morph, 3);
      var portrait = cam.aspect < 1;
      if (cur){
        var s = FIT[cur.userData.kind] * (portrait ? .62 + cam.aspect * .3 : 1);
        cur.scale.setScalar(s * (.6 + .4 * e));
        cur.position.y = (1 - e) * -.6;
        cur.visible = true;
      }
      if (from){
        var fs = FIT[from.userData.kind] * (portrait ? .62 + cam.aspect * .3 : 1);
        from.scale.setScalar(fs * (1 - e * .4));
        from.position.y = e * .8;
        from.visible = e < .5;
        if (e >= 1){ spin.remove(from); from = null; }
      }
      renderer.render(scene, cam);
    });
    show(state.screen);
    size(); window.addEventListener('resize', size);
  }


  /* ══ The light: an orange glow rising from below, with drifting lines ══ */
  function glassAll(){
    var list = Array.prototype.slice.call(document.querySelectorAll('canvas.glass'));
    if (!list.length) return;
    var VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var FS = [
      'precision mediump float;',
      'uniform vec2 r;uniform float t;uniform vec2 mo;uniform float side;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float blob(vec2 q,vec2 c,vec2 s){vec2 d=(q-c)/s;return exp(-dot(d,d));}',
      'void main(){',
      '  vec2 uv=gl_FragCoord.xy/r; float a=r.x/r.y; vec2 q=vec2(uv.x*a,uv.y);',
      '  float sx=mix(1.,-1.,side); float cx=a*.5;',
      '  vec3 c=vec3(0.);',
      '  c+=vec3(.78,.12,.04)*blob(q,vec2(cx-sx*a*.24+.08*sin(t*.17),-.06),vec2(a*.26,.42))*1.05;',
      '  c+=vec3(1.,.42,.12)*blob(q,vec2(cx+sx*a*.04+.10*cos(t*.13),-.12),vec2(a*.22,.36))*1.0;',
      '  c+=vec3(.36,.46,.5)*blob(q,vec2(cx+sx*a*.3+.06*sin(t*.11),-.04),vec2(a*.2,.34))*.7;',
      '  c+=vec3(.86,.72,.6)*blob(q,vec2(cx+sx*a*.46,-.1),vec2(a*.12,.22))*.55;',
      '  c+=vec3(1.,.4,.1)*blob(q,vec2(mo.x*a,mo.y),vec2(.22,.22))*.18;',
      '  float L=0.;',
      '  for(int i=0;i<7;i++){',
      '    float fi=float(i);',
      '    float y=.30+fi*.018+.07*sin(uv.x*2.6+t*.22+fi*.55)+.03*sin(uv.x*7.1-t*.31+fi*1.3);',
      '    float d=abs(uv.y-y)*r.y;',
      '    L+=(.9/(1.+d*d*.9))*smoothstep(.0,.55,uv.x)*smoothstep(1.,.7,uv.x);',
      '  }',
      '  c+=vec3(1.,.62,.4)*L*.16;',
      '  c+=(h(gl_FragCoord.xy+fract(t))-.5)*.03;',
      '  gl_FragColor=vec4(c,1.);}'
    ].join('\n');
    list.forEach(function(cv, idx){
      var gl = cv.getContext('webgl', { antialias: false, alpha: false, preserveDrawingBuffer: false });
      if (!gl){ doc.classList.add('no-gl'); return; }
      function sh(type, src){ var o = gl.createShader(type); gl.shaderSource(o, src); gl.compileShader(o); return o; }
      var pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)){ doc.classList.add('no-gl'); return; }
      gl.useProgram(pr);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      var uR = gl.getUniformLocation(pr, 'r'), uT = gl.getUniformLocation(pr, 't'), uM = gl.getUniformLocation(pr, 'mo'), uS = gl.getUniformLocation(pr, 'side');
      var side = cv.getAttribute('data-glass') === 'right' ? 1 : 0;
      var host = cv.parentElement, mx = .5, my = .2, tx = mx, ty = my, scale = .5;
      host.addEventListener('pointermove', function(e){
        var b = cv.getBoundingClientRect(); tx = (e.clientX - b.left) / b.width; ty = 1 - (e.clientY - b.top) / b.height;
      }, {passive:true});
      function size(){
        var w = cv.clientWidth, hh = cv.clientHeight, d = Math.min(1.25, window.devicePixelRatio || 1) * scale;
        cv.width = Math.max(2, Math.round(w * d)); cv.height = Math.max(2, Math.round(hh * d));
        gl.viewport(0, 0, cv.width, cv.height);
      }
      var t0 = performance.now() - idx * 4000;
      function frame(now){
        mx += (tx - mx) * .04; my += (ty - my) * .04;
        gl.uniform2f(uR, cv.width, cv.height);
        gl.uniform1f(uT, reduce ? 8 : ((now || 0) - t0) / 1000 + 6);
        gl.uniform2f(uM, mx, my); gl.uniform1f(uS, side);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      size(); window.addEventListener('resize', function(){ size(); frame(performance.now()); });
      loop(cv, frame);
    });
  }

  function start3D(){
    var hasStage = document.getElementById('gl') || document.getElementById('gl2');
    if (!hasStage) return;
    if (!window.THREE || !hasGL()){
      var g = document.getElementById('gl'), g2 = document.getElementById('gl2');
      if (g) flat(g, function(){ return ['desktop', 'tv', 'tablet', 'phone', 'watch']; });
      if (g2) flat(g2, function(){ return [state.screen]; });
      return;
    }
    live(window.THREE);
  }
  /* repaint the screens once Inter Tight has loaded, so canvas text uses it */
  if (document.fonts && document.fonts.ready){
    document.fonts.load('700 40px "Inter Tight"').then(function(){ listeners.forEach(function(f){ f(); }); });
  }
  /* ══ Smooth scrolling ══ */
  var lenis = null;
  if (!reduce && window.Lenis){
    lenis = new window.Lenis({ lerp: .075, smoothWheel: true, wheelMultiplier: .9, touchMultiplier: 1.2 });
    lenis.on('scroll', stick);
    (function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: id === '#main' ? 0 : -90, duration: 1.6, easing: function(t){ return 1 - Math.pow(1 - t, 4); } });
      history.replaceState(null, '', id);
    });
  }
  function onScroll(f){ if (lenis) lenis.on('scroll', f); else window.addEventListener('scroll', f, {passive:true}); f(); }
  function scrollToY(y){ if (lenis) lenis.scrollTo(y, { duration: 1.4, easing: function(t){ return 1 - Math.pow(1 - t, 4); } }); else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); }

  /* ══ Your name on every screen: wave lines driven by the scroll ══ */
  (function(){
    var sec = document.querySelector('.wave'), cv = sec && sec.querySelector('.waves');
    if (!cv) return;
    var ctx = cv.getContext('2d'), segs = Array.prototype.slice.call(sec.querySelectorAll('.seg button'));
    var bar = sec.querySelector('.wave-bar'), idx = 0, prog = 0, sp = 0, w = 0, h = 0, dpr = 1;
    /* one wave shape per screen: amplitude, frequency, twist, spread */
    var SHAPES = [[.10, 1.2, 2.2, .20], [.16, 2.1, 3.4, .12], [.08, 1.6, 1.4, .28], [.13, .8, 4.2, .34], [.18, 2.8, 2.6, .10]];
    var cur = SHAPES[0].slice(), mx = .5, tmx = .5;
    function size(){
      dpr = Math.min(1.25, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    }
    function draw(t){
      var tg = SHAPES[idx];
      for (var k = 0; k < 4; k++) cur[k] += (tg[k] - cur[k]) * (reduce ? 1 : .05);
      mx += (tmx - mx) * .05;
      sp += (prog - sp) * (reduce ? 1 : .08);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      var N = 46, step = Math.max(8, w / 120), ph = (reduce ? 0 : t * .00018) + sp * 6;
      for (var i = 0; i < N; i++){
        var f = i / (N - 1);
        ctx.beginPath();
        for (var x = -step; x <= w + step; x += step){
          var u = x / w, env = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), .8);
          var y = h * (.62 + (mx - .5) * .06)
            + Math.sin(u * cur[1] * 6.283 + ph + f * cur[2]) * cur[0] * h
            + Math.sin(u * cur[1] * 3.1 - ph * 1.3 + f * 1.7) * cur[0] * .45 * h
            + (f - .5) * cur[3] * h * env;
          if (x < 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var a = .08 + .5 * Math.pow(1 - Math.abs(f - .5) * 2, 2);
        ctx.strokeStyle = f < .5 ? 'rgba(255,' + Math.round(90 + 120 * f) + ',' + Math.round(20 + 60 * f) + ',' + a + ')' : 'rgba(255,' + Math.round(150 + 100 * (f - .5)) + ',' + Math.round(80 + 170 * (f - .5)) + ',' + a + ')';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    var auto = false;
    function update(){
      var r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
      prog = Math.min(1, Math.max(0, -r.top / span));
      if (bar) bar.style.setProperty('--p', prog.toFixed(3));
      var n = Math.min(segs.length - 1, Math.floor(prog * segs.length * .999));
      if (n !== idx){ idx = n; auto = true; segs[n].click(); auto = false; }
      if (reduce) draw(0);
    }
    segs.forEach(function(b, i){
      b.addEventListener('click', function(){
        idx = i;
        if (auto) return;
        var top = sec.getBoundingClientRect().top + window.scrollY, span = sec.offsetHeight - innerHeight;
        scrollToY(top + span * (i + .5) / segs.length);
      });
    });
    sec.addEventListener('pointermove', function(e){ tmx = e.clientX / innerWidth; }, {passive:true});
    size(); window.addEventListener('resize', function(){ size(); draw(performance.now()); });
    onScroll(update);
    if (reduce){ draw(0); return; }
    var on = false;
    new IntersectionObserver(function(en){ on = en[0].isIntersecting; if (on) requestAnimationFrame(tick); }).observe(sec);
    function tick(t){ draw(t); if (on) requestAnimationFrame(tick); }
  })();

  /* ══ Tabs (services) and the dock (industries) ══ */
  (function(){
    document.querySelectorAll('[role="tablist"]').forEach(function(list){
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      function pick(t, focus){
        tabs.forEach(function(o){
          var on = o === t;
          o.setAttribute('aria-selected', on ? 'true' : 'false'); o.tabIndex = on ? 0 : -1;
          document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
        });
        if (focus) t.focus();
      }
      tabs.forEach(function(t, i){
        t.addEventListener('click', function(){ pick(t); });
        t.addEventListener('keydown', function(e){
          var n = e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null;
          if (n){ e.preventDefault(); pick(n, true); }
        });
      });
    });
    var dock = document.querySelector('.dock');
    if (dock){
      var bs = Array.prototype.slice.call(dock.querySelectorAll('button'));
      bs.forEach(function(b){
        b.addEventListener('click', function(){
          bs.forEach(function(o){
            var on = o === b;
            o.setAttribute('aria-pressed', on ? 'true' : 'false');
            document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
          });
        });
      });
    }
  })();

  /* ══ Hero: a dot on the curve under each tile, joined by a dotted stem ══ */
  (function(){
    var eq = document.querySelector('.eq'), path = eq && eq.querySelector('.eq-curve path');
    if (!path) return;
    var svg = path.ownerSVGElement, tiles = eq.querySelectorAll('.eq-t'), made = [];
    function place(){
      made.forEach(function(n){ n.remove(); }); made = [];
      if (getComputedStyle(svg).display === 'none') return;
      var box = eq.getBoundingClientRect(), sb = svg.getBoundingClientRect(), L = path.getTotalLength();
      tiles.forEach(function(t, i){
        var ic = t.querySelector('.cube-ic').getBoundingClientRect(), lab = t.querySelector('b').getBoundingClientRect();
        var cx = ic.left + ic.width / 2, target = (cx - sb.left) / sb.width * 1000, lo = 0, hi = L, p;
        for (var k = 0; k < 24; k++){ var mid = (lo + hi) / 2; p = path.getPointAtLength(mid); if (p.x < target) lo = mid; else hi = mid; }
        var y = sb.top + p.y / 300 * sb.height - box.top, x = cx - box.left, top = lab.bottom - box.top + 10;
        var stem = document.createElement('span'); stem.className = 'eq-stem';
        stem.style.cssText = 'left:' + x + 'px;top:' + top + 'px;height:' + Math.max(0, y - top - 12) + 'px;--d:' + (i * .15) + 's';
        var dot = document.createElement('span'); dot.className = 'eq-dot';
        dot.style.cssText = 'left:' + x + 'px;top:' + y + 'px;--d:' + (i * .15 + .3) + 's';
        eq.appendChild(stem); eq.appendChild(dot); made.push(stem, dot);
      });
    }
    path.setAttribute('pathLength', '1');
    place(); window.addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  })();

  /* ══ Pictures drift against the scroll ══ */
  (function(){
    if (reduce) return;
    var list = Array.prototype.slice.call(document.querySelectorAll('.ph-fig img, .case-pic img, .side figure img, .qh img, .legal-side img, .nums-pic img'));
    list.forEach(function(img){ img.setAttribute('data-par', ''); img.style.transform = 'scale(1.12)'; });
    if (!list.length) return;
    var cur = list.map(function(){ return 0; });
    (function tick(){
      var vh = innerHeight;
      list.forEach(function(img, i){
        var r = img.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var tg = (r.top + r.height / 2 - vh / 2) / vh * -6;
        cur[i] += (tg - cur[i]) * .12;
        img.style.transform = 'translate3d(0,' + cur[i].toFixed(3) + '%,0) scale(1.12)';
      });
      requestAnimationFrame(tick);
    })();
  })();

  glassAll();
  start3D();
})();
