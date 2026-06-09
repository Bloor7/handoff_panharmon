// Products + Contact + Footer sections
const Products = () => {
  const tiers = [
  {
    name: "Sương Sớm",
    price: "Miễn phí",
    sub: "",
    desc: "Bắt đầu nhẹ nhàng với những giải mã căn bản.",
    features: ["3 lượt giải mã mỗi ngày", "Thư viện 50 biểu tượng phổ biến", "Lưu nhật ký giấc mơ 7 ngày"],
    cta: "Bắt đầu",
    featured: false,
    icon:
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="16" cy="16" r="6" />
          <path d="M16 4v2M16 26v2M4 16h2M26 16h2M7.5 7.5l1.5 1.5M23 23l1.5 1.5M7.5 24.5l1.5-1.5M23 9l1.5-1.5" />
        </svg>

  },
  {
    name: "Trăng Tròn",
    price: "99k",
    sub: "/tháng",
    desc: "Cho người mơ thường xuyên, muốn hiểu sâu hơn.",
    features: [
    "Giải mã không giới hạn",
    "Phân tích sâu theo ngũ hành, can chi",
    "Nhật ký giấc mơ trọn đời",
    "Theo dõi xu hướng giấc mơ theo tuần",
    "Cộng đồng người mơ"],

    cta: "Chọn gói này",
    featured: true,
    icon:
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="16" cy="16" r="10" />
          <circle cx="13" cy="13" r="1" fill="currentColor" />
          <circle cx="19" cy="18" r="1.4" fill="currentColor" />
          <circle cx="14" cy="20" r="0.8" fill="currentColor" />
        </svg>

  },
  {
    name: "Vạn Tinh",
    price: "299k",
    sub: "/tháng",
    desc: "Trải nghiệm trọn vẹn cùng người giải mã thật.",
    features: [
    "Tất cả tính năng Trăng Tròn",
    "1 phiên tư vấn 1:1 mỗi tháng",
    "Báo cáo giấc mơ in ấn riêng",
    "Ưu tiên trả lời trong 1 giờ"],

    cta: "Liên hệ",
    featured: false,
    icon:
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M16 4l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" />
        </svg>

  }];


  return (
    <div className="product-grid">
      {tiers.map((t, i) =>
      <Reveal key={t.name} delay={i * 60}>
          <div className={`product-card ${t.featured ? "featured" : ""}`}>
            <div className="product-icon">{t.icon}</div>
            <h3>{t.name}</h3>
            <p>{t.desc}</p>
            <div className="price">
              {t.price} <small>{t.sub}</small>
            </div>
            <ul>
              {t.features.map((f) =>
            <li key={f}>{f}</li>
            )}
            </ul>
            <button className={`btn ${t.featured ? "btn-primary" : "btn-ghost"}`} type="button">
              {t.cta}
              <span className="arrow">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </Reveal>
      )}
    </div>);

};

const ContactBlock = ({ onSent }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const handle = (e) => {
    e.preventDefault();
    setSubmitted(true);
    onSent && onSent();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="contact-wrap">
      <div className="contact-info">
        <h3>Vẫn còn câu hỏi?</h3>
        <p style={{ margin: 0, color: "var(--ink-dim)", fontSize: 15 }}>
          Chúng tôi luôn lắng nghe. Gửi lời nhắn, hoặc tìm chúng tôi qua các kênh dưới đây.
        </p>
        <div className="contact-row">
          <div className="ic">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="2" y="4" width="14" height="10" rx="1.5" />
              <path d="M2 5l7 5 7-5" />
            </svg>
          </div>
          <div>
            <b>Email</b>
            <span>panharmon@gmail.com</span>
          </div>
        </div>
        <div className="contact-row">
          <div className="ic">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M3 4c0 7 4 11 11 11l1-3-3-1-2 1c-2-1-3-2-4-4l1-2-1-3z" />
            </svg>
          </div>
          <div>
            <b>Hotline</b>
            <span>0000000— 8h đến 22h</span>
          </div>
        </div>
        <div className="contact-row">
          <div className="ic">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="9" cy="7" r="2.5" />
              <path d="M9 2c-3 0-6 2-6 6 0 5 6 9 6 9s6-4 6-9c0-4-3-6-6-6z" />
            </svg>
          </div>
          <div>
            <b>Trụ sở</b>
            <span>Xuân Hương, Đà Lạt</span>
          </div>
        </div>
      </div>

      <form className="contact-form" onSubmit={handle}>
        <div className="field">
          <label htmlFor="cf-name">Tên bạn</label>
          <input id="cf-name" type="text" placeholder="Nguyễn Văn A" required />
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input id="cf-email" type="email" placeholder="ban@email.com" required />
        </div>
        <div className="field">
          <label htmlFor="cf-topic">Chủ đề</label>
          <select id="cf-topic" defaultValue="">
            <option value="" disabled>Chọn một chủ đề</option>
            <option>Hỏi về dịch vụ</option>
            <option>Hợp tác</option>
            <option>Báo lỗi</option>
            <option>Khác</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="cf-msg">Lời nhắn</label>
          <textarea id="cf-msg" placeholder="Chia sẻ điều bạn muốn..." required></textarea>
        </div>
        <button className="btn btn-primary" type="submit" style={{ width: "100%", justifyContent: "center" }}>
          {submitted ? "Đã gửi — cảm ơn bạn ✿" : "Gửi lời nhắn"}
        </button>
      </form>
    </div>);

};

Object.assign(window, { Products, ContactBlock });