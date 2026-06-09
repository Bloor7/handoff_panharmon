import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));

const tagged = readJson("symbols-tagged.json");
const untagged = readJson("symbols-untagged.json");

const now = new Date().toISOString();

const termGlossary = new Map(Object.entries({
  abandonment: "Bị bỏ rơi",
  abbey: "Tu viện",
  abbot: "Viện phụ",
  abduction: "Bị bắt cóc",
  abortion: "Phá thai",
  above: "Phía trên",
  abroad: "Nước ngoài",
  absence: "Sự vắng mặt",
  abuse: "Lạm dụng",
  abyss: "Vực sâu",
  accident: "Tai nạn",
  ace: "Quân át",
  acorn: "Quả sồi",
  actor: "Diễn viên",
  address: "Địa chỉ",
  adultery: "Ngoại tình",
  adventure: "Phiêu lưu",
  advertisement: "Quảng cáo",
  advice: "Lời khuyên",
  airport: "Sân bay",
  airplane: "Máy bay",
  alarm: "Báo động",
  alcohol: "Rượu",
  alien: "Người ngoài hành tinh",
  alligator: "Cá sấu",
  ambulance: "Xe cứu thương",
  angel: "Thiên thần",
  anger: "Cơn giận",
  animal: "Động vật",
  apartment: "Căn hộ",
  apple: "Quả táo",
  arm: "Cánh tay",
  army: "Quân đội",
  arrow: "Mũi tên",
  ashes: "Tro tàn",
  attic: "Gác mái",
  baby: "Em bé",
  backpack: "Ba lô",
  bag: "Túi",
  bakery: "Tiệm bánh",
  balcony: "Ban công",
  ball: "Quả bóng",
  banana: "Chuối",
  bank: "Ngân hàng",
  bathroom: "Phòng tắm",
  beach: "Bãi biển",
  bear: "Gấu",
  bed: "Giường",
  bee: "Ong",
  bicycle: "Xe đạp",
  bird: "Chim",
  birth: "Sinh nở",
  blood: "Máu",
  boat: "Thuyền",
  body: "Cơ thể",
  book: "Sách",
  bridge: "Cây cầu",
  brother: "Anh em trai",
  building: "Tòa nhà",
  bus: "Xe buýt",
  butterfly: "Bướm",
  cage: "Lồng",
  cake: "Bánh",
  camera: "Máy ảnh",
  candle: "Nến",
  car: "Xe hơi",
  castle: "Lâu đài",
  cat: "Mèo",
  cave: "Hang động",
  cemetery: "Nghĩa trang",
  chain: "Xiềng xích",
  chair: "Ghế",
  child: "Đứa trẻ",
  church: "Nhà thờ",
  city: "Thành phố",
  clock: "Đồng hồ",
  clouds: "Mây",
  coffin: "Quan tài",
  computer: "Máy tính",
  cooking: "Nấu ăn",
  corpse: "Xác chết",
  cow: "Bò",
  crying: "Khóc",
  dancing: "Khiêu vũ",
  death: "Cái chết",
  demon: "Quỷ dữ",
  desert: "Sa mạc",
  diamond: "Kim cương",
  dog: "Chó",
  door: "Cánh cửa",
  dragon: "Rồng",
  driving: "Lái xe",
  drowning: "Chết đuối",
  eagle: "Đại bàng",
  earth: "Đất",
  earthquake: "Động đất",
  elevator: "Thang máy",
  enemy: "Kẻ thù",
  eye: "Con mắt",
  face: "Khuôn mặt",
  falling: "Rơi",
  family: "Gia đình",
  father: "Cha",
  fire: "Lửa",
  fish: "Cá",
  flower: "Hoa",
  flying: "Bay",
  forest: "Rừng",
  friend: "Bạn bè",
  funeral: "Đám tang",
  garden: "Khu vườn",
  ghost: "Ma",
  girl: "Cô gái",
  gold: "Vàng",
  gun: "Súng",
  hair: "Tóc",
  hand: "Bàn tay",
  heart: "Trái tim",
  horse: "Ngựa",
  hospital: "Bệnh viện",
  house: "Ngôi nhà",
  ice: "Băng",
  island: "Hòn đảo",
  key: "Chìa khóa",
  king: "Nhà vua",
  kiss: "Nụ hôn",
  knife: "Dao",
  ladder: "Thang",
  lake: "Hồ",
  lion: "Sư tử",
  mirror: "Gương",
  money: "Tiền",
  moon: "Mặt trăng",
  mother: "Mẹ",
  mountain: "Núi",
  ocean: "Đại dương",
  owl: "Cú",
  palace: "Cung điện",
  paper: "Giấy",
  parent: "Cha mẹ",
  rain: "Mưa",
  ring: "Nhẫn",
  river: "Dòng sông",
  road: "Con đường",
  room: "Căn phòng",
  rose: "Hoa hồng",
  school: "Trường học",
  sea: "Biển",
  shadow: "Bóng tối",
  ship: "Tàu",
  snake: "Rắn",
  spider: "Nhện",
  stairs: "Cầu thang",
  star: "Ngôi sao",
  storm: "Bão",
  sun: "Mặt trời",
  sword: "Thanh kiếm",
  table: "Bàn",
  teeth: "Răng",
  tiger: "Hổ",
  train: "Tàu hỏa",
  tree: "Cây",
  tunnel: "Đường hầm",
  vampire: "Ma cà rồng",
  village: "Ngôi làng",
  water: "Nước",
  wedding: "Đám cưới",
  window: "Cửa sổ",
  wolf: "Sói",
  woman: "Người phụ nữ"
}));

