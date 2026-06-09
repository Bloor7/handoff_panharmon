// === Blog: Giải mã chi tiết các biểu tượng ===
// List view (route /giai-ma) + detail view (route /giai-ma/<slug>)

const BLOG_ARTICLES = [
  {
    slug: "nuoc",
    title: "Nước trong giấc mơ — dòng chảy của cảm xúc",
    symbol: "Nước",
    eyebrow: "Ngũ hành · Thủy",
    excerpt:
      "Một giấc mơ về nước hầu như không bao giờ chỉ nói về nước. Tổ tiên Việt soi mặt mình xuống mặt hồ, mặt sông — và thấy lòng mình trong đó. Tâm lý học hiện đại đồng ý: nước là tấm gương của tầng vô thức.",
    readTime: 7,
    tags: ["Cảm xúc", "Tinh thần", "Vô thức"],
    accent: "#6fb9a0",
    glyph: "wave",
    image: "", // e.g. "uploads/blog-nuoc.jpg" — leave empty to keep the SVG glyph
    imageAlt: "Mặt nước phẳng lặng — biểu tượng dòng cảm xúc",
    sections: [
      {
        kind: "h",
        text: "Trong tâm thức người Việt",
      },
      {
        kind: "p",
        text:
          "Người Việt sinh ra bên dòng sông. Sông Hồng, sông Mã, sông Đồng Nai — dòng chảy không chỉ là địa lý, mà là ký ức. Ca dao có câu \"sông sâu sào ngắn khó dò\" — nước luôn gắn với điều ẩn giấu, sâu thẳm, không nhìn thấy đáy. Khi nước hiện lên trong mơ, ông bà nhắc cháu lắng lại nghe lòng mình.",
      },
      {
        kind: "p",
        text:
          "Trong ngũ hành, Thủy ứng với phương Bắc, mùa Đông, màu đen, sự trầm tĩnh và tích chứa. Người mơ thấy nước trong, lặng — tâm đang an. Mơ thấy nước đục, cuộn xoáy — bên trong đang có điều chưa giải được, đang chờ lắng xuống.",
      },
      {
        kind: "h",
        text: "Góc nhìn tâm lý học hiện đại",
      },
      {
        kind: "p",
        text:
          "Carl Jung gọi nước là biểu tượng cổ mẫu (archetype) cho vô thức tập thể — nơi chứa những gì ta chưa kịp gọi tên. Một dòng sông trong mơ là toàn bộ cuộc đời cảm xúc của bạn đang trôi qua khung hình ngắn ngủi của giấc ngủ.",
      },
      {
        kind: "p",
        text:
          "Các nhà nghiên cứu giấc mơ hiện đại lưu ý: nước thường xuất hiện sau những ngày bạn nén cảm xúc — khóc thầm, giận âm thầm, hoặc kìm một quyết định. Cơ thể ngủ rồi, nhưng cảm xúc vẫn cần chỗ để thoát.",
      },
      {
        kind: "h",
        text: "Năm kịch bản phổ biến",
      },
      {
        kind: "list",
        items: [
          "**Nước trong, phẳng lặng** — bạn đang ở giai đoạn nội tâm bình an, hoặc cơ thể đang cần bạn nghỉ ngơi đúng nghĩa.",
          "**Nước cuộn, có sóng** — một cảm xúc lớn (lo âu, mong chờ, oán giận) chưa được bạn thừa nhận hết.",
          "**Bạn bơi qua** — bạn đang xử lý một chuyển biến lớn trong đời thực. Nếu bơi được, bạn đủ sức.",
          "**Bạn chết đuối, hụt chân** — quá nhiều thứ đến cùng lúc. Đây là tín hiệu rõ ràng: cần ai đó để chia sẻ, hoặc cần dừng lại.",
          "**Nước dâng ngập nhà** — một biến cố hoặc cảm xúc đang xâm chiếm vùng an toàn nhất của bạn (gia đình, sức khoẻ, danh tính).",
        ],
      },
      {
        kind: "h",
        text: "Lời khuyên dịu dàng",
      },
      {
        kind: "p",
        text:
          "Nếu giấc mơ về nước cứ trở đi trở lại, đừng vội tra cứu \"nước trong mơ là gì\". Hãy hỏi mình: tuần qua, cảm xúc nào bạn đã không cho phép mình cảm thấy đủ? Viết nó ra. Đôi khi chỉ cần đặt tên cho dòng nước, nó sẽ tự tìm đường về biển.",
      },
    ],
  },

  {
    slug: "ran",
    title: "Rắn — kẻ canh giữ ngưỡng cửa biến chuyển",
    symbol: "Rắn",
    eyebrow: "Linh vật · Chuyển hoá",
    excerpt:
      "Rắn lột da để lớn lên. Khi rắn bò vào giấc mơ bạn, hiếm khi nó đến để doạ — nó đến báo rằng một lớp da cũ của bạn đã không còn vừa nữa.",
    readTime: 8,
    tags: ["Chuyển hoá", "Lo âu", "Bản năng"],
    accent: "#a98bcd",
    glyph: "snake",
    image: "",
    imageAlt: "Rắn — kẻ canh ngưỡng cửa biến chuyển",
    sections: [
      {
        kind: "h",
        text: "Rắn trong dân gian Việt",
      },
      {
        kind: "p",
        text:
          "Người Việt vừa kính vừa sợ rắn. Đền thờ \"Ông\" rải khắp đồng bằng Bắc Bộ — rắn được coi là hiện thân của thần sông, thần đất. Nhưng dân gian cũng có câu \"rắn cắn — của đến\", nghĩa là điều đáng sợ ban đầu có thể là điềm lành sau cùng.",
      },
      {
        kind: "p",
        text:
          "Trong truyền thuyết Lạc Long Quân — Âu Cơ, rồng (một dạng rắn linh thiêng) là tổ tiên dân tộc. Rắn ở đây không phải kẻ thù, mà là cội nguồn quyền năng và biến hoá.",
      },
      {
        kind: "h",
        text: "Tâm lý học: Rắn là chuyển hoá",
      },
      {
        kind: "p",
        text:
          "Trong phân tâm học Jung, rắn tượng trưng cho quá trình chuyển hoá: lột da, tái sinh, chữa lành. Biểu tượng caduceus của y học cổ Hy Lạp cũng có hai con rắn — y học chính là nghệ thuật giúp cơ thể lột bỏ bệnh tật để sống tiếp.",
      },
      {
        kind: "p",
        text:
          "Rắn xuất hiện trong mơ thường vào giai đoạn người mơ đang ở ngưỡng cửa thay đổi: đổi việc, kết thúc một mối quan hệ, chuyển nhà, thay đổi niềm tin sâu sắc. Bản thân cảm giác lo âu khi mơ là tự nhiên — chuyển hoá nào cũng có lúc đau.",
      },
      {
        kind: "h",
        text: "Đọc từng cảnh trong mơ",
      },
      {
        kind: "list",
        items: [
          "**Rắn lột da trước mắt bạn** — bạn đang được nhắc: lớp da cũ đã đủ rồi, đến lúc đi tiếp.",
          "**Rắn cắn** — không phải lúc nào cũng xấu. Thường là một sự thật đau nhưng cần thiết đang \"chích\" bạn tỉnh.",
          "**Rắn quấn quanh người bạn** — một mối quan hệ hoặc một tình huống đang siết bạn. Cần được nhìn thẳng vào tên gọi của nó.",
          "**Rắn nhiều màu, rắn hai đầu** — phần bản năng và phần lý trí đang giằng co. Hãy lắng nghe cả hai.",
          "**Bạn giết được rắn** — bạn vừa vượt qua một nỗi sợ mà bản thân cũng chưa biết là đã vượt qua.",
        ],
      },
      {
        kind: "h",
        text: "Lời khuyên dịu dàng",
      },
      {
        kind: "p",
        text:
          "Đừng vội xua đuổi giấc mơ về rắn. Hãy hỏi: tôi đang trong giai đoạn chuyển hoá nào của đời mình? Có lớp \"da\" nào (một thói quen, một niềm tin, một danh xưng) đã quá chật so với con người hiện tại của tôi? Đôi khi rắn đến chỉ để báo rằng bạn đã sẵn sàng cho điều kế tiếp — sẵn sàng hơn bạn nghĩ.",
      },
    ],
  },

  {
    slug: "bay-luon",
    title: "Bay lượn — khi linh hồn muốn rộng hơn cơ thể",
    symbol: "Bay lượn",
    eyebrow: "Tự do · Khát vọng",
    excerpt:
      "Hầu hết chúng ta đều từng bay trong mơ — ít nhất một lần. Đó không phải ngẫu nhiên. Bay là một trong vài giấc mơ phổ quát nhất của loài người, và nó nói điều gì đó rất đẹp về bạn.",
    readTime: 6,
    tags: ["Tự do", "Khát vọng", "Niềm tin"],
    accent: "#e8c98a",
    glyph: "bird",
    image: "",
    imageAlt: "Cánh chim Lạc — khát vọng tự do",
    sections: [
      {
        kind: "h",
        text: "Chim Lạc — gốc văn hoá Việt",
      },
      {
        kind: "p",
        text:
          "Trên mặt trống đồng Đông Sơn, từ 2500 năm trước, người Việt đã khắc hình chim Lạc bay vòng quanh mặt trời. Họ không bay được — nhưng họ tin rằng linh hồn có thể. Giấc mơ bay không phải phát hiện hiện đại; nó cổ xưa như chính con người.",
      },
      {
        kind: "h",
        text: "Cơ thể ngủ — tâm trí bay",
      },
      {
        kind: "p",
        text:
          "Khoa học giấc ngủ giải thích: trong giai đoạn REM, cơ thể tê liệt tạm thời (sleep paralysis sinh lý) để bạn không thực sự bước theo giấc mơ. Não bộ \"không nhận\" được tín hiệu trọng lực từ cơ thể — và nó dệt nên cảm giác bay.",
      },
      {
        kind: "p",
        text:
          "Nhưng cách bộ não dệt cảm giác đó lại nói về tâm hồn bạn. Có người bay đầy hân hoan, có người chật vật như đang lội nước, có người sợ rơi. Mỗi cách bay là một lời thì thầm khác.",
      },
      {
        kind: "h",
        text: "Bốn cách bay, bốn thông điệp",
      },
      {
        kind: "list",
        items: [
          "**Bay nhẹ tênh, ngắm cảnh từ trên cao** — bạn đang có cái nhìn rộng và sáng về cuộc đời mình. Hãy tin vào trực giác đó.",
          "**Bay nhưng phải cố gắng đập tay liên tục** — bạn đang khát một sự tự do nhưng có gì đó (trách nhiệm, sợ hãi, kỳ vọng người khác) níu lại.",
          "**Bay rồi rơi** — một dự định bạn đặt nhiều kỳ vọng đang bấp bênh. Không phải điềm xấu — chỉ là lời nhắc: hạ độ cao và xem lại nền.",
          "**Bay cùng người khác** — mối quan hệ ấy đang cho bạn cảm giác mở rộng, được là chính mình.",
        ],
      },
      {
        kind: "h",
        text: "Lời khuyên dịu dàng",
      },
      {
        kind: "p",
        text:
          "Nếu bạn vừa bay trong mơ, đừng vội quên. Người bay được trong mơ thường là người trong đời thực còn giữ một niềm tin trẻ thơ rằng — đời này còn rộng hơn những gì ta đang sống. Hãy nuôi niềm tin đó, dù chỉ một ngọn lửa nhỏ.",
      },
    ],
  },

  {
    slug: "rung-rang",
    title: "Rụng răng — nỗi sợ mất kiểm soát",
    symbol: "Rụng răng",
    eyebrow: "Lo âu · Cơ thể",
    excerpt:
      "Đây là một trong những giấc mơ gây hoang mang nhất, và cũng phổ biến nhất. Người Việt nghe nhiều: \"rụng răng là sắp có tang\" — nhưng tâm lý học hiện đại có cách đọc khác, ấm áp hơn rất nhiều.",
    readTime: 7,
    tags: ["Lo âu", "Mất mát", "Chuyển giao"],
    accent: "#c97b9b",
    glyph: "tooth",
    image: "",
    imageAlt: "Răng rụng — nỗi sợ mất kiểm soát",
    sections: [
      {
        kind: "h",
        text: "Dân gian nói gì",
      },
      {
        kind: "p",
        text:
          "Câu \"mơ rụng răng — chết người thân\" phổ biến đến mức nhiều người mơ xong sợ cả ngày. Thực ra, đây là cách dân gian gán nghĩa cho một biểu tượng quá mạnh mà họ chưa có ngôn ngữ tâm lý để gọi tên. Răng — phần cơ thể cứng cáp nhất — rụng đi, thì đó là dấu hiệu của mất mát quan trọng. Câu chuyện \"tang\" chỉ là một cách gọi tên cụ thể.",
      },
      {
        kind: "h",
        text: "Tâm lý học: Răng là quyền lực",
      },
      {
        kind: "p",
        text:
          "Răng trong phân tâm học liên kết với khả năng \"cắn\" được vào đời — tự bảo vệ, tự nuôi sống, nói lên tiếng nói của mình. Mơ rụng răng thường xuất hiện khi người mơ đang cảm thấy mất quyền lực: bị áp lực công việc, cảm thấy không được lắng nghe, đang trong giai đoạn lão hoá, hoặc sắp phải chia tay một vai trò quan trọng.",
      },
      {
        kind: "p",
        text:
          "Nó cũng có thể đến vào giai đoạn chuyển giao thực sự — sinh con (mất tự do cá nhân để có một gia đình mới), nghỉ hưu, đổi nghề. Đó là khi \"phiên bản cũ\" của bạn đang được tiễn đi.",
      },
      {
        kind: "h",
        text: "Đọc từng kịch bản",
      },
      {
        kind: "list",
        items: [
          "**Răng rụng từng cái một, không đau** — một chương đang khép lại. Cảm thấy mất, nhưng cũng nhẹ.",
          "**Răng rụng nhiều, máu chảy** — nỗi lo âu đang dồn nén. Hãy hỏi: tuần qua bạn có dám nói ra điều mình thực sự cần không?",
          "**Bạn nhổ răng bằng tay mình** — bạn đang chủ động kết thúc một điều gì đó. Cảm xúc lẫn lộn là bình thường.",
          "**Răng giả, răng nhai khác lạ** — bạn đang nghi ngờ tính \"thật\" của một phần đời mình (công việc, quan hệ).",
        ],
      },
      {
        kind: "h",
        text: "Lời khuyên dịu dàng",
      },
      {
        kind: "p",
        text:
          "Đừng để câu \"sắp có tang\" làm bạn sợ. Nếu bạn vừa mơ rụng răng, điều cần làm không phải kiểm tra điện thoại xem có ai vừa đi — mà là hỏi mình: tôi đang mất gì? Mất quyền lực, mất tiếng nói, mất sự trẻ trung, hay mất một vai trò? Khi bạn gọi tên được nó, nó thôi không còn hiện về trong mơ nữa.",
      },
    ],
  },

  {
    slug: "ca-chep",
    title: "Cá chép — kiên nhẫn của người vượt vũ môn",
    symbol: "Cá chép",
    eyebrow: "Phấn đấu · Phước lành",
    excerpt: "Trong văn hoá Việt, cá chép không chỉ là cá. Nó là câu chuyện cổ tích về sự kiên nhẫn và biến hoá — và mỗi lần nó bơi vào giấc mơ bạn, là một lời chúc ngầm.",
    readTime: 5,
    tags: ["Phấn đấu", "Phước lành", "Kiên nhẫn"],
    accent: "#e8a86c",
    glyph: "fish",
    image: "",
    imageAlt: "Cá chép vượt vũ môn",
    upcoming: true,
  },

  {
    slug: "lua",
    title: "Lửa — đam mê, giận dữ, và sự thiêu rụi cần thiết",
    symbol: "Lửa",
    eyebrow: "Ngũ hành · Hoả",
    excerpt: "Lửa trong mơ là một biểu tượng kép. Nó có thể là đam mê, sáng tạo, sự sống — nhưng cũng có thể là cơn giận âm thầm cháy âm ỉ trong bạn.",
    readTime: 6,
    tags: ["Đam mê", "Giận dữ", "Tái sinh"],
    accent: "#e25a4a",
    glyph: "flame",
    image: "",
    imageAlt: "Ngọn lửa — đam mê và tái sinh",
    upcoming: true,
  },

  {
    slug: "nguoi-da-mat",
    title: "Người đã mất — khi vô thức gọi tên lòng thương",
    symbol: "Người đã mất",
    eyebrow: "Mất mát · Lòng thương",
    excerpt: "Mơ thấy người thân đã khuất là một trong những giấc mơ chạm tới đáy lòng nhất. Đây không phải là điềm — đây là một cuộc trò chuyện mà tâm bạn đang cần.",
    readTime: 8,
    tags: ["Mất mát", "Lòng thương", "Chữa lành"],
    accent: "#8ca8c9",
    glyph: "moon",
    image: "",
    imageAlt: "Vầng trăng tưởng nhớ",
    upcoming: true,
  },

  {
    slug: "lac-duong",
    title: "Lạc đường — bản đồ nội tâm đang được vẽ lại",
    symbol: "Lạc đường",
    eyebrow: "Hoang mang · Định hướng",
    excerpt: "Lạc đường trong mơ hiếm khi nói về địa lý. Nó nói về việc bạn đang đứng giữa một ngã ba của đời mình — và đang lắng nghe phương nào để rẽ.",
    readTime: 6,
    tags: ["Định hướng", "Hoang mang", "Chuyển giao"],
    accent: "#6fb1a3",
    glyph: "compass",
    image: "",
    imageAlt: "La bàn — bản đồ nội tâm",
    upcoming: true,
  },
];

