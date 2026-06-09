# ARCHITECTURE.md — Breakdown chi tiết từng file

> Đọc kèm `README.md`. File này đi sâu vào từng file `.jsx` gốc, kê khai exports, state, side-effects, animations.

---

## `app.jsx` — App shell + Router

**Exports:** `App` (default render target)

**Cấu trúc:**
- `useHashRoute()` hook → `[route, go]`. Hash-based — trên Next.js, thay bằng `usePathname()` + `useRouter().push()`.
- `<App>` render:
  - `<StarField />` (canvas fixed background)
  - 2 `<DrumRing>` decorative (tl + br corners)
  - `<nav className="nav">` sticky top — brand, 4 nav links, CTA "Giải mã ngay"
  - `<main className="shell" key={route}>` — **key={route} để re-mount Reveal cho mỗi page nav** (animation lại từ đầu)
  - Route switch tay (if/else) — convert sang file-based routing
  - `<footer>` foot-inner
  - `<Iris />` (floating, không thuộc main)

**Routes hiện tại:**
| Hash | Component |
|---|---|
| `/` | `<HomePage>` |
| `/giai-ma` | `<PageGiaiMa>` |
| `/giai-ma/<slug>` | `<PageGiaiMaArticle>` |
| `/san-pham` | `<PageSanPham>` |
| `/thu-vien` | `<PageThuVienTree>` |
| `/lien-he` | `<PageLienHe>` |
| `/faq` | `<PageFAQ>` |

**`HomePage`** (định nghĩa trong app.jsx, ~250 dòng):
- Hero section (full xem README §6.2)
- Process section (3 steps + 2 dashed connectors)
- Lenses section (3 lens-card với blockquote)
- "giai-ma" anchor section chứa `<Interpreter />`

**CTA "Giải mã ngay" trên nav:** nếu đang ở route "/" → `scrollIntoView` đến `#giai-ma`; ngược lại `go("/")` rồi `setTimeout(scroll, 60)`. Trên Next.js: dùng `useRouter` + check `usePathname()`.

---

## `sections.jsx` — Products (cũ) + ContactBlock

**Exports:** `Products`, `ContactBlock`

**Note:** `Products` ở đây là phiên bản cũ. Trang sản phẩm hiện dùng `PageSanPham` từ `pages.jsx`. **Bỏ qua `Products` của `sections.jsx`.**

**ContactBlock:**
- 2 column grid: `.contact-info` (h3 + 3 contact rows: email, hotline, trụ sở) + `.contact-form` (4 field + submit)
- State `submitted` — sau submit, đổi button label trong 4s
- Form chưa wire backend — confirm với user.

---

## `pages.jsx` — Pages tĩnh

**Exports:** `PageSanPham`, `PageThuVien` (cũ, không dùng), `PageLienHe`, `PageFAQ`, `PageShell`, `ArrowIcon`, `SleepGoods`

### `PageSanPham`
- `tiers` array — 3 gói. Mỗi gói có `image: ""` + `imageAlt` (placeholder slot).
- Render `.product-grid` với 3 `.product-card`, gói "Trăng Tròn" có `featured` class + `.product-tag` badge "Phổ biến".
- Mỗi card render `<div class="product-cover has-image"><img></div>` chỉ khi `t.image` không rỗng.
- Compare table 5 row (Giải mã/ngày, Thư viện biểu tượng, Phân tích ngũ hành, Phiên 1:1, Báo cáo in).
- CTA strip cuối + `<SleepGoods />`.

### `SleepGoods`
- `items` array — 6 vật phẩm (Sổ Mộng, Tinh Dầu Đêm Nguyệt, ...). Mỗi item có inline SVG `glyph` + `image: ""` + `imageAlt`.
- `.sleep-grid` responsive — auto-fill 280px min. Mỗi card có:
  - `<div class="sleep-cover has-image">` nếu có image, fallback `<div class="sleep-glyph">{glyph}</div>`
  - `.sleep-body` — eyebrow + h3 + p
  - `.sleep-foot` — `.sleep-price` + nút "Đặt hàng" (chưa wire backend)
