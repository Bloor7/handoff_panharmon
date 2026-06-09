// Router — hash-based. Routes: /, /san-pham, /thu-vien, /lien-he, /faq

const useHashRoute = () => {
  const parse = () => {
    const h = window.location.hash.replace(/^#/, "") || "/";
    return h.startsWith("/") ? h : "/" + h;
  };
  const [route, setRoute] = React.useState(parse());
  React.useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const go = (path) => {
    if (window.location.hash === "#" + path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = path;
  };
  return [route, go];
};

const HomePage = ({ go }) => {
  return (
    <>
      <section className="hero">
        <HeroBird className="hero-bird" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <div className="eyebrow">
              <span className="dot"></span>
              Tri thức Việt cổ • Tâm lý học hiện đại
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="hero-title">
              Lời thì thầm <br />
              từ <em>giấc mộng đêm qua</em>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="hero-sub">
              Giải mã giấc mơ của bạn theo tri thức dân gian Việt — chim Lạc, trống đồng,
              ngũ hành — kết hợp tâm lý học giấc mơ đương đại. Nhẹ nhàng, có lý, và rất gần với cuộc sống thực.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero-cta">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => document.getElementById("giai-ma")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
                
                Giải mã ngay
                <ArrowIcon />
              </button>
              <button className="btn btn-ghost" type="button" onClick={() => go("/thu-vien")}>
                Thư viện biểu tượng
              </button>
            </div>
          </Reveal>
          <Reveal delay={420}>
            <div className="hero-meta">
              <div><b>120,000+</b>giấc mơ đã giải mã</div>
              <div><b>500+</b>biểu tượng truyền thống</div>
              <div><b>4.9 ✦</b>đánh giá người dùng</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Cách Panharmon lắng nghe — quy trình ba bước ===== */}
      <section className="section section-process">
        <div className="section-head">
          <Reveal><div className="eyebrow"><span className="dot"></span>Cách chúng tôi lắng nghe</div></Reveal>
          <Reveal delay={80}><h2>Một giấc mơ — <em>ba lần đọc lại</em></h2></Reveal>
          <Reveal delay={160}>
            <p>Panharmon không trả lời giấc mơ bằng một dòng. Mỗi giấc mơ đi qua ba ô cửa — và bạn nhận được lời giải đã đan kết từ cả ba.</p>
          </Reveal>
        </div>

        <div className="process-flow">
          <Reveal delay={120}>
            <div className="process-step">
              <div className="process-num">01</div>
              <div className="process-glyph">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="40" cy="40" r="32" opacity="0.4" />
                  <path d="M20 32c4-4 10-4 14 0M46 32c4-4 10-4 14 0M20 48h40" strokeLinecap="round" />
                  <path d="M28 60c4 4 20 4 24 0" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
              <h3>Bạn kể lại</h3>
              <p>Càng chi tiết càng tốt — nước, người, màu sắc, cảm xúc còn đọng lại lúc tỉnh dậy. Bạn không cần phải kể đẹp; chỉ cần kể thật.</p>
            </div>
          </Reveal>

          <div className="process-line" aria-hidden="true">
            <svg viewBox="0 0 120 20" preserveAspectRatio="none">
              <path d="M 0 10 Q 30 0 60 10 T 120 10" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 4" />
            </svg>
          </div>

          <Reveal delay={220}>
            <div className="process-step is-featured">
              <div className="process-num">02</div>
              <div className="process-glyph">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="40" cy="40" r="34" opacity="0.4" />
                  {/* three converging arcs = three lenses */}
                  <path d="M40 12 A 28 28 0 0 1 64 56" />
                  <path d="M40 12 A 28 28 0 0 0 16 56" />
                  <path d="M16 56 A 28 28 0 0 0 64 56" />
                  <circle cx="40" cy="40" r="5" />
                </svg>
              </div>
              <h3>Ba lăng kính giao thoa</h3>
              <p>Dân gian Việt · Tâm lý học Jung · Khoa học thần kinh. Mỗi lăng kính nhìn cùng một biểu tượng theo một góc, và lời giải nằm ở chỗ chúng gặp nhau.</p>
            </div>
          </Reveal>

          <div className="process-line" aria-hidden="true">
            <svg viewBox="0 0 120 20" preserveAspectRatio="none">
              <path d="M 0 10 Q 30 20 60 10 T 120 10" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="3 4" />
            </svg>
          </div>

          <Reveal delay={320}>
            <div className="process-step">
              <div className="process-num">03</div>
              <div className="process-glyph">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  <circle cx="40" cy="40" r="32" opacity="0.4" />
                  {/* radiating sun = clarity */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i / 12) * Math.PI * 2;
                    return (
                      <line
                        key={i}
                        x1={40 + Math.cos(a) * 12}
                        y1={40 + Math.sin(a) * 12}
                        x2={40 + Math.cos(a) * 22}
                        y2={40 + Math.sin(a) * 22}
                      />
                    );
                  })}
                  <circle cx="40" cy="40" r="10" />
                  <circle cx="40" cy="40" r="4" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <h3>Lời giải về bạn</h3>
              <p>Không phải đoán tương lai — là một cuộc trò chuyện với chính mình, qua hình ảnh giấc mơ. Kèm theo gợi ý nhỏ cho ngày hôm sau.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Ba lăng kính — chi tiết, có trích dẫn ===== */}
      <section className="section section-lenses">
        <div className="section-head">
          <Reveal><div className="eyebrow"><span className="dot"></span>Ba tầng tri thức</div></Reveal>
          <Reveal delay={80}><h2>Khi cổ tích và <em>thần kinh học</em> ngồi cùng bàn</h2></Reveal>
          <Reveal delay={160}>
            <p>Người Việt xưa và các nhà khoa học hôm nay nói cùng một điều — chỉ là bằng những ngôn ngữ khác nhau. Panharmon đặt ba ngôn ngữ ấy bên cạnh nhau.</p>
          </Reveal>
        </div>

        <div className="lenses-grid">
          <Reveal delay={100}>
            <div className="lens-card" style={{ "--accent": "#e8c98a" }}>
              <div className="lens-glyph">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  {/* drum mini */}
                  <circle cx="40" cy="40" r="34" opacity="0.4" />
                  <circle cx="40" cy="40" r="26" opacity="0.6" />
                  <circle cx="40" cy="40" r="14" />
                  {Array.from({ length: 12 }).map((_, i) => {
                    const a = (i / 12) * Math.PI * 2;
                    return <line key={i} x1={40 + Math.cos(a) * 4} y1={40 + Math.sin(a) * 4} x2={40 + Math.cos(a) * 12} y2={40 + Math.sin(a) * 12} />;
                  })}
                </svg>
              </div>
              <div className="lens-eyebrow">Tầng I · Dân gian Việt</div>
              <h3>Tri thức tổ tiên — qua ngũ hành, can chi, chim Lạc</h3>
              <p>Hơn hai nghìn năm, người Việt đã có một hệ thống biểu tượng giấc mơ riêng — nước thuộc Thuỷ, lửa thuộc Hoả; con cá chép, con rắn, người đã khuất — mỗi biểu tượng mang một thông điệp về tâm và mệnh.</p>
              <blockquote className="lens-quote">
                <p>“Đêm dài lắm mộng.”</p>
                <cite>— Tục ngữ Việt Nam</cite>
              </blockquote>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="lens-card is-featured" style={{ "--accent": "#a98bcd" }}>
              <div className="lens-glyph">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  {/* iceberg of unconscious */}
                  <circle cx="40" cy="40" r="34" opacity="0.4" />
                  <path d="M40 16 L56 40 L40 64 L24 40 Z" />
                  <line x1="24" y1="40" x2="56" y2="40" strokeDasharray="2 3" />
                  <circle cx="40" cy="40" r="3" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <div className="lens-eyebrow">Tầng II · Tâm lý học Jung</div>
              <h3>Cánh cửa nhỏ vào tầng vô thức</h3>
              <p>Carl Jung gọi giấc mơ là lời thì thầm của vô thức — nơi chứa các "cổ mẫu" (archetype) chung cho cả loài người. Mỗi giấc mơ là một cuộc đối thoại giữa cái tôi tỉnh và cái tôi sâu hơn nhiều mà ta chưa biết tên.</p>
              <blockquote className="lens-quote">
                <p>“Giấc mơ là cánh cửa nhỏ ẩn giấu trong chốn sâu kín và thiêng liêng nhất của tâm hồn.”</p>
                <cite>— Carl Gustav Jung</cite>
              </blockquote>
            </div>
          </Reveal>

          <Reveal delay={300}>
            <div className="lens-card" style={{ "--accent": "#6fb9a0" }}>
              <div className="lens-glyph">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                  {/* brainwave */}
                  <circle cx="40" cy="40" r="34" opacity="0.4" />
                  <path d="M14 40 q 6 -16 12 0 t 12 0 t 12 0 t 12 0 t 12 0" strokeLinecap="round" />
                  <path d="M14 52 q 6 -8 12 0 t 12 0 t 12 0 t 12 0 t 12 0" strokeLinecap="round" opacity="0.6" />
                </svg>
              </div>
              <div className="lens-eyebrow">Tầng III · Khoa học giấc ngủ</div>
              <h3>REM — khi não đan lại ký ức và cảm xúc</h3>
              <p>Trong pha REM, não chiếu lại những trải nghiệm trong ngày dưới ngôn ngữ biểu tượng, lọc ra điều cần giữ, gỡ bớt điều cần buông. Giấc mơ vì thế là một quá trình chăm sóc tâm hồn của chính cơ thể bạn.</p>
              <blockquote className="lens-quote">
                <p>“Chúng ta ngủ để nhớ, và cũng để biết quên đúng cách.”</p>
                <cite>— Matthew Walker, <i>Why We Sleep</i></cite>
              </blockquote>
            </div>
          </Reveal>
        </div>

        <Reveal delay={400}>
          <div className="lenses-note">
            <p>
              Cả ba tầng đều thừa nhận: <strong>giấc mơ không phán xét</strong>. Nó chỉ kể lại — bằng hình ảnh — những điều ta chưa kịp nói thành lời. Panharmon đứng giữa, dịch nó về tiếng Việt của cảm xúc.
            </p>
          </div>
        </Reveal>
      </section>

      <section id="giai-ma" className="section">
        <div className="section-head">
          <Reveal><div className="eyebrow"><span className="dot"></span>Giải mã</div></Reveal>
          <Reveal delay={80}><h2>Kể lại — và <em>lắng nghe</em></h2></Reveal>
          <Reveal delay={160}>
            <p>Bạn càng kể chi tiết bao nhiêu — màu sắc, cảm xúc, người xuất hiện — lời giải càng chạm đúng bấy nhiêu.</p>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <Interpreter />
        </Reveal>
      </section>
    </>);

};