// === Decorative glyphs for each article ===
const ArticleGlyph = ({ kind, accent = "var(--gold)" }) => {
  const s = 120;
  const stroke = accent;
  const sw = 1.4;
  switch (kind) {
    case "wave":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 12 50 Q 30 38 48 50 T 84 50 T 120 50" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M 0 66 Q 24 54 48 66 T 96 66 T 144 66" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.7" strokeLinecap="round" />
          <path d="M 12 82 Q 30 70 48 82 T 84 82 T 120 82" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.45" strokeLinecap="round" />
        </svg>
      );
    case "snake":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 30 30 C 60 30, 30 60, 60 60 C 90 60, 60 90, 90 90" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <circle cx="30" cy="30" r="3" fill={stroke} />
          <path d="M 90 90 L 96 88 M 90 90 L 96 92" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <circle cx="60" cy="60" r="2" fill={stroke} opacity="0.6" />
        </svg>
      );
    case "bird":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 30 70 Q 45 50 60 65 Q 75 50 90 70" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M 60 65 L 60 80" stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" />
          <path d="M 56 80 L 60 86 L 64 80" stroke={stroke} strokeWidth={sw * 0.7} strokeLinecap="round" fill="none" />
          <circle cx="60" cy="50" r="3" fill="none" stroke={stroke} strokeWidth="0.8" />
        </svg>
      );
    case "tooth":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 42 40 Q 42 32 52 32 Q 60 32 60 38 Q 60 32 68 32 Q 78 32 78 40 Q 78 64 70 84 Q 66 90 62 76 Q 60 64 58 76 Q 54 90 50 84 Q 42 64 42 40 Z" fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
        </svg>
      );
    case "fish":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 30 60 Q 50 40 80 60 Q 50 80 30 60 Z" fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <path d="M 80 60 L 96 48 L 96 72 Z" fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="44" cy="56" r="2" fill={stroke} />
        </svg>
      );
    case "flame":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 60 24 Q 50 44 56 56 Q 44 50 46 70 Q 48 88 60 92 Q 72 88 74 70 Q 76 50 64 56 Q 70 44 60 24 Z" fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="60" cy="76" r="6" fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 76 36 A 30 30 0 1 0 76 84 A 24 24 0 1 1 76 36 Z" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="34" cy="44" r="1.4" fill={stroke} />
          <circle cx="42" cy="80" r="1.2" fill={stroke} />
          <circle cx="92" cy="58" r="1.2" fill={stroke} />
        </svg>
      );
    case "compass":
      return (
        <svg viewBox="0 0 120 120" width={s} height={s} aria-hidden="true">
          <circle cx="60" cy="60" r="40" fill="none" stroke={stroke} strokeWidth={sw} />
          <circle cx="60" cy="60" r="56" fill="none" stroke={stroke} strokeWidth="0.6" opacity="0.5" />
          <path d="M 60 28 L 66 60 L 60 92 L 54 60 Z" fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx="60" cy="60" r="3" fill={stroke} />
        </svg>
      );
    default:
      return null;
  }
};