- `.sleep-note` cuối — cam kết handmade VN.

### `PageLienHe`, `PageFAQ`, `PageShell`
- `PageShell` là wrapper: eyebrow + h1 + sub + children. Mọi page dùng nó.
- `PageFAQ` = empty state "Đang được biên soạn" + SVG question mark.

### `ArrowIcon`
- Reusable arrow → dùng trong mọi button. Trong Next.js: tách thành `<ArrowIcon />` component shared.

---

## `blog.jsx` — Tủ sách giải mã

**Exports:** `BLOG_ARTICLES`, `PageGiaiMa`, `PageGiaiMaArticle`, `ArticleGlyph`

### `BLOG_ARTICLES` schema
```ts
type Article = {
  slug: string;              // url-safe
  title: string;
  symbol: string;            // tên ngắn của biểu tượng
  eyebrow: string;           // "Ngũ hành · Thủy"
  excerpt: string;           // 2-3 câu mở
  readTime: number;          // phút
  tags: string[];            // 3 tag
  accent: string;            // hex color
  glyph: 'wave'|'snake'|'bird'|'tooth'|'fish'|'flame'|'moon'|'compass';
  image?: string;            // optional cover img path
  imageAlt?: string;
  sections?: Section[];      // khi không có là 'upcoming'
  upcoming?: boolean;
};

type Section =
  | { kind: 'h'; text: string }       // sub-heading
  | { kind: 'p'; text: string }       // paragraph, supports **bold**
  | { kind: 'list'; items: string[] } // bullet list, mỗi item supports **bold**
  | { kind: 'quote'; text: string };
```

### `ArticleGlyph`
8 SVG hand-drawn glyph (120×120), accept `kind` + `accent`. Mỗi glyph là 1 case trong switch:
- `wave` — 3 sóng nước
- `snake` — đường lượn S với đầu rắn
- `bird` — chim Lạc đơn giản với cánh + thân
- `tooth` — răng cách điệu
- `fish` — cá đơn giản
- `flame` — ngọn lửa
- `moon` — trăng khuyết + sao xung quanh
- `compass` — la bàn

### `PageGiaiMa` (list)
- `.blog-grid` 1 col mobile, auto-fill desktop
- Mỗi `.blog-card` 140px glyph + body (eyebrow, h2, excerpt, meta row với tags + read time)
- `.blog-card.is-upcoming` opacity 0.55 + cursor default
- Cover image render qua `.blog-card-cover` mới — fallback glyph khi `a.image` rỗng

### `PageGiaiMaArticle` (detail)
- Header với eyebrow + h1 + excerpt + meta row (read time + tags) + cover hoặc article glyph (140×140)
- Body: render sections theo `kind`
- `renderRich(text)` — split `**text**` → wrap `<strong>`
- Foot: 3 related articles + cta-strip "Kể lại giấc mơ của bạn"

---

## `interpreter.jsx` — Component giải mã giấc mơ

**Exports:** `Interpreter`

**State:**
```ts
text: string         // initial = sessionStorage["prefillDream"] || ""
loading: boolean
result: { title, essence, symbols[], emotion, advice } | null
error: string | null
```

**Side-effects:**
- Mount: nếu có prefillDream → set text, focus textarea, đặt cursor cuối
- Cmd/Ctrl+Enter → `interpret()`
- Quick tag click → append " {tag.toLowerCase()}"
- "Lấy ví dụ" → random từ `SAMPLE_DREAMS` (3 ví dụ)

**`interpret()` flow:**
1. Build prompt (~300 chars) yêu cầu Claude trả về JSON với 5 field
2. `await window.claude.complete(prompt)` → trên Next.js: `fetch('/api/claude', { method:'POST', body: JSON.stringify({prompt}) })`
3. Regex match `/\{[\s\S]*\}/` extract JSON, parse
4. Set result hoặc error

