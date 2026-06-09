import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceTaggedPath = path.join(root, "symbols-tagged.json");
const sourceUntaggedPath = path.join(root, "symbols-untagged.json");
const outTaggedPath = path.join(root, "symbols-tagged-reviewed.json");
const outUntaggedPath = path.join(root, "symbols-untagged-reviewed.json");
const tagged = JSON.parse(fs.readFileSync(sourceTaggedPath, "utf8"));
const untagged = JSON.parse(fs.readFileSync(sourceUntaggedPath, "utf8"));
const now = new Date().toISOString();

const batchSize = Number(process.env.STATIC_TRANSLATE_BATCH_SIZE || 12);
const limit = Number(process.env.STATIC_TRANSLATE_LIMIT || 0);
const delayMs = Number(process.env.STATIC_TRANSLATE_DELAY_MS || 180);

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

function cleanDef(value = "") {
  return String(value).replace(/\s*TOP\s*$/i, "").trim();
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

function seed(dataset) {
  return {
    ...dataset,
    tags: dataset.tags || tagged.tags,
    entries: dataset.entries.map((entry) => ({
      ...entry,
      d: cleanDef(entry.d),
      d_vi: entry.d_vi || null,
      g: scoreTags(entry),
      reviewed: Boolean(entry.v && entry.d_vi),
      reviewed_at: entry.reviewed_at || null
    }))
  };
}

let taggedOut = fs.existsSync(outTaggedPath) ? JSON.parse(fs.readFileSync(outTaggedPath, "utf8")) : seed(tagged);
let untaggedOut = fs.existsSync(outUntaggedPath) ? JSON.parse(fs.readFileSync(outUntaggedPath, "utf8")) : seed(untagged);

function save() {
  fs.writeFileSync(outTaggedPath, JSON.stringify(taggedOut, null, 2), "utf8");
  fs.writeFileSync(outUntaggedPath, JSON.stringify(untaggedOut, null, 2), "utf8");
}

function needsTranslation(entry) {
  return needsNameTranslation(entry) || !entry.d_vi || entry.reviewed_by === "local-static-rules";
}

function collectJobs() {
  const jobs = [];
  taggedOut.entries.forEach((entry, index) => {
    if (needsTranslation(entry)) jobs.push({ dataset: "tagged", index, entry });
  });
  untaggedOut.entries.forEach((entry, index) => {
    if (needsTranslation(entry)) jobs.push({ dataset: "untagged", index, entry });
  });
  return limit > 0 ? jobs.slice(0, limit) : jobs;
}

function splitTerm(term) {
  return String(term).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
}

function needsNameTranslation(entry) {
  const name = String(entry.v || "").trim();
  return !name || /^Biểu tượng\s+/i.test(name) || /^[A-Za-z][A-Za-z\s'’().,-]*$/.test(name);
}

function polishName(value, term) {
  const name = String(value || "").replace(/\s+/g, " ").trim();
  if (!name) return splitTerm(term);
  if (/^[a-z]$/i.test(term)) return `Chữ ${String(term).toUpperCase()}`;
  return name
    .replace(/^Một\s+/i, "")
    .replace(/^Một\s+/i, "")
    .replace(/^Các\s+/i, "")
    .replace(/^Những\s+/i, "")
    .replace(/^Biểu tượng\s+/i, "")
    .trim();
}

async function translateText(text) {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "en");
  url.searchParams.set("tl", "vi");
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  let lastError;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`translate ${response.status}`);
      const json = await response.json();
      return json?.[0]?.map((part) => part?.[0] || "").join("").trim();
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function translateEntry(entry) {
  const name = needsNameTranslation(entry) ? polishName(await translateText(splitTerm(entry.t)), entry.t) : entry.v;
  const def = entry.d_vi && entry.reviewed_by !== "local-static-rules" ? entry.d_vi : await translateText(cleanDef(entry.d));
  return {
    ...entry,
    v: name,
    d_vi: def,
    g: scoreTags(entry),
    reviewed: true,
    reviewed_at: now,
    reviewed_by: "static-google-translate"
  };
}

async function run() {
  const jobs = collectJobs();
  console.log(`Static translate jobs: ${jobs.length}`);
  for (let i = 0; i < jobs.length; i += batchSize) {
    const batch = jobs.slice(i, i + batchSize);
    const translated = await Promise.all(batch.map(async (job) => ({ job, entry: await translateEntry(job.entry) })));
    for (const { job, entry } of translated) {
      const target = job.dataset === "tagged" ? taggedOut : untaggedOut;
      target.entries[job.index] = entry;
    }
    save();
    console.log(`Translated ${Math.min(i + batch.length, jobs.length)}/${jobs.length}`);
    if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  save();
  console.log(JSON.stringify({
    total: taggedOut.entries.length + untaggedOut.entries.length,
    missing_v: [...taggedOut.entries, ...untaggedOut.entries].filter((entry) => !entry.v).length,
    missing_d_vi: [...taggedOut.entries, ...untaggedOut.entries].filter((entry) => !entry.d_vi).length,
    missing_g: [...taggedOut.entries, ...untaggedOut.entries].filter((entry) => !entry.g?.length).length
  }, null, 2));
}

run().catch((error) => {
  save();
  console.error(error);
  process.exit(1);
});
