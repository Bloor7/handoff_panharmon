import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
const cleanDef = (value = "") => String(value).replace(/\s*TOP\s*$/i, "").trim();
const firstLetter = (term = "") => (term.trim().charAt(0) || "#").toUpperCase();

const original = readJson("dream_moods_dictionary.json");
const taggedSource = fs.existsSync(path.join(root, "symbols-tagged-reviewed.json"))
  ? "symbols-tagged-reviewed.json"
  : "symbols-tagged.json";
const untaggedSource = fs.existsSync(path.join(root, "symbols-untagged-reviewed.json"))
  ? "symbols-untagged-reviewed.json"
  : "symbols-untagged.json";
const tagged = readJson(taggedSource);
const untagged = readJson(untaggedSource);
const vietnamese = fs.existsSync(path.join(root, "vietnamese-symbols.json"))
  ? readJson("vietnamese-symbols.json")
  : { entries: [], sources: [] };

const taggedByTerm = new Map(tagged.entries.map((entry) => [entry.t, entry]));
const untaggedByTerm = new Map(untagged.entries.map((entry) => [entry.t, entry]));
const vietnameseByTerm = new Map(vietnamese.entries.map((entry) => [entry.t, entry]));
const allTerms = new Set([
  ...original.entries.map((entry) => entry.term),
  ...tagged.entries.map((entry) => entry.t),
  ...untagged.entries.map((entry) => entry.t),
  ...vietnamese.entries.map((entry) => entry.t)
]);

const entries = [...allTerms]
  .sort((a, b) => a.localeCompare(b, "en"))
  .map((term) => {
    const fromTagged = taggedByTerm.get(term);
    const fromUntagged = untaggedByTerm.get(term);
    const fromVietnamese = vietnameseByTerm.get(term);
    const fromOriginal = original.entries.find((entry) => entry.term === term);
    const src = fromVietnamese || fromTagged || fromUntagged;
    return {
      t: term,
      v: src?.v || null,
      l: src?.l || fromOriginal?.letter || firstLetter(term),
      d: cleanDef(src?.d_vi || src?.d || fromOriginal?.definition || ""),
      d_en: cleanDef(src?.d || fromOriginal?.definition || ""),
      g: Array.isArray(src?.g) ? src.g : [],
      source: fromVietnamese ? "vietnamese" : fromTagged ? "tagged" : "untagged",
      cultural_source: src?.cultural_source || null,
      reviewed: Boolean(fromVietnamese || src?.reviewed || src?.d_vi)
    };
  });

const out = {
  source: "Dream Moods + Panharmon emotion tagging",
  tagged_source: taggedSource,
  untagged_source: untaggedSource,
  original_total: original.total_entries || original.entries.length,
  tagged_total: tagged.total || tagged.entries.length,
  untagged_total: untagged.total || untagged.entries.length,
  vietnamese_total: vietnamese.total || vietnamese.entries.length,
  vietnamese_sources: vietnamese.sources || [],
  total: entries.length,
  tags: tagged.tags,
  entries
};

fs.mkdirSync(path.join(root, "public", "data"), { recursive: true });
fs.writeFileSync(path.join(root, "public", "library-data.json"), JSON.stringify(out, null, 2), "utf8");
fs.copyFileSync(path.join(root, "dream_moods_dictionary.json"), path.join(root, "public", "data", "dream_moods_dictionary.json"));
fs.copyFileSync(path.join(root, "symbols-tagged.json"), path.join(root, "public", "data", "symbols-tagged.json"));
fs.copyFileSync(path.join(root, "symbols-untagged.json"), path.join(root, "public", "data", "symbols-untagged.json"));
if (fs.existsSync(path.join(root, "symbols-tagged-reviewed.json"))) {
  fs.copyFileSync(path.join(root, "symbols-tagged-reviewed.json"), path.join(root, "public", "data", "symbols-tagged-reviewed.json"));
}
if (fs.existsSync(path.join(root, "symbols-untagged-reviewed.json"))) {
  fs.copyFileSync(path.join(root, "symbols-untagged-reviewed.json"), path.join(root, "public", "data", "symbols-untagged-reviewed.json"));
}
if (fs.existsSync(path.join(root, "vietnamese-symbols.json"))) {
  fs.copyFileSync(path.join(root, "vietnamese-symbols.json"), path.join(root, "public", "data", "vietnamese-symbols.json"));
}

console.log(JSON.stringify({
  total: out.total,
  original_total: out.original_total,
  tagged_total: out.tagged_total,
  untagged_total: out.untagged_total,
  vietnamese_total: out.vietnamese_total,
  tags: out.tags.length
}, null, 2));