**Render result card** (`.interp-result`):
- h4 title
- p essence
- p advice (italic, border-left gold 2px)
- meta-row: Biểu tượng + Cảm xúc

---

## `iris.jsx` — Floating chat companion

**Exports:** `Iris`, `IrisMark`

**State:**
```ts
open: boolean
messages: [{ role: 'user'|'assistant', content: string }]
input: string
pending: boolean
unread: boolean
```

**localStorage:** `iris.history.v1` (keep 30 turns).

**Greeting** (khi không có history): `"Iris đây. Bạn có thể kể cho mình một giấc mơ, hoặc hỏi bất cứ điều gì về cõi mộng."`

**System prompt** (constant `IRIS_SYSTEM`):
- Persona Iris (entity giấc mơ)
- Tiếng Việt ấm, ngắn (1-3 câu)
- Không emoji
- Tri thức: Jung + dân gian Việt + văn hoá Á Đông
- Đôi khi hỏi ngược để khơi gợi

**`send()` flow:**
1. Append user message
2. Build prompt: `IRIS_SYSTEM + "\n---\n" + recent.slice(-12).map(m => "Role: content").join("\n\n") + "\n\nIris:"`
3. `await window.claude.complete({ messages: [{role:'user', content: builtPrompt}] })` → Next.js: gửi `messages` array tới `/api/claude`
4. Trim, remove "Iris:" prefix nếu có, set assistant message
5. Nếu panel đóng → set unread=true

**UI:**
- `.iris-bubble` — 56px FAB bottom-left fixed, gold gradient bg, IrisMark glyph
- Khi `open` → render `.iris-bubble.open` (X icon) + `.iris-panel`
- `.iris-panel` — 320×480, fixed bottom-left, glass background
- Header: avatar + "Iris" + "người bạn đồng hành cõi mộng" + clear button (confirm dialog → reset history)
- Body: messages render, mỗi message có bubble + (assistant chỉ) name label
- Pending: typing indicator (`<span class="loading-dots">`)
- Input: textarea + send button (Enter = send, Shift+Enter = newline)
- Unread red dot ngoài bubble

**`IrisMark` glyph:** 24×24 SVG — outer circle + iris circle + pupil + 8 petal rays radiating outward.

---

## `tree.jsx` — Mộng Triệu Tree (PHỨC TẠP NHẤT)

**Exports:** `MongTrieuTree`, `MongTrieuPanel`, `PanelRow`, `loadCache`, `saveCache`, `translateBatch`, `queueTranslation`, `useLibData`

### `useLibData()` hook
`fetch('library-data.json')` → `{data, error}`. Trên Next.js: cùng pattern, fetch `/library-data.json` từ public.

### `MongTrieuTree` component
Render SVG 1240×880 viewBox với toàn bộ vòng họa tiết trống đồng. Đọc chi tiết trong file gốc — code đã có generators cho:
- `sunRays` (14 tia)
- `innerDots` (48 chấm vòng trong)
- `sawtooth` (path 36 răng cưa)
- `spirals` (24 S-spirals)
- `midDots` (60 chấm giữa)
- `lacBirds` (12 chim Lạc, dùng `<LacBirdPath />` từ `patterns.jsx`)
- `finalDots` (80 chấm ngoài cùng)
- `tagPositions` (18 tag, position trên `R.tagRing=258`)

**Interactive states:**
- `hover: string | null` — key của tag đang hover
- `active: string | null` — key của tag đang mở popup (prop từ parent)
- Click tag → `onOpenBranch(tag)` callback. Nếu đang active → `onOpenBranch(null)` (toggle close).
- Escape key → close.

**Visual transitions:**
- Trunk lines (`.mt-trunk`): default opacity 0.4 → `.on` opacity 1 stroke-width 2 → `.dim` opacity 0.15
- Tag node: halo radius 38 (subtle), bg circle 26, ring 26 (stroke `--accent`), gem 5 (fill accent), label
- Active tag: ring stroke-width tăng, halo opacity tăng
- Aurora veil: `<radialGradient id="mt-aurora">` rect overlay khi có active

