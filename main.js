/* JRPMTS — interactions: mobile nav, 3D tilt cards, scroll reveal,
   Three.js hero (graceful fallback if WebGL/CDN unavailable). */
(function () {
  "use strict";

  /* Mobile nav */
  var btn = document.getElementById("menuBtn");
  var nav = document.getElementById("mainNav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", nav.classList.contains("open") ? "true" : "false");
    });
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* 3D tilt cards — pointer-driven, disabled for touch / reduced motion */
  var fine = window.matchMedia("(pointer:fine)").matches;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (fine && !reduced) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("mousemove", function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateY(" + (x * 9).toFixed(2) + "deg) rotateX(" + (-y * 9).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* Hero 3D — Three.js floating shapes + particles, mouse parallax.
     Everything is decorative; if WebGL or the CDN fails, the CSS
     gradient hero underneath remains fully readable. */
  var canvas = document.getElementById("hero3d");
  if (!canvas || reduced) return;
  function initHero() {
    if (typeof THREE === "undefined") return;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) { return; }
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 11);
    var gold = new THREE.MeshStandardMaterial({ color: 0xf5b81d, metalness: 0.55, roughness: 0.3, flatShading: true });
    var navy = new THREE.MeshStandardMaterial({ color: 0x2f6db3, metalness: 0.4, roughness: 0.35, flatShading: true });
    var white = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.5, flatShading: true, transparent: true, opacity: 0.9 });
    var wire = new THREE.MeshBasicMaterial({ color: 0xf5b81d, wireframe: true, transparent: true, opacity: 0.35 });
    var shapes = [];
    function add(mesh, x, y, z, s) {
      mesh.position.set(x, y, z); mesh.scale.setScalar(s);
      mesh.userData.spin = { x: (Math.random() - 0.5) * 0.006, y: (Math.random() - 0.5) * 0.008 };
      mesh.userData.baseY = y;
      scene.add(mesh); shapes.push(mesh);
    }
    add(new THREE.IcosahedronGeometry(1.5, 0), 4.6, 1.4, -1, 1);
    add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 0), wire), 4.6, 1.4, -1, 1.35);
    add(new THREE.OctahedronGeometry(1.1, 0), -5.2, -1.6, -2, 1);
    add(new THREE.TorusGeometry(0.9, 0.28, 12, 32), 5.6, -1.8, -2.5, 1);
    add(new THREE.OctahedronGeometry(0.7, 0), -4.4, 2.2, -1, 1);
    add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), white), 3.4, 2.6, -2, 1);
    add(new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.16, 10, 28), gold), -3.2, -2.4, -1.5, 1);
    // gold chevron-ish bars
    var barGeo = new THREE.BoxGeometry(1.5, 0.16, 0.16);
    [[4.2, 0.2, -3], [4.5, -0.15, -3]].forEach(function (p) {
      var b = new THREE.Mesh(barGeo, gold);
      b.position.set(p[0], p[1], p[2]); b.rotation.z = -0.35;
      scene.add(b); shapes.push(b);
    });
    // particles
    var pGeo = new THREE.BufferGeometry();
    var count = 220, pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xf5b81d, size: 0.06, transparent: true, opacity: 0.7 })));
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    var dir = new THREE.DirectionalLight(0xffffff, 1.1); dir.position.set(5, 6, 8); scene.add(dir);
    var goldLight = new THREE.PointLight(0xf5b81d, 12, 20); goldLight.position.set(-4, 2, 3); scene.add(goldLight);

    var mx = 0, my = 0;
    window.addEventListener("pointermove", function (ev) {
      mx = (ev.clientX / window.innerWidth - 0.5);
      my = (ev.clientY / window.innerHeight - 0.5);
    }, { passive: true });

    function resize() {
      var w = canvas.clientWidth || canvas.parentElement.clientWidth;
      var h = canvas.clientHeight || canvas.parentElement.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize); resize();

    var t = 0, running = true;
    document.addEventListener("visibilitychange", function () { running = !document.hidden; });
    (function animate() {
      requestAnimationFrame(animate);
      if (!running) return;
      t += 0.01;
      shapes.forEach(function (m, i) {
        m.rotation.x += m.userData.spin ? m.userData.spin.x : 0.002;
        m.rotation.y += m.userData.spin ? m.userData.spin.y : 0.003;
        if (m.userData.baseY !== undefined) m.position.y = m.userData.baseY + Math.sin(t + i * 1.3) * 0.22;
      });
      camera.position.x += (mx * 1.4 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.9 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    })();
  }
  if (typeof THREE !== "undefined") { initHero(); }
  else {
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.158.0/three.min.js";
    s.onload = initHero;
    s.onerror = function () { if (canvas) canvas.style.display = "none"; };
    document.head.appendChild(s);
  }

  /* Contact form -> opens the visitor's email client addressed to JRPMTS
     (static site has no WordPress form backend). */
  var cform = document.getElementById("contactForm");
  if (cform) {
    cform.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var f = ev.target;
      var subject = "Website enquiry from " + (f.elements["name"] ? f.elements["name"].value : "");
      var body = "Name: " + (f.elements["name"] ? f.elements["name"].value : "") + "\n" +
        "Phone: " + (f.elements["phone"] ? f.elements["phone"].value : "") + "\n" +
        "Email: " + (f.elements["email"] ? f.elements["email"].value : "") + "\n\n" +
        (f.elements["message"] ? f.elements["message"].value : "");
      window.location.href = "mailto:info@jrpmts.com?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      var done = document.getElementById("formDone");
      if (done) done.hidden = false;
    });
  }
})();
