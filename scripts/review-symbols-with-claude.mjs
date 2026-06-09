import fs from "node:fs";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";

const root = process.cwd();
const taggedPath = path.join(root, "symbols-tagged.json");
const untaggedPath = path.join(root, "symbols-untagged.json");
const taggedOutPath = path.join(root, "symbols-tagged-reviewed.json");
const untaggedOutPath = path.join(root, "symbols-untagged-reviewed.json");

const batchSize = Number(process.env.SYMBOL_REVIEW_BATCH_SIZE || 8);
const limit = Number(process.env.SYMBOL_REVIEW_LIMIT || 0);
const target = process.env.SYMBOL_REVIEW_TARGET || "all"; // all | tagged | untagged

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY. Add it to your shell or .env.local before running this script.");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function cleanDefinition(value = "") {
  return String(value)
    .replace(/\s*TOP\s*/gi, " ")
    .replace(/\*\*See The Meaning In Action:[\s\S]*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function loadOrSeed(sourcePath, outPath) {
  if (fs.existsSync(outPath)) return readJson(outPath);
  const source = readJson(sourcePath);
  writeJson(outPath, source);
  return source;
}

const tagged = loadOrSeed(taggedPath, taggedOutPath);
const untagged = loadOrSeed(untaggedPath, untaggedOutPath);
const tags = tagged.tags;
const allowedTags = tags.map((tag) => tag.key);

function needsReview(entry, requireTags) {
  if (!entry.v || !entry.d_vi) return true;
  if (requireTags && (!Array.isArray(entry.g) || entry.g.length === 0)) return true;
  return false;
}

function pickJobs() {
  const jobs = [];
  if (target === "all" || target === "tagged") {
    tagged.entries.forEach((entry, index) => {
      if (needsReview(entry, false)) jobs.push({ dataset: "tagged", entry, index });
    });
  }
  if (target === "all" || target === "untagged") {
    untagged.entries.forEach((entry, index) => {
      if (needsReview(entry, true)) jobs.push({ dataset: "untagged", entry, index });
    });
  }
  return limit > 0 ? jobs.slice(0, limit) : jobs;
}

function buildPrompt(items) {
  const tagList = tags.map((tag) => `- ${tag.key}: ${tag.vi}`).join("\n");
  const symbols = items
    .map((job, i) => {
      const entry = job.entry;
      return `${i + 1}. term: ${entry.t}
current_vietnamese_name: ${entry.v || ""}
current_tags: ${(entry.g || []).join(", ")}
english_definition: ${cleanDefinition(entry.d).slice(0, 1100)}`;
    })
    .join("\n\n");

  return `Bạn là biên tập viên từ điển biểu tượng giấc mơ cho Panharmon.

Nhiệm vụ:
1. Dịch term sang tên tiếng Việt tự nhiên, ngắn gọn, ưu tiên từ phổ thông. Nếu tên hiện có chưa tự nhiên, sửa lại.
2. Dịch định nghĩa tiếng Anh sang tiếng Việt ấm, rõ, trung thành ý gốc, 2-4 câu. Không mê tín hóa quá mức.
3. Chọn 1-3 nhánh cảm xúc phù hợp từ danh sách tag được phép. Với mục đã có tag, có thể giữ hoặc chỉnh nếu tag sai.

Tag được phép:
${tagList}

Trả về DUY NHẤT JSON array, không markdown, không giải thích.
Mỗi phần tử đúng schema:
{
  "i": 1,
  "t": "term gốc",
  "v": "tên tiếng Việt",
  "d_vi": "định nghĩa tiếng Việt",
  "g": ["tag-key-1", "tag-key-2"]
}

Danh sách cần rà soát:
${symbols}`;
}

async function reviewBatch(batch) {
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content: buildPrompt(batch) }]
  });
  const raw = response.content.find((block) => block.type === "text")?.text || "";
  const match = raw.match(/\[[\s\S]*\]/);
  if (!match) throw new Error(`Bad JSON response: ${raw.slice(0, 400)}`);
  const parsed = JSON.parse(match[0]);
  if (!Array.isArray(parsed)) throw new Error("Response is not an array");
  return parsed;
}

function applyReviewed(batch, reviewed) {
  for (const item of reviewed) {
    const idx = (Number(item.i) || 0) - 1;
    const job = batch[idx];
    if (!job) continue;
    const validTags = Array.isArray(item.g) ? item.g.filter((key) => allowedTags.includes(key)).slice(0, 3) : [];
    const dataset = job.dataset === "tagged" ? tagged : untagged;
    const entry = dataset.entries[job.index];
    entry.v = String(item.v || entry.v || entry.t).trim();
    entry.d_vi = String(item.d_vi || entry.d_vi || "").trim();
    entry.g = validTags.length ? validTags : entry.g || [];
    entry.reviewed = true;
    entry.reviewed_at = new Date().toISOString();
  }
}

const jobs = pickJobs();
console.log(`Review jobs: ${jobs.length}. target=${target}, batchSize=${batchSize}, limit=${limit || "none"}`);

for (let i = 0; i < jobs.length; i += batchSize) {
  const batch = jobs.slice(i, i + batchSize);
  try {
    const reviewed = await reviewBatch(batch);
    applyReviewed(batch, reviewed);
    writeJson(taggedOutPath, tagged);
    writeJson(untaggedOutPath, untagged);
    console.log(`Reviewed ${Math.min(i + batch.length, jobs.length)} / ${jobs.length}`);
  } catch (error) {
    writeJson(taggedOutPath, tagged);
    writeJson(untaggedOutPath, untagged);
    console.error(`Stopped at batch ${i / batchSize + 1}:`, error);
    process.exit(1);
  }
}

console.log("Review complete.");