const App = () => {
  const [route, go] = useHashRoute();

  const navItems = [
  { path: "/giai-ma", label: "Giải mã" },
  { path: "/san-pham", label: "Sản phẩm" },
  { path: "/thu-vien", label: "Thư viện" },
  { path: "/lien-he", label: "Liên hệ" }];

  // Match active tab even on sub-routes (e.g. /giai-ma/<slug>)
  const isActive = (path) => route === path || route.startsWith(path + "/");

  let page;
  if (route === "/") page = <HomePage go={go} />;else
  if (route === "/giai-ma") page = <PageGiaiMa go={go} />;else
  if (route.startsWith("/giai-ma/")) page = <PageGiaiMaArticle slug={route.slice("/giai-ma/".length)} go={go} />;else
  if (route === "/san-pham") page = <PageSanPham go={go} />;else
  if (route === "/thu-vien") page = <PageThuVienTree />;else
  if (route === "/lien-he") page = <PageLienHe />;else
  if (route === "/faq") page = <PageFAQ />;else
  page = <HomePage go={go} />;

  return (
    <>
      <StarField />
      <DrumRing className="drum-ring tl" />
      <DrumRing className="drum-ring br" />

      <nav className="nav">
        <div className="shell nav-inner">
          <a href="#/" className="brand" onClick={(e) => {e.preventDefault();go("/");}}>
            <BrandMark className="brand-mark" />
            <span className="brand-name">Panharmon <em></em> </span>
          </a>
          <div className="nav-links">
            {navItems.map((it) =>
            <a
              key={it.path}
              href={`#${it.path}`}
              className={`nav-link ${isActive(it.path) ? "active" : ""}`}
              onClick={(e) => {e.preventDefault();go(it.path);}}>
              
                {it.label}
              </a>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => {
            if (route === "/") {
              document.getElementById("giai-ma")?.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
              go("/");
              setTimeout(() => document.getElementById("giai-ma")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
            }
          }} type="button">
            Giải mã ngay
            <ArrowIcon />
          </button>
        </div>
      </nav>

      <main className="shell" key={route /* re-mount reveal on nav */}>
        {page}

        <footer>
          <div className="foot-inner">
            <div>© 2026 Panharmon — Giãi mã bí ẩn giấc mơ.</div>
            <div className="foot-links">
              <a href="#/giai-ma" onClick={(e) => {e.preventDefault();go("/giai-ma");}}>Giải mã</a>
              <a href="#/san-pham" onClick={(e) => {e.preventDefault();go("/san-pham");}}>Sản phẩm</a>
              <a href="#/thu-vien" onClick={(e) => {e.preventDefault();go("/thu-vien");}}>Thư viện</a>
              <a href="#/lien-he" onClick={(e) => {e.preventDefault();go("/lien-he");}}>Liên hệ</a>
              <a href="#/faq" onClick={(e) => {e.preventDefault();go("/faq");}}>FAQ</a>
            </div>
          </div>
        </footer>
      </main>
      <Iris />
    </>);

};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);