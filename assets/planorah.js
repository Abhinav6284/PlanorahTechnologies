/* ══════════════════════════════════════════════
   EDIT THIS — your WhatsApp number and email
   ══════════════════════════════════════════════ */
var PLANORAH = {
  whatsapp : "917710223342",         // country code + number, digits only
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


  /* ══ Hero: the requirement form, sent as a WhatsApp message ══ */
  (function(){
    var form = document.getElementById('ask');
    if (!form) return;
    var F = {
      name:  { el: document.getElementById('ask-name'),  msg: 'Add your name so we know who we are replying to.' },
      phone: { el: document.getElementById('ask-phone'), msg: 'Add a WhatsApp number with at least 10 digits.' },
      need:  { el: document.getElementById('ask-need'),  msg: 'Tell us in a few words what you need built.' }
    };
    function bad(key, on){
      var box = document.getElementById('ask-f-' + key), err = document.getElementById('ask-e-' + key);
      box.classList.toggle('err', on);
      err.textContent = on ? F[key].msg : '';
      F[key].el.setAttribute('aria-invalid', on ? 'true' : 'false');
      if (on) F[key].el.setAttribute('aria-describedby', 'ask-e-' + key); else F[key].el.removeAttribute('aria-describedby');
      return on;
    }
    Object.keys(F).forEach(function(k){ F[k].el.addEventListener('input', function(){ if (F[k].el.getAttribute('aria-invalid') === 'true') bad(k, false); }); });
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = F.name.el.value.trim(), phone = F.phone.el.value.trim(), need = F.need.el.value.trim();
      var wrong = [];
      if (bad('name', !name)) wrong.push('name');
      if (bad('phone', phone.replace(/\D/g, '').length < 10)) wrong.push('phone');
      if (bad('need', need.length < 3)) wrong.push('need');
      if (wrong.length){ F[wrong[0]].el.focus(); return; }
      var msg = 'Hello ' + PLANORAH.company + ', I would like a quote.\n\n' +
        'Name: ' + name + '\nWhatsApp: ' + phone + '\n\nWhat I need built:\n' + need;
      window.open(waBase + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  })();

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

})();