**Hint dưới wheel:**
- Default: `"6,302 biểu tượng • 18 nhánh cảm xúc — chạm nhánh để mở danh sách thẻ"`
- Active: `"394 biểu tượng trong "Lo âu" — đang mở danh sách"`

### Translation queue
- `_queue: { entries, cb }[]` global
- `queueTranslation(entries, cb)` push + debounce 80ms
- `flushQueue()` — collect unique, filter cached, batch by 10, gọi `translateBatch()` cho mỗi batch
- `translateBatch(entries)` build prompt yêu cầu Claude trả JSON array `[{i, name, def}]`, parse, return `{en: {name, def}}`
- Cache save sau mỗi batch

Trên Next.js: queue logic giữ nguyên ở client component, chỉ replace `window.claude.complete` bằng `fetch('/api/claude')`.

### `MongTrieuPanel` (legacy — không dùng trong flow mới)
Side panel cũ — đã bị thay bằng `BranchPopup`. Chỉ tham khảo, không port.

---

## `tree-page.jsx` — Page wrapper cho thư viện

**Exports:** `EntryDrawer`, `PageThuVienTree`

### `EntryDrawer` (legacy — không dùng nữa)
Drawer cũ. Có thể bỏ.

### `PageThuVienTree`
Logic page chính cho `/thu-vien`:

**State:**
- `activeTag` — tag object đang mở popup (set bởi `MongTrieuTree`)
- `placed` — instance của `usePlacedCards()` hook
- `data, error` — từ `useLibData()`

**Side-effects:**
- Khi `data` ready: build `window.libTagsByKey = { key: tag }` cho child lookup.
- Khi mở 1 tag: pre-warm translate 20 entries đầu (queue, không block UI).

**Derived:**
- `placedEntries` — hydrate keys → entry objects
- `activeEntries` — filter `data.entries` theo `activeTag.key`, sort desc theo độ dài definition

**Actions:**
- `placeCard(entry)`:
  - Nếu đã placed → toast "X đã ở trên bàn"
  - Nếu bàn đầy → toast "Bàn đã có 5 lá..."
  - Ngược lại: `placed.add` + toast "Đã đặt X vào bàn" + close popup
- `decodeOne(entry)`: set prefillDream → navigate "/"
- `decodeAll()`: build text từ N entry → set prefillDream → navigate "/". Single: `"Tôi mơ thấy X..."`. Multiple: `"Trong giấc mơ của tôi xuất hiện A, B và C..."`

**Render:**
1. `PageShell` với eyebrow + h1 + sub
2. `LibrarySearch` toolbar (chưa định nghĩa ở file này — xem `library.jsx` để confirm, hoặc tự build) + status pill "Bàn rút N/5"
3. `<MongTrieuTree>` 
4. `<PlacedTable>` 
5. Conditional `<BranchPopup>` khi `activeTag`
6. `<Toast />` global

---

## `library-popup.jsx` — Popup flow mới

**Exports:** `BranchPopup`, `SymbolZoom`, `PopupCard`, `PlacedTable`, `PlacedCard`, `Toast`, `showToast`, `usePlacedCards`, `PLACED_LIMIT`

### `PLACED_LIMIT = 5`

### `usePlacedCards()`
```ts
return {
  keys: string[],
  add: (key) => boolean,    // false if full or duplicate
  remove: (key) => void,
  clear: () => void,
  has: (key) => boolean,
  isFull: boolean,
  count: number,
  limit: number,
}
```
- localStorage key `panharmon.placedCards.v1`
- `storage` event listener cho cross-tab sync

### `<Toast />`
- Listen `window` event `panharmon-toast` (custom event với `detail` = message)
- Render `.ph-toast` với dot + message
- Auto-dismiss 2.4s

### `showToast(msg)`
Helper: `window.dispatchEvent(new CustomEvent('panharmon-toast', { detail: msg }))`

### `<PopupCard>`
1 card trong popup grid:
- IntersectionObserver — chỉ trigger translate khi vào viewport (rootMargin 300px)
- Trên translate xong: update name từ `entry.v` → translated name
- Render: chữ cái đầu (l) + name VN + EN slug + "Đã đặt" pill nếu placed
- onClick → `onClick()` callback (open zoom)
- Stagger animation: `animationDelay: index * 16ms` (max 30 cards)

### `<SymbolZoom>` (tarot card overlay)
- Render trong cùng `.bp-modal`, full-overlay với `.bp-zoom-layer`
- Click backdrop (`e.target === e.currentTarget`) → `onBack()`
- Tarot card visual (`.bp-zoom-card`):
  - `tarot-arch` top + bottom (SVG path đỉnh cong)
  - Top-left + bottom-right chữ cái đầu (mirror)
  - Eye: dot + tag label
  - Tên VN (h3 lớn 32-36px serif italic)
  - EN slug nhỏ
  - 3 tag chips
  - Definition (loading dots khi đang dịch)
- 2 button bên dưới:
  - "Đặt vào bàn" — primary, disabled khi placed hoặc isFull
  - "Xem thẻ khác" — ghost (back arrow)
- Note nếu full: "Bàn rút đã đủ 5 lá — mở thêm chỗ với gói thành viên (sắp ra mắt)"

### `<BranchPopup>`
Full-screen modal:

**State:**
- `zoomed: entry | null` — entry đang zoom
- `query: string` — search input
- `namesRef` — useRef cache (preload từ `loadCache()`)

**Side-effects:**
- Lock body scroll on mount
- Escape: nếu có zoomed → close zoom; else close popup

**Render:**
- `.bp-backdrop` (`100dvh`, overflow hidden, backdrop-blur)
- `.bp-modal` (`calc(100dvh - 48px)`, flex column, max-width 1200px)
- Header (grid 4 col): mark (chữ cái) + titles (eyebrow + h2 + meta) + search + close
- `.bp-grid-wrap` (flex:1, overflow-y:auto, scrollbar-color: gold-soft)
- `.bp-grid` (auto-fill 180px, gap 12px)
- Search filter (lowercase match VN name hoặc EN)
- Empty state: "Không có biểu tượng nào khớp..."
- Conditional `<SymbolZoom>` overlay khi zoomed

### `<PlacedCard>`
- Width 132-180px, tarot card visual (giống SymbolZoom nhưng nhỏ hơn)
- Tilt: `style={{ "--tilt": ${i*3.2}deg }}` → rotate trong CSS
- Nút remove top-right (X icon)
- Nút "Dùng lá này giải mã" bottom (full-width pill)

### `<PlacedTable>`
- Header: eyebrow + h2 (động: "Bàn còn trống" / "Những lá bài giấc mộng của bạn")
- "Dọn bàn" button nếu count > 0
- Empty state: 5 ghost slots animated stagger
- Có cards: `.placed-row` flex với cards + ghost slots cho slot trống
- Footer: button "Giải mã với N lá" + hint "Iris sẽ đọc cả bộ lá..."
- Auto-scroll: khi count tăng, scroll mượt đến table

---

## `patterns.jsx` — Decorative SVG

**Exports:** `BrandMark`, `HeroBird`, `DrumRing`, `LacBirdPath`, `Reveal`

### `BrandMark`
36×36 SVG — moon + 14-ray sun → logo Panharmon. Inline trong nav.

### `HeroBird`
Large chim Lạc cách điệu, fade behind hero text. Render qua position absolute.

### `DrumRing`
Decorative ring SVG, used 2x trong layout (`tl` top-left, `br` bottom-right). CSS animation `spin 220s linear infinite`, `br` `animation-direction: reverse`.

### `LacBirdPath`
SVG path của 1 chim Lạc — dùng trong `MongTrieuTree` cho lac-band.

### `<Reveal>`
```ts
<Reveal delay={120}>
  <h1>...</h1>
</Reveal>
```
- IntersectionObserver, threshold 0.1, rootMargin -80px
- On intersect: add `.is-visible` class
- CSS handles transform + opacity transition

Trên Next.js: thay bằng Framer Motion `<motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay,duration:0.6,ease:[0.2,0.7,0.2,1]}}>`.

---

## `starfield.jsx` — Canvas background

**Exports:** `StarField`

- `<canvas className="stars-canvas" />` fixed inset 0
- Generate ~150 stars random position + size + twinkle phase
- RAF loop, sin-wave brightness per star
- Resize listener cho responsive

Trên Next.js: client component, useEffect setup canvas.

---

## `mobile/mobile-ui.jsx` + `mobile/mobile-screens.jsx`

**Mục đích:** mockup tĩnh hiển thị 6 màn hình mobile trong khung iPhone. Cách dùng:

1. **KHÔNG port nguyên thành màn hình riêng** trên Next.js.
2. **Dùng làm spec design** cho responsive `<= 540px` breakpoint của các route tương ứng:
   - `MobileHome` → spec mobile cho `app/page.tsx`
   - `MobileGiaiMa` → spec mobile cho Interpreter input layout (kèm tính năng mới: mood selector 6 chip)
   - `MobileKetQua` → spec mobile cho Interpreter result layout
   - `MobileTuSach` → spec mobile cho `app/giai-ma`
   - `MobileThuVien` + `MobileThuVienPopup` + `MobileThuVienZoom` → spec mobile cho `app/thu-vien`
   - `MobileIris` → spec full-screen takeover của Iris trên mobile

**Atomic components dùng trong mockup (`mobile-ui.jsx`):**
- `.m-screen` — root container
- `.m-top` (top bar 64px padding-top vì status bar) — variants `MTopBrand`, `MTopTitle`
- `.m-tabbar` — sticky bottom 4-tab nav (`MTabBar`)
- `.m-card`, `.m-card-emph` — card variants
- `.m-btn`, `.m-btn-primary`, `.m-btn-ghost`, `.m-btn-full`
- `.m-chip`, `.m-chip.on`, `.m-chip-row`
- `.m-h1`, `.m-h2`, `.m-section-h`, `.m-eyebrow`, `.m-dot`, `.m-mute`
- `.m-iris-fab` — FAB hỏi Iris (góc dưới phải khi không ở màn Iris)
- `MIcon.*` — icon dictionary (search, back, plus, send, mic, share, bookmark, chat, ...)

Style được inject 1 lần qua `<style id="m-styles">` — trên Next.js có thể đặt vào `globals.css` hoặc làm CSS module riêng cho mobile breakpoint.

---

## Notes cuối

- **Direct-edit hook:** prototype có pattern `data-comment-anchor` trên 1 vài element để gắn comment. Không cần port.
- **Smooth scroll:** Hero CTA dùng `scrollIntoView({behavior:'smooth', block:'start'})`. Trên Next.js: dùng `useEffect` + ref, hoặc `<a href="#giai-ma">` nếu cùng route.
- **`window.libTagsByKey` global:** dùng cho child component lookup tag color/label. Trên Next.js: convert thành React Context.
- **`window.claude.complete`:** **3 nơi** dùng — `interpreter.jsx`, `iris.jsx`, `tree.jsx::translateBatch`. **MIGRATE TOÀN BỘ → fetch `/api/claude`.**
- **Hash navigation prefill:** `sessionStorage.setItem("prefillDream", text)` rồi `window.location.hash = "/"`. Trên Next.js: dùng `useRouter().push('/')` sau set sessionStorage. Interpreter mount đọc + clear.

---

**Kết thúc breakdown. Quay lại `README.md` để xem Phase plan + Checklist nghiệm thu.**