// Inline-bold for **text** within paragraphs
const renderRich = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i} className="rich-bold">{p.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
};

// === Blog index (list of articles) ===
const PageGiaiMa = ({ go }) => {
  const onCardClick = (slug) => go(`/giai-ma/${slug}`);

  return (
    <div className="page-shell blog-shell">
      <div className="page-header">
        <Reveal>
          <div className="eyebrow">
            <span className="dot"></span>
            Tủ sách giải mã · Giấc mơ theo biểu tượng
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="page-title">
            Mỗi biểu tượng <em>là một câu chuyện</em>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="page-sub">
            Những bài viết dài về các biểu tượng giấc mơ phổ biến — đọc từ góc nhìn dân gian Việt, tâm lý học hiện đại, và cách áp dụng vào cuộc sống thực. Đọc chậm. Ngẫm chậm.
          </p>
        </Reveal>
      </div>

      <Reveal delay={220}>
        <div className="blog-grid">
          {BLOG_ARTICLES.map((a, i) => (
            <article
              key={a.slug}
              className={`blog-card ${a.upcoming ? "is-upcoming" : ""}`}
              onClick={() => !a.upcoming && onCardClick(a.slug)}
              style={{ "--accent": a.accent }}
            >
              <div className={`blog-card-cover ${a.image ? "has-image" : ""}`}>
                {a.image ? (
                  <img src={a.image} alt={a.imageAlt || a.title} loading="lazy" />
                ) : (
                  <div className="blog-card-glyph">
                    <ArticleGlyph kind={a.glyph} accent={a.accent} />
                  </div>
                )}
              </div>
              <div className="blog-card-body">
                <div className="blog-card-eyebrow">{a.eyebrow}</div>
                <h2 className="blog-card-title">{a.title}</h2>
                <p className="blog-card-excerpt">{a.excerpt}</p>
                <div className="blog-card-meta">
                  <div className="blog-card-tags">
                    {a.tags.map((t) => (
                      <span key={t} className="blog-tag">{t}</span>
                    ))}
                  </div>
                  <div className="blog-card-time">
                    {a.upcoming ? (
                      <span className="upcoming-pill">Đang biên soạn</span>
                    ) : (
                      <span>{a.readTime} phút đọc →</span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal delay={320}>
        <div className="blog-bottom-note">
          <div className="eyebrow"><span className="dot"></span>Còn nhiều hơn nữa</div>
          <p>
            Tủ sách sẽ liên tục mở rộng — mỗi tuần một bài viết về một biểu tượng mới.
            Nếu bạn đang tìm một biểu tượng cụ thể chưa có ở đây, hãy dùng{" "}
            <a href="#/thu-vien" onClick={(e) => { e.preventDefault(); go("/thu-vien"); }}>
              thư viện biểu tượng
            </a>{" "}
            hoặc thử kể giấc mơ trực tiếp ở{" "}
            <a href="#/" onClick={(e) => { e.preventDefault(); go("/"); }}>
              ô giải mã
            </a>
            .
          </p>
        </div>
      </Reveal>
    </div>
  );
};

// === Blog article detail ===
const PageGiaiMaArticle = ({ slug, go }) => {
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="page-shell blog-shell">
        <div className="blog-404">
          <div className="eyebrow"><span className="dot"></span>Không tìm thấy</div>
          <h1 className="page-title">Bài viết này chưa có ở đây</h1>
          <p className="page-sub">Có thể đường dẫn đã đổi. Hãy quay lại tủ sách.</p>
          <button className="btn btn-primary" onClick={() => go("/giai-ma")}>
            ← Về tủ sách
          </button>
        </div>
      </div>
    );
  }

  if (article.upcoming) {
    return (
      <div className="page-shell blog-shell">
        <div className="blog-article">
          <button className="blog-back" onClick={() => go("/giai-ma")}>← Tủ sách</button>
          <div className="blog-article-head" style={{ "--accent": article.accent }}>
            {article.image ? (
              <div className="blog-article-cover has-image">
                <img src={article.image} alt={article.imageAlt || article.title} />
              </div>
            ) : (
              <div className="blog-article-glyph">
                <ArticleGlyph kind={article.glyph} accent={article.accent} />
              </div>
            )}
            <div className="eyebrow">{article.eyebrow}</div>
            <h1 className="page-title">{article.title}</h1>
            <p className="page-sub">{article.excerpt}</p>
          </div>
          <div className="blog-coming">
            <div className="eyebrow"><span className="dot"></span>Đang biên soạn</div>
            <p>Bài viết này đang được viết. Trong lúc đó, bạn có thể tra cứu nhanh biểu tượng{" "}
              <a href="#/thu-vien" onClick={(e) => { e.preventDefault(); go("/thu-vien"); }}>
                <strong>{article.symbol}</strong>
              </a>{" "}
              trong thư viện.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell blog-shell">
      <article className="blog-article">
        <button className="blog-back" onClick={() => go("/giai-ma")}>← Tủ sách</button>

        <header className="blog-article-head" style={{ "--accent": article.accent }}>
          {article.image ? (
            <div className="blog-article-cover has-image">
              <img src={article.image} alt={article.imageAlt || article.title} />
            </div>
          ) : (
            <div className="blog-article-glyph">
              <ArticleGlyph kind={article.glyph} accent={article.accent} />
            </div>
          )}
          <div className="eyebrow">{article.eyebrow}</div>
          <h1 className="page-title">{article.title}</h1>
          <p className="page-sub">{article.excerpt}</p>
          <div className="blog-article-meta">
            <span>{article.readTime} phút đọc</span>
            <span className="dot-sep">·</span>
            <div className="blog-card-tags">
              {article.tags.map((t) => (
                <span key={t} className="blog-tag">{t}</span>
              ))}
            </div>
          </div>
        </header>

        <div className="blog-article-body">
          {article.sections.map((s, i) => {
            if (s.kind === "h") {
              return <h3 key={i} className="blog-h">{s.text}</h3>;
            }
            if (s.kind === "p") {
              return <p key={i} className="blog-p">{renderRich(s.text)}</p>;
            }
            if (s.kind === "list") {
              return (
                <ul key={i} className="blog-list">
                  {s.items.map((it, j) => (
                    <li key={j}>{renderRich(it)}</li>
                  ))}
                </ul>
              );
            }
            if (s.kind === "quote") {
              return <blockquote key={i} className="blog-quote">{s.text}</blockquote>;
            }
            return null;
          })}
        </div>

        <footer className="blog-article-foot">
          <div className="eyebrow"><span className="dot"></span>Tiếp tục đọc</div>
          <div className="blog-related">
            {BLOG_ARTICLES.filter((a) => a.slug !== article.slug && !a.upcoming)
              .slice(0, 3)
              .map((a) => (
                <a
                  key={a.slug}
                  href={`#/giai-ma/${a.slug}`}
                  className="blog-related-item"
                  onClick={(e) => { e.preventDefault(); go(`/giai-ma/${a.slug}`); }}
                  style={{ "--accent": a.accent }}
                >
                  <div className="blog-related-glyph">
                    {a.image ? (
                      <img src={a.image} alt={a.imageAlt || a.title} loading="lazy" />
                    ) : (
                      <ArticleGlyph kind={a.glyph} accent={a.accent} />
                    )}
                  </div>
                  <div>
                    <div className="blog-card-eyebrow">{a.eyebrow}</div>
                    <div className="blog-related-title">{a.title}</div>
                  </div>
                </a>
              ))}
          </div>

          <div className="blog-cta-strip">
            <div>
              <div className="eyebrow"><span className="dot"></span>Hoặc</div>
              <h3 className="blog-cta-title">Kể lại giấc mơ của bạn — Panharmon sẽ lắng nghe.</h3>
            </div>
            <button className="btn btn-primary" onClick={() => go("/")}>
              Giải mã ngay
              <ArrowIcon />
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
};

Object.assign(window, { BLOG_ARTICLES, PageGiaiMa, PageGiaiMaArticle, ArticleGlyph });