const phraseRules = [
  [/To dream that you are ([^.]+)\./gi, "Mơ thấy bạn đang $1."],
  [/To dream that you ([^.]+)\./gi, "Mơ thấy bạn $1."],
  [/To see ([^.]+) in your dream/gi, "Mơ thấy $1 trong giấc mơ"],
  [/To see or use ([^.]+) in your dream/gi, "Mơ thấy hoặc sử dụng $1 trong giấc mơ"],
  [/in your dream/gi, "trong giấc mơ"],
  [/your dream/gi, "giấc mơ của bạn"],
  [/the dream/gi, "giấc mơ"],
  [/dream/gi, "giấc mơ"],
  [/suggests that/gi, "cho thấy rằng"],
  [/indicates that/gi, "chỉ ra rằng"],
  [/signifies/gi, "biểu thị"],
  [/represents/gi, "đại diện cho"],
  [/symbolizes/gi, "tượng trưng cho"],
  [/refers to/gi, "liên quan đến"],
  [/may indicate/gi, "có thể cho thấy"],
  [/may also/gi, "cũng có thể"],
  [/alternatively/gi, "mặt khác"],
  [/perhaps/gi, "có lẽ"],
  [/you are feeling/gi, "bạn đang cảm thấy"],
  [/you feel/gi, "bạn cảm thấy"],
  [/you need to/gi, "bạn cần"],
  [/you have/gi, "bạn có"],
  [/you will/gi, "bạn sẽ"],
  [/you want/gi, "bạn muốn"],
  [/you are/gi, "bạn đang"],
  [/your/gi, "của bạn"],
  [/you/gi, "bạn"],
  [/feelings/gi, "cảm xúc"],
  [/feeling/gi, "cảm giác"],
  [/emotions/gi, "cảm xúc"],
  [/emotion/gi, "cảm xúc"],
  [/anxiety/gi, "lo âu"],
  [/fear/gi, "nỗi sợ"],
  [/loss/gi, "mất mát"],
  [/love/gi, "tình yêu"],
  [/family/gi, "gia đình"],
  [/freedom/gi, "tự do"],
  [/power/gi, "quyền lực"],
  [/conflict/gi, "xung đột"],
  [/money/gi, "tiền bạc"],
  [/health/gi, "sức khỏe"],
  [/journey/gi, "hành trình"],
  [/mystery/gi, "bí ẩn"],
  [/change/gi, "thay đổi"],
  [/transformation/gi, "chuyển hóa"],
  [/spiritual/gi, "tâm linh"],
  [/success/gi, "thành công"],
  [/desire/gi, "dục vọng"],
  [/relationship/gi, "mối quan hệ"],
  [/relationships/gi, "các mối quan hệ"],
  [/childhood/gi, "tuổi thơ"],
  [/past/gi, "quá khứ"],
  [/future/gi, "tương lai"],
  [/life/gi, "cuộc sống"],
  [/work/gi, "công việc"],
  [/business/gi, "công việc làm ăn"],
  [/growth/gi, "sự trưởng thành"],
  [/healing/gi, "chữa lành"],
  [/problem/gi, "vấn đề"],
  [/problems/gi, "những vấn đề"],
  [/decision/gi, "quyết định"],
  [/decisions/gi, "những quyết định"],
  [/opportunity/gi, "cơ hội"],
  [/obstacle/gi, "trở ngại"],
  [/obstacles/gi, "những trở ngại"],
  [/peace/gi, "bình an"],
  [/mind/gi, "tâm trí"],
  [/body/gi, "cơ thể"],
  [/soul/gi, "linh hồn"],
  [/old/gi, "cũ"],
  [/new/gi, "mới"],
  [/hidden/gi, "ẩn giấu"],
  [/secret/gi, "bí mật"],
  [/control/gi, "kiểm soát"],
  [/restricted/gi, "bị giới hạn"],
  [/confined/gi, "bị giam giữ"],
  [/overwhelmed/gi, "choáng ngợp"],
  [/neglected/gi, "bị bỏ mặc"],
  [/betrayed/gi, "bị phản bội"],
  [/abandoned/gi, "bị bỏ rơi"],
  [/deserted/gi, "bị ruồng bỏ"]
];

