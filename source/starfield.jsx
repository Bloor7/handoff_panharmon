// Animated star field background
const StarField = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth * devicePixelRatio);
    let h = (canvas.height = window.innerHeight * devicePixelRatio);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const stars = [];
    const STAR_COUNT = Math.min(180, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0008 + 0.0004,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        color: Math.random() > 0.85 ? "#e8c98a" : Math.random() > 0.6 ? "#c9c1b0" : "#ffffff",
      });
    }

    // A few "shooting" star drift accents
    const driftStars = [];
    for (let i = 0; i < 3; i++) {
      driftStars.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.6,
        len: 80 + Math.random() * 60,
        speed: 0.6 + Math.random() * 0.6,
        life: Math.random() * 600,
        max: 600 + Math.random() * 400,
      });
    }

    let raf;
    let t = 0;
    let mouseX = 0, mouseY = 0;

    const onMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      w = canvas.width = window.innerWidth * devicePixelRatio;
      h = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    window.addEventListener("resize", onResize);

    const tick = () => {
      t += 16;
      ctx.clearRect(0, 0, w, h);

      // Parallax offsets from mouse
      const px = mouseX * 8 * devicePixelRatio;
      const py = mouseY * 6 * devicePixelRatio;

      for (const s of stars) {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x += w;
        if (s.x > w) s.x -= w;
        if (s.y < 0) s.y += h;
        if (s.y > h) s.y -= h;

        const a = s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x + px * (s.r / 1.4), s.y + py * (s.r / 1.4), s.r * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fill();

        // Glow for brighter ones
        if (s.r > 1) {
          ctx.beginPath();
          ctx.arc(s.x + px, s.y + py, s.r * 3 * devicePixelRatio, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(s.x + px, s.y + py, 0, s.x + px, s.y + py, s.r * 3 * devicePixelRatio);
          g.addColorStop(0, s.color);
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g;
          ctx.globalAlpha = a * 0.25;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Shooting/drift stars
      for (const d of driftStars) {
        d.life += 1;
        if (d.life > d.max) {
          d.x = Math.random() * w;
          d.y = Math.random() * h * 0.5;
          d.life = 0;
          d.max = 600 + Math.random() * 400;
        }
        const progress = d.life / d.max;
        const alpha = Math.sin(progress * Math.PI) * 0.5;
        d.x += d.speed * devicePixelRatio;
        d.y += d.speed * 0.3 * devicePixelRatio;
        const grad = ctx.createLinearGradient(d.x, d.y, d.x - d.len, d.y - d.len * 0.3);
        grad.addColorStop(0, `rgba(232, 201, 138, ${alpha})`);
        grad.addColorStop(1, "rgba(232, 201, 138, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.len, d.y - d.len * 0.3);
        ctx.stroke();
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
};

// Reveal-on-scroll wrapper
const Reveal = ({ children, delay = 0 }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    const trigger = () => {
      if (cancelled) return;
      setTimeout(() => el.classList.add("in"), delay);
    };
    // Run after layout to check initial visibility
    const raf = requestAnimationFrame(() => {
      if (cancelled || !el) return;
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        trigger();
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              trigger();
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -10% 0px" }
      );
      io.observe(el);
      // Safety fallback — show anyway after 600ms
      setTimeout(() => { if (!cancelled) trigger(); }, 600);
    });
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [delay]);
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
};

Object.assign(window, { StarField, Reveal });
