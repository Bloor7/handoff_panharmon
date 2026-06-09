import type { Metadata } from "next";
import Link from "next/link";
import { Interpreter } from "@/components/home/Interpreter";
import { ArrowIcon, HeroBird, Reveal } from "@/components/patterns";

export const metadata: Metadata = {
  title: "Giải mã giấc mơ Việt",
  description: "Kể lại giấc mơ của bạn và lắng nghe lời giải qua dân gian Việt, Jung và khoa học giấc ngủ."
};

function svgNum(value: number) {
  return value.toFixed(4);
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <HeroBird className="hero-bird" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal>
            <div className="eyebrow">
              <span className="dot"></span>
              Tri thức Việt cổ · Tâm lý học hiện đại
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
              Giải mã giấc mơ của bạn theo tri thức dân gian Việt - chim Lạc, trống đồng, ngũ hành - kết hợp tâm lý học giấc mơ đương đại. Nhẹ nhàng, có lý, và rất gần với cuộc sống thực.
            </p>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero-cta">
              <a className="btn btn-primary" href="#giai-ma">
                Giải mã ngay
                <ArrowIcon />
              </a>
              <Link className="btn btn-ghost" href="/thu-vien">
                Thư viện biểu tượng
              </Link>
            </div>
          </Reveal>
          <Reveal delay={420}>
            <div className="hero-meta">
              <div>
                <b>100+</b>giấc mơ đã giải mã
              </div>
              <div>
                <b>6000+</b>biểu tượng truyền thống
              </div>
              <div>
                <b>4.9 ✦</b>đánh giá người dùng
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-process">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow">
              <span className="dot"></span>Cách chúng tôi lắng nghe
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2>
              Một giấc mơ - <em>ba lần đọc lại</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p>Panharmon không trả lời giấc mơ bằng một dòng. Mỗi giấc mơ đi qua ba ô cửa - và bạn nhận được lời giải đã đan kết từ cả ba.</p>
          </Reveal>
        </div>
        <div className="process-flow">
          {[
            ["01", "Bạn kể lại", "Càng chi tiết càng tốt - nước, người, màu sắc, cảm xúc còn đọng lại lúc tỉnh dậy. Bạn không cần phải kể đẹp; chỉ cần kể thật."],
            ["02", "Ba lăng kính giao thoa", "Dân gian Việt · Tâm lý học Jung · Khoa học thần kinh. Mỗi lăng kính nhìn cùng một biểu tượng theo một góc, và lời giải nằm ở chỗ chúng gặp nhau."],
            ["03", "Lời giải về bạn", "Không phải đoán tương lai - là một cuộc trò chuyện với chính mình, qua hình ảnh giấc mơ. Kèm theo gợi ý nhỏ cho ngày hôm sau."]
          ].map(([num, title, text], index) => (
            <Reveal key={num} delay={120 + index * 100}>
              <div className={`process-step ${index === 1 ? "is-featured" : ""}`}>
                <div className="process-num">{num}</div>
                <div className="process-glyph">
                  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                    <circle cx="40" cy="40" r="32" opacity="0.4" />
                    <circle cx="40" cy="40" r={index === 1 ? 5 : 10} />
                    {Array.from({ length: index === 2 ? 12 : 3 }).map((_, i) => {
                      const a = (i / (index === 2 ? 12 : 3)) * Math.PI * 2;
                      return <line key={i} x1={svgNum(40 + Math.cos(a) * 12)} y1={svgNum(40 + Math.sin(a) * 12)} x2={svgNum(40 + Math.cos(a) * 22)} y2={svgNum(40 + Math.sin(a) * 22)} />;
                    })}
                  </svg>
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-lenses">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow">
              <span className="dot"></span>Ba tầng tri thức
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2>
              Khi cổ tích và <em>thần kinh học</em> ngồi cùng bàn
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p>Người Việt xưa và các nhà khoa học hôm nay nói cùng một điều - chỉ là bằng những ngôn ngữ khác nhau. Panharmon đặt ba ngôn ngữ ấy bên cạnh nhau.</p>
          </Reveal>
        </div>

        <div className="lenses-grid">
          {[
            ["#e8c98a", "Tầng I · Dân gian Việt", "Tri thức tổ tiên - qua ngũ hành, can chi, chim Lạc", "Hơn hai nghìn năm, người Việt đã có một hệ thống biểu tượng giấc mơ riêng - nước thuộc Thuỷ, lửa thuộc Hoả; con cá chép, con rắn, người đã khuất - mỗi biểu tượng mang một thông điệp về tâm và mệnh."],
            ["#a98bcd", "Tầng II · Tâm lý học Jung", "Cánh cửa nhỏ vào tầng vô thức", "Carl Jung gọi giấc mơ là lời thì thầm của vô thức - nơi chứa các cổ mẫu chung cho cả loài người. Mỗi giấc mơ là một cuộc đối thoại giữa cái tôi tỉnh và cái tôi sâu hơn nhiều mà ta chưa biết tên."],
            ["#6fb9a0", "Tầng III · Khoa học giấc ngủ", "REM - khi não đan lại ký ức và cảm xúc", "Trong pha REM, não chiếu lại những trải nghiệm trong ngày dưới ngôn ngữ biểu tượng, lọc ra điều cần giữ, gỡ bớt điều cần buông."]
          ].map(([accent, eyebrow, title, text], index) => (
            <Reveal key={eyebrow} delay={100 + index * 100}>
              <article className={`lens-card ${index === 1 ? "is-featured" : ""}`} style={{ "--accent": accent } as React.CSSProperties}>
                <div className="lens-glyph">
                  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                    <circle cx="40" cy="40" r="34" opacity="0.4" />
                    <circle cx="40" cy="40" r="18" />
                    <circle cx="40" cy="40" r="3" fill="currentColor" stroke="none" />
                  </svg>
                </div>
                <div className="lens-eyebrow">{eyebrow}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="giai-ma" className="section">
        <div className="section-head">
          <Reveal>
            <div className="eyebrow">
              <span className="dot"></span>Giải mã
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2>
              Kể lại - và <em>lắng nghe</em>
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p>Bạn càng kể chi tiết bao nhiêu - màu sắc, cảm xúc, người xuất hiện - lời giải càng chạm đúng bấy nhiêu.</p>
          </Reveal>
        </div>
        <Reveal delay={200}>
          <Interpreter />
        </Reveal>
      </section>
    </>
  );
}