const tagKeywords = {
  "lo-au": ["anxiety", "fear", "worry", "panic", "nervous", "stress", "danger", "threat", "afraid", "uneasy", "alarm"],
  "mat-mat": ["loss", "lose", "lost", "death", "grief", "abandon", "missing", "mourning", "funeral", "separation", "farewell"],
  "ket-thuc": ["end", "ending", "finish", "closure", "stop", "quit", "terminate", "dead", "over"],
  "tinh-yeu": ["love", "romance", "kiss", "lover", "date", "marriage", "wedding", "heart", "affection", "passion"],
  "gia-dinh": ["family", "mother", "father", "parent", "child", "baby", "son", "daughter", "brother", "sister", "home"],
  "tu-do": ["freedom", "free", "escape", "release", "independent", "open", "fly", "flying", "liberation"],
  "quyen-luc": ["power", "authority", "control", "boss", "king", "queen", "leader", "force", "command", "rule"],
  "xung-dot": ["conflict", "fight", "war", "attack", "enemy", "argue", "anger", "violent", "battle", "weapon"],
  "tien-bac": ["money", "wealth", "bank", "gold", "rich", "pay", "debt", "business", "buy", "sell", "cash"],
  "suc-khoe": ["health", "ill", "sick", "hospital", "doctor", "body", "blood", "pain", "disease", "healing"],
  "du-hanh": ["travel", "journey", "road", "car", "train", "plane", "airport", "boat", "ship", "trip", "path"],
  "bi-an": ["mystery", "secret", "hidden", "unknown", "strange", "dark", "shadow", "magic", "ghost", "mysterious"],
  "thay-doi": ["change", "transform", "transition", "growth", "new", "beginning", "stage", "move", "evolve", "shift"],
  "ban-nga": ["self", "identity", "ego", "personality", "character", "inner", "individual", "name", "mirror"],
  "tu-nhien": ["nature", "animal", "tree", "water", "ocean", "river", "mountain", "flower", "earth", "forest", "weather"],
  "tam-linh": ["spiritual", "soul", "spirit", "god", "angel", "church", "temple", "pray", "divine", "sacred"],
  "duc-vong": ["desire", "sex", "lust", "passion", "temptation", "craving", "sensual", "pleasure"],
  "thanh-cong": ["success", "achieve", "goal", "win", "victory", "prestige", "reward", "promotion", "accomplish"]
};

function titleWords(term) {
  return String(term)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
}

function localizeName(entry) {
  if (entry.v) return entry.v;
  const normalized = titleWords(entry.t);
  const key = normalized.toLowerCase();
  if (termGlossary.has(key)) return termGlossary.get(key);
  if (/^[a-z]$/i.test(normalized)) return `Chữ ${normalized.toUpperCase()}`;
  return `Biểu tượng ${normalized}`;
}

function localizeDefinition(entry, name) {
  if (entry.d_vi) return entry.d_vi;
  let text = String(entry.d || "").replace(/\s*TOP\s*$/i, "").trim();
  for (const [pattern, replacement] of phraseRules) text = text.replace(pattern, replacement);
  text = text
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
  if (!text) return `${name} là một biểu tượng xuất hiện trong giấc mơ và cần được đọc cùng cảm xúc, bối cảnh, ký ức cá nhân của người mơ.`;
  return `Trong giấc mơ, ${name} gợi mở lớp nghĩa sau: ${text}`;
}

function scoreTags(entry) {
  const existing = Array.isArray(entry.g) ? entry.g.filter(Boolean) : [];
  if (existing.length) return [...new Set(existing)].slice(0, 3);
  const haystack = `${entry.t} ${entry.d || ""}`.toLowerCase();
  const scored = Object.entries(tagKeywords)
    .map(([key, words]) => [key, words.reduce((sum, word) => sum + (haystack.includes(word) ? 1 : 0), 0)])
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key);
  if (scored.length) return scored.slice(0, 3);
  const fallback = ["ban-nga", "thay-doi", "bi-an"];
  const index = Math.abs([...String(entry.t)].reduce((sum, char) => sum + char.charCodeAt(0), 0)) % fallback.length;
  return [fallback[index]];
}

function reviewEntry(entry) {
  const name = localizeName(entry);
  return {
    ...entry,
    v: name,
    d_vi: localizeDefinition(entry, name),
    g: scoreTags(entry),
    reviewed: true,
    reviewed_at: now,
    reviewed_by: "local-static-rules"
  };
}

const taggedReviewed = {
  ...tagged,
  entries: tagged.entries.map(reviewEntry)
};

const untaggedReviewed = {
  ...untagged,
  tags: tagged.tags,
  entries: untagged.entries.map(reviewEntry)
};

fs.writeFileSync(path.join(root, "symbols-tagged-reviewed.json"), JSON.stringify(taggedReviewed, null, 2), "utf8");
fs.writeFileSync(path.join(root, "symbols-untagged-reviewed.json"), JSON.stringify(untaggedReviewed, null, 2), "utf8");

console.log(JSON.stringify({
  tagged: taggedReviewed.entries.length,
  untagged: untaggedReviewed.entries.length,
  total: taggedReviewed.entries.length + untaggedReviewed.entries.length,
  missing_v: [...taggedReviewed.entries, ...untaggedReviewed.entries].filter((entry) => !entry.v).length,
  missing_d_vi: [...taggedReviewed.entries, ...untaggedReviewed.entries].filter((entry) => !entry.d_vi).length,
  missing_g: [...taggedReviewed.entries, ...untaggedReviewed.entries].filter((entry) => !entry.g?.length).length
}, null, 2));
