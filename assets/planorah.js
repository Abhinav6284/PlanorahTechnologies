/* ══════════════════════════════════════════════
   ⚙️  EDIT THIS — your WhatsApp number and email
   ══════════════════════════════════════════════ */
var PLANORAH = {
  whatsapp : "916284219729",         // country code + number, digits only
  email    : "planorahtechnologies@gmail.com",
  company  : "Planorah Technologies"
};

(function(){
  "use strict";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = window.matchMedia('(pointer:fine)').matches;

  /* ── Nav ── */
  var nav = document.getElementById('nav');
  if (nav){
    var sc = function(){ nav.classList.toggle('stuck', window.scrollY > 10); };
    sc(); window.addEventListener('scroll', sc, {passive:true});
  }

  /* ── Mobile menu — the nav links are hidden under 1060px, so they need a way in ── */
  (function(){
    var btn = document.getElementById('burger'), panel = document.getElementById('mobnav');
    if (!btn || !panel) return;
    function set(open){
      panel.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    btn.addEventListener('click', function(){ set(!panel.classList.contains('open')); });
    panel.addEventListener('click', function(e){ if (e.target.tagName === 'A') set(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') set(false); });
  })();

  /* ── Mark the current page in the nav ── */
  (function(){
    var here = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    document.querySelectorAll('.nav-links a, .mobnav a').forEach(function(a){
      var href = a.getAttribute('href') || '';
      if (href.charAt(0) === '#' || /^https?:/.test(href)) return;
      var path = new URL(a.href, location.href).pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
      if (path === here) a.setAttribute('aria-current', 'page');
    });
  })();

  /* ── Reveals ── */
  var rz = document.querySelectorAll('.rz');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(en){
      en.forEach(function(e,i){
        if (e.isIntersecting){ var el = e.target; setTimeout(function(){ el.classList.add('in'); }, Math.min(i*70,260)); io.unobserve(el); }
      });
    }, {rootMargin:'0px 0px -6% 0px', threshold:.1});
    rz.forEach(function(el){ io.observe(el); });
  } else { rz.forEach(function(el){ el.classList.add('in'); }); }

  /* ══════════════════════════════════════════════════════════
     3D toolkit — shared by the hero constellation and the
     platforms carousel. Every object on the site is built from
     an extruded, beveled rounded rectangle.
     ══════════════════════════════════════════════════════════ */
  function mat(hex, metal, rough, glow){
    var o = {color:new THREE.Color(hex), metalness:metal, roughness:rough};
    if (glow){ o.emissive = new THREE.Color(hex); o.emissiveIntensity = glow; }
    return new THREE.MeshStandardMaterial(o);
  }

  function roundedRect(w, h, r){
    var x = -w/2, y = -h/2, s = new THREE.Shape();
    s.moveTo(x, y + r);
    s.lineTo(x, y + h - r); s.quadraticCurveTo(x, y + h, x + r, y + h);
    s.lineTo(x + w - r, y + h); s.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    s.lineTo(x + w, y + r); s.quadraticCurveTo(x + w, y, x + w - r, y);
    s.lineTo(x + r, y); s.quadraticCurveTo(x, y, x, y + r);
    return s;
  }

  function slab(w, h, depth, r, bevel){
    var g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), {depth:depth, bevelEnabled:true, bevelThickness:bevel, bevelSize:bevel, bevelSegments:4, curveSegments:12});
    g.center();
    return g;
  }

  /* Interface furniture drawn on a lit screen — without it every device is just a
     coloured rectangle and a phone is indistinguishable from a tablet. */
  function screenUI(sw, sh, z, kind){
    var g = new THREE.Group();
    var ink = new THREE.MeshStandardMaterial({
      color:0xffffff, metalness:.05, roughness:.5,
      emissive:0xffffff, emissiveIntensity:.3, transparent:true, opacity:.9
    });
    function bar(w, h, x, y, r){
      var m = new THREE.Mesh(slab(w, h, .015, r || Math.min(w, h) * .42, .004), ink);
      m.position.set(x, y, z);
      g.add(m);
      return m;
    }
    if (kind === 'wide'){                       /* TV / monitor: a hero tile and a shelf */
      bar(sw * .40, sh * .40, -sw * .26,  sh * .12, .05);
      bar(sw * .22, sh * .10,  sw * .16,  sh * .26, .03);
      bar(sw * .30, sh * .07,  sw * .20,  sh * .10, .025);
      [0, 1, 2].forEach(function(i){ bar(sw * .17, sh * .20, -sw * .30 + i * sw * .22, -sh * .30, .03); });
    } else {                                    /* phone / tablet / kiosk: header + list */
      bar(sw * .46, sh * .045, -sw * .24,  sh * .42, .02);
      bar(sw * .84, sh * .16,   0,         sh * .26, .04);
      [0, 1, 2].forEach(function(i){ bar(sw * .84, sh * .075, 0, sh * (.06 - i * .13), .025); });
      bar(sw * .40, sh * .06,  -sw * .21, -sh * .30, .02);
    }
    return g;
  }

  /* One screen we ship to: shell, lit display, interface, and whatever physical
     detail identifies it — a stand, a strap, a notch, side buttons. */
  function device(c){
    var g = new THREE.Group();
    var shellMat = mat(c.shell, .58, .27);
    g.add(new THREE.Mesh(slab(c.w, c.h, c.d, c.r, Math.min(.045, c.d * .32)), shellMat));

    var sw = c.w - c.bez * 2, sh = c.h - c.bez * 2;
    var screen = new THREE.Mesh(
      slab(sw, sh, .04, Math.max(c.r - c.bez * .7, .03), .012),
      mat(c.screen, .12, .42, c.glow || .14)
    );
    var sz = c.d / 2 + .05;
    screen.position.z = sz;
    g.add(screen);

    if (c.ui !== false) g.add(screenUI(sw, sh, sz + .035, c.ui));

    /* Dark furniture — notch, camera, home indicator, buttons */
    var dark = mat(0x0B0B10, .3, .5);
    if (c.notch){                                  /* phone: camera pill in the top bezel */
      var n = new THREE.Mesh(slab(sw * .30, sh * .045, .03, .018, .006), dark);
      n.position.set(0, sh * .47, sz + .04);
      g.add(n);
    }
    if (c.cam){                                    /* tablet: single lens above the screen */
      var cam = new THREE.Mesh(new THREE.CylinderGeometry(.022, .022, .03, 16), dark);
      cam.rotation.x = Math.PI / 2;
      cam.position.set(0, c.h / 2 - c.bez * .5, c.d / 2 + .03);
      g.add(cam);
    }
    if (c.home){                                   /* phone: home indicator */
      var hm = new THREE.Mesh(slab(sw * .38, sh * .012, .02, .006, .003),
        new THREE.MeshStandardMaterial({color:0xffffff, emissive:0xffffff, emissiveIntensity:.4,
          metalness:.05, roughness:.5, transparent:true, opacity:.85}));
      hm.position.set(0, -sh * .46, sz + .04);
      g.add(hm);
    }
    if (c.buttons){                                /* side keys, so the slab reads as hardware */
      var side = mat(c.shell, .7, .22);
      var vol = new THREE.Mesh(new THREE.BoxGeometry(.022, c.h * .16, c.d * .62), side);
      vol.position.set(-c.w / 2 - .008, c.h * .16, 0);
      var pwr = new THREE.Mesh(new THREE.BoxGeometry(.022, c.h * .11, c.d * .62), side);
      pwr.position.set(c.w / 2 + .008, c.h * .18, 0);
      g.add(vol, pwr);
    }
    if (c.crown){                                  /* watch: digital crown */
      var cr = new THREE.Mesh(new THREE.CylinderGeometry(.045, .045, .05, 18), mat(0x9A9AA6, .8, .28));
      cr.rotation.z = Math.PI / 2;
      cr.position.set(c.w / 2 + .03, c.h * .10, 0);
      g.add(cr);
    }

    if (c.stand){
      var neck = new THREE.Mesh(new THREE.BoxGeometry(.15, c.stand, .13), mat(c.shell, .6, .3));
      neck.position.y = -c.h / 2 - c.stand / 2 + .03;
      var foot = new THREE.Mesh(slab(c.w * .40, .11, .17, .05, .02), mat(c.shell, .6, .3));
      foot.position.y = -c.h / 2 - c.stand;
      foot.rotation.x = Math.PI / 2;
      g.add(neck, foot);
    }
    if (c.strap){
      var sm = mat(0x33333D, .4, .52);
      [1, -1].forEach(function(dir){
        var b = new THREE.Mesh(slab(.30, .40, .07, .06, .02), sm);
        b.position.set(0, dir * (c.h / 2 + .17), -.012);
        g.add(b);
      });
    }
    if (c.base){                                   /* floor-standing kiosk */
      var post = new THREE.Mesh(new THREE.BoxGeometry(.20, c.base, .16), mat(c.shell, .6, .3));
      post.position.y = -c.h / 2 - c.base / 2 + .03;
      var pad = new THREE.Mesh(slab(c.w * .82, .13, .30, .06, .025), mat(c.shell, .6, .3));
      pad.position.y = -c.h / 2 - c.base;
      pad.rotation.x = Math.PI / 2;
      g.add(post, pad);
    }
    return g;
  }

  /* ══ WebGL hero — real 3D objects ══ */
  (function(){
    var stage = document.getElementById('stage');
    var cv = document.getElementById('gl');
    if (!stage || !cv) return;                       /* interior pages have no hero stage */
    if (!window.THREE){ stage.classList.add('no3d'); return; }

    var renderer;
    try{
      renderer = new THREE.WebGLRenderer({canvas:cv, alpha:true, antialias:true});
    }catch(e){ stage.classList.add('no3d'); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    camera.position.set(0, 0, 9);

    var group = new THREE.Group();
    scene.add(group);

    /* The constellation: every screen Planorah ships to, wired back to one team */
    var SCREENS = [
      /* TV */     { w:2.90, h:1.66, d:.13, r:.05, bez:.07, shell:0x14141A, screen:0xFF6B3D, ui:'wide',
                     p:[ .88, 1.92,-1.50], rot:[-.05,-.21, .01], stand:.34 },
      /* monitor */{ w:2.02, h:1.30, d:.12, r:.05, bez:.06, shell:0xF2F1EC, screen:0x6248F5, ui:'wide',
                     p:[-2.12, .12, -.50], rot:[-.04, .27,-.02], stand:.30 },
      /* tablet */ { w:1.18, h:1.62, d:.09, r:.09, bez:.08, shell:0xE6E4DE, screen:0x2F7CF6,
                     cam:true, buttons:true, p:[ 2.18,-.38, -.10], rot:[ .06,-.31, .05] },
      /* phone */  { w:.66,  h:1.36, d:.09, r:.12, bez:.045, shell:0x14141A, screen:0x0FB981,
                     notch:true, home:true, buttons:true, p:[ .78,-2.02,  .90], rot:[ .04, .23,-.08] },
      /* watch */  { w:.58,  h:.68,  d:.15, r:.19, bez:.055, shell:0x14141A, screen:0xFFC53D,
                     ui:false, crown:true, strap:true, p:[-1.92, 1.86,  .70], rot:[ .05, .31, .10] }
    ];

    var screens = [], pulses = [];
    SCREENS.forEach(function(c, i){
      var d = device(c);
      d.position.set(c.p[0], c.p[1], c.p[2]);
      d.rotation.set(c.rot[0], c.rot[1], c.rot[2]);
      d.userData.baseY = c.p[1];
      d.userData.baseRY = c.rot[1];
      d.userData.ph = i * 1.27;
      group.add(d); screens.push(d);

      var to = new THREE.Vector3(c.p[0], c.p[1], c.p[2]);
      group.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), to.clone()]),
        new THREE.LineBasicMaterial({color:0x8A8D95, transparent:true, opacity:.3})
      ));

      var p = new THREE.Mesh(new THREE.SphereGeometry(.062, 16, 16),
        new THREE.MeshBasicMaterial({color:c.screen, transparent:true}));
      group.add(p);
      pulses.push({m:p, to:to, t:i * .19, sp:.0040 + i * .0005});
    });

    /* Hub — the Planorah mark, where every screen connects back to */
    var hub = new THREE.Group();
    var hubBody = new THREE.Mesh(slab(.88, .88, .34, .27, .055), mat(0x6248F5, .45, .22));
    var hubBar  = new THREE.Mesh(slab(.53, .155, .06, .065, .02), mat(0xffffff, .1, .45));
    var hubDot  = new THREE.Mesh(slab(.34, .22, .06, .06, .02),   mat(0xFFC53D, .2, .35));
    hubBar.position.set(0, .235, .27);
    hubDot.position.set(-.225, -.255, .27);
    hub.add(hubBody, hubBar, hubDot);
    group.add(hub);

    var halo = new THREE.Mesh(new THREE.TorusGeometry(1.06, .011, 8, 90),
      new THREE.MeshBasicMaterial({color:0x6248F5, transparent:true, opacity:.26}));
    halo.rotation.x = Math.PI / 2.3;
    group.add(halo);

    group.scale.setScalar(1.12);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdedad0, .78));
    var key = new THREE.DirectionalLight(0xffffff, .95); key.position.set(4, 6, 6); scene.add(key);
    var p1 = new THREE.PointLight(0x6248F5, .85, 30); p1.position.set(-6, 3, 4); scene.add(p1);
    var p2 = new THREE.PointLight(0xFFC53D, .6, 30);  p2.position.set(6, -3, 3); scene.add(p2);

    function size(){
      var r = stage.getBoundingClientRect();
      var w = Math.max(r.width, 1), h = Math.max(r.height, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      camera.position.z = w < 520 ? 11.5 : 9.5;
    }
    size();
    window.addEventListener('resize', size);

    var mx = 0, my = 0, tX = 0, tY = 0, t = 0;
    if (fine && !reduce){
      window.addEventListener('mousemove', function(e){
        tX = (e.clientX / window.innerWidth - .5) * 2;
        tY = (e.clientY / window.innerHeight - .5) * 2;
      }, {passive:true});
    }

    function frame(){
      t += .01;
      mx += (tX - mx) * .05; my += (tY - my) * .05;
      /* sway, never far enough to turn a screen edge-on */
      group.rotation.y = mx * .26 + Math.sin(t * .22) * .15;
      group.rotation.x = my * .16 + Math.cos(t * .18) * .05;

      screens.forEach(function(d){
        d.position.y = d.userData.baseY + Math.sin(t * .7 + d.userData.ph) * .13;
        d.rotation.y = d.userData.baseRY + Math.sin(t * .45 + d.userData.ph) * .07;
      });
      hub.rotation.y = Math.sin(t * .3) * .5;
      halo.rotation.z += .0016;

      pulses.forEach(function(p){
        p.t += p.sp; if (p.t > 1) p.t = 0;
        var e = p.t * p.t * (3 - 2 * p.t);
        p.m.position.set(p.to.x * e, p.to.y * e, p.to.z * e);
        p.m.material.opacity = Math.sin(p.t * Math.PI);
      });

      renderer.render(scene, camera);
      if (!reduce) requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ══ Platforms carousel — the six screens, as real objects on a turntable ══
     Replaces a CSS cube whose translucent faces let the back labels bleed
     through and render mirrored. Here each platform is a solid object and the
     name is read from HTML underneath, so it is always legible. */
  (function(){
    var stage = document.getElementById('platStage');
    var cv    = document.getElementById('gl2');
    var label = document.getElementById('platName');
    var sub   = document.getElementById('platSub');
    if (!stage || !cv || !window.THREE) return;

    var renderer;
    try{
      renderer = new THREE.WebGLRenderer({canvas:cv, alpha:true, antialias:true});
    }catch(e){ return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    var scene  = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, .1, 100);
    camera.position.set(0, .55, 7.4);
    camera.lookAt(0, -.1, 0);

    var ring = new THREE.Group();
    scene.add(ring);

    /* Dark shells with lit screens — this section sits on --ink */
    var PLATFORMS = [
      { name:'Web',    sub:'Responsive · PWA',   w:2.00, h:1.26, d:.11, r:.05, bez:.055, shell:0x2A2A36,
        screen:0x6248F5, glow:.5, ui:'wide', stand:.30 },
      { name:'Mobile', sub:'iOS · Android',      w:.72,  h:1.48, d:.09, r:.13, bez:.048, shell:0x2A2A36,
        screen:0x0FB981, glow:.5, notch:true, home:true, buttons:true },
      { name:'TV',     sub:'tvOS · Android TV',  w:2.35, h:1.34, d:.11, r:.04, bez:.05, shell:0x2A2A36,
        screen:0xFF6B3D, glow:.5, ui:'wide', stand:.30 },
      { name:'Tablet', sub:'iPadOS · Android',   w:1.24, h:1.70, d:.08, r:.09, bez:.075, shell:0x2A2A36,
        screen:0x2F7CF6, glow:.5, cam:true, buttons:true },
      { name:'Watch',  sub:'watchOS · Wear OS',  w:.66,  h:.78,  d:.16, r:.21, bez:.06, shell:0x2A2A36,
        screen:0xFFC53D, glow:.5, ui:false, crown:true, strap:true },
      { name:'Kiosk',  sub:'POS · Self-service', w:1.08, h:1.66, d:.12, r:.06, bez:.07, shell:0x2A2A36,
        screen:0x25D366, glow:.5, base:.42 }
    ];

    var R = 3.05, STEP = Math.PI * 2 / PLATFORMS.length, items = [];
    PLATFORMS.forEach(function(c, i){
      var a = i * STEP;
      var d = device(c);
      d.position.set(Math.sin(a) * R, 0, Math.cos(a) * R);
      ring.add(d);
      items.push({m:d, a:a, c:c});
    });

    /* Cover-flow turn: a device facing strictly outward goes edge-on at the sides and
       renders as a bright sliver. Turning only a fraction of the way keeps every screen
       readable while still reading as a ring in space. */
    var TURN = .32;

    /* A disc under the ring so the objects read as standing on something */
    var disc = new THREE.Mesh(
      new THREE.TorusGeometry(R, .012, 8, 120),
      new THREE.MeshBasicMaterial({color:0x6248F5, transparent:true, opacity:.35})
    );
    disc.rotation.x = Math.PI / 2;
    disc.position.y = -1.35;
    scene.add(disc);

    scene.add(new THREE.HemisphereLight(0x9aa0ff, 0x101014, .55));
    var key = new THREE.DirectionalLight(0xffffff, .85); key.position.set(2, 5, 6); scene.add(key);
    var rimL = new THREE.PointLight(0x6248F5, 1.5, 22); rimL.position.set(-5, 1.5, 2); scene.add(rimL);
    var rimR = new THREE.PointLight(0xFF6B3D, 1.1, 22); rimR.position.set(5, -1, 2);  scene.add(rimR);
    var fill = new THREE.PointLight(0xffffff, .5, 18);  fill.position.set(0, 1, 5);   scene.add(fill);

    function size(){
      var r = stage.getBoundingClientRect();
      var w = Math.max(r.width, 1), h = Math.max(r.height, 1);
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
      camera.position.z = w < 460 ? 9.2 : 7.4;
      camera.lookAt(0, -.1, 0);
    }
    size();
    window.addEventListener('resize', size);

    /* Drag to spin, with momentum; otherwise it drifts on its own */
    var spin = 0, vel = .0022, down = false, lastX = 0, dragged = 0, shown = -1;

    stage.addEventListener('pointerdown', function(e){
      down = true; lastX = e.clientX; dragged = 0; vel = 0;
      stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener('pointermove', function(e){
      if (!down) return;
      var dx = e.clientX - lastX; lastX = e.clientX; dragged += Math.abs(dx);
      spin += dx * .008; vel = dx * .008;
    });
    ['pointerup','pointercancel','pointerleave'].forEach(function(ev){
      stage.addEventListener(ev, function(){ down = false; });
    });

    function frame(){
      if (!down){
        spin += vel;
        vel += (.0022 - vel) * .02;                  /* ease back to the idle drift */
      }
      if (spin > Math.PI * 2) spin -= Math.PI * 2;   /* keep it bounded, forever */
      if (spin < -Math.PI * 2) spin += Math.PI * 2;
      ring.rotation.y = spin;
      disc.rotation.z = -spin;

      /* Name whichever platform is currently facing the viewer */
      var best = 0, bestZ = -Infinity;
      items.forEach(function(it, i){
        var world = it.a + spin;                      /* where it sits on the ring right now */
        /* Wrap to [-PI, PI]. Without this the turn below grows with `spin`, the device
           eventually rotates past 90 degrees, and you read its back with the interface
           mirrored — exactly the fault the old CSS cube had. */
        var off = Math.atan2(Math.sin(world), Math.cos(world));
        var z = Math.cos(off);
        if (z > bestZ){ bestZ = z; best = i; }
        var f = (z + 1) / 2;                          /* 0 at the back, 1 at the front */
        it.m.rotation.y = off * TURN - spin;          /* face the viewer, turned only partway */
        it.m.position.y = (1 - f) * -.10;
        it.m.scale.setScalar(.72 + f * .30);          /* nearer reads bigger */
      });
      if (best !== shown){
        shown = best;
        if (label) label.textContent = items[best].c.name;
        if (sub) sub.textContent = items[best].c.sub;
      }

      renderer.render(scene, camera);
      if (!reduce) requestAnimationFrame(frame);
    }
    frame();
  })();


  /* ══ 3D cards — the card turns toward the cursor and its layers separate ══
     Skipped entirely on touch and under reduced motion, where a tilting card is
     either impossible to drive or actively unpleasant. */
  (function(){
    if (reduce || !fine) return;

    var cards = document.querySelectorAll('.card, .work, .mate, .step, .stat-card');
    if (!cards.length) return;

    document.documentElement.classList.add('tilt3d');

    var MAX = 9;                                    /* degrees of turn at the card edge */

    cards.forEach(function(card){
      card.classList.add('tilt3d');

      var sheen = document.createElement('span');
      sheen.className = 'sheen';
      sheen.setAttribute('aria-hidden', 'true');
      card.appendChild(sheen);

      var rect = null;

      function measure(){ rect = card.getBoundingClientRect(); }

      card.addEventListener('pointerenter', function(e){
        if (e.pointerType !== 'mouse') return;
        measure();
        card.classList.add('is-tilting');
      });

      card.addEventListener('pointermove', function(e){
        if (!card.classList.contains('is-tilting')) return;
        if (!rect) measure();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        px = Math.min(Math.max(px, 0), 1);
        py = Math.min(Math.max(py, 0), 1);

        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        card.style.transform =
          'rotateX(' + ((py - .5) * -2 * MAX).toFixed(2) + 'deg)' +
          ' rotateY(' + ((px - .5) * 2 * MAX).toFixed(2) + 'deg)' +
          ' translateY(-10px) scale(1.015)';
      });

      card.addEventListener('pointerleave', function(){
        card.classList.remove('is-tilting');
        card.style.transform = '';               /* CSS eases it back flat */
        rect = null;
      });
    });

    /* Cached rects go stale when the page moves under the cursor */
    window.addEventListener('scroll', function(){
      var t = document.querySelector('.tilt3d.is-tilting');
      if (t){ t.classList.remove('is-tilting'); t.style.transform = ''; }
    }, {passive:true});
  })();


  /* ══ Stacked slides — depth as each panel is covered ══
     Sticky alone makes the next panel slide over the last. This adds the part
     that sells it: the covered panel scales back and dims, so the stack reads
     as sheets settling on top of one another rather than a hard swap. */
  (function(){
    var slides = Array.prototype.slice.call(document.querySelectorAll('.stack .slide'));
    if (!slides.length || reduce) return;

    var SCALE = .07, DIM = .30, ticking = false;

    function apply(){
      ticking = false;
      for (var i = 0; i < slides.length; i++){
        var veil = slides[i].querySelector('.slide-veil');
        var next = slides[i + 1];
        if (!next){                                  /* last panel is never covered */
          slides[i].style.transform = '';
          if (veil) veil.style.opacity = '0';
          continue;
        }
        var here = slides[i].getBoundingClientRect();
        var nx   = next.getBoundingClientRect();
        /* how far the next panel has travelled across this one, 0 → 1 */
        var p = 1 - Math.min(Math.max((nx.top - here.top) / Math.max(here.height, 1), 0), 1);
        slides[i].style.transform = 'scale(' + (1 - p * SCALE).toFixed(4) + ')';
        if (veil) veil.style.opacity = (p * DIM).toFixed(3);
      }
    }

    function onScroll(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    }

    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    apply();
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

  /* ── FAQ / accordion ── */
  document.querySelectorAll('.qa').forEach(function(item){
    var q = item.querySelector('.qa-q');
    if (!q) return;
    q.addEventListener('click', function(){
      var open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
})();
