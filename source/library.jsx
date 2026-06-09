// Symbol library — common Vietnamese-context dream symbols & meanings
const SYMBOLS = [
  { key: "water", name: "Nước", icon: "water", short: "Tài lộc, cảm xúc, thanh tẩy. Nước trong báo tin vui; nước đục báo lo âu.", badge: "Phổ biến" },
  { key: "flying", name: "Bay lượn", icon: "flying", short: "Tự do, vượt thoát giới hạn, khao khát đổi mới trong cuộc sống.", badge: "Tích cực" },
  { key: "snake", name: "Rắn", icon: "snake", short: "Biến chuyển, sức mạnh tiềm ẩn. Đôi khi cảnh báo người không tốt.", badge: "Lưỡng cực" },
  { key: "fish", name: "Cá", icon: "fish", short: "May mắn, tài lộc, đặc biệt cá chép gắn với khoa cử, công danh.", badge: "Tốt lành" },
  { key: "fire", name: "Lửa", icon: "fire", short: "Đam mê, năng lượng, có khi là cảnh báo về xung đột cảm xúc.", badge: "Lưỡng cực" },
  { key: "moon", name: "Trăng", icon: "moon", short: "Trực giác, mẹ, vẻ đẹp ẩn tàng. Trăng tròn báo hợp nhất, viên mãn.", badge: "Nữ tính" },
  { key: "mountain", name: "Núi", icon: "mountain", short: "Thử thách, kiên trì. Leo núi báo nỗ lực sẽ được đền đáp.", badge: "Trưởng thành" },
  { key: "tooth", name: "Rụng răng", icon: "tooth", short: "Lo lắng về tuổi tác, mất mát, hoặc thay đổi lớn sắp đến.", badge: "Cảnh báo" },
  { key: "baby", name: "Em bé", icon: "baby", short: "Khởi đầu mới, ý tưởng đang hình thành, hoặc trách nhiệm mới.", badge: "Khởi đầu" },
  { key: "house", name: "Ngôi nhà", icon: "house", short: "Bản thân, gia đình, nội tâm. Nhà mới báo bước ngoặt cuộc đời.", badge: "Bản ngã" },
  { key: "money", name: "Tiền bạc", icon: "money", short: "Giá trị bản thân, không chỉ là tài chính. Mất tiền báo bất an.", badge: "Giá trị" },
  { key: "dragon", name: "Rồng", icon: "dragon", short: "Quyền lực, vận may lớn, dòng dõi Lạc Hồng. Tin tốt sắp đến.", badge: "Đại cát" },
];

const SymbolLibrary = ({ onPick }) => {
  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div className="lib-grid">
      {SYMBOLS.map((s, i) => (
        <Reveal key={s.key} delay={i * 30}>
          <div className="symbol-card" onMouseMove={handleMouseMove} onClick={() => onPick && onPick(s)}>
            <span className="badge">{s.badge}</span>
            <div className="symbol-icon">{sym[s.icon]}</div>
            <h3>{s.name}</h3>
            <p>{s.short}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

Object.assign(window, { SYMBOLS, SymbolLibrary });
