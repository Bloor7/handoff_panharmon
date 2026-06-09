# Prompt cho Claude Code — Tái dựng Panharmon trên Next.js

> **Cách dùng:** Mở Claude Code trong một thư mục trống → paste toàn bộ nội dung file này làm prompt đầu tiên. Claude Code sẽ đọc các file kèm theo (`README.md`, `ARCHITECTURE.md`, `source/`) và bắt đầu dựng dự án.

---

Tôi đang chuyển một **prototype web design** (làm bằng React + Babel inline) thành một **dự án Next.js production**. Toàn bộ thiết kế gốc nằm trong thư mục `source/` của handoff package này.

## Mục tiêu

Tái dựng **đúng 100%** giao diện, hành vi, animation, state của:

1. **`source/index.html`** — Web app chính (desktop + responsive mobile). 7 routes, bao gồm trang chủ với hero/process/lenses/interpreter, blog list + detail, gói sản phẩm + Sleep Goods, **thư viện trống đồng tương tác** (radial tree 18 nhánh × 6302 biểu tượng), Iris floating chat.
2. **`source/mobile/mobile-screens.html`** — 6 mockup màn hình mobile (Home, Giải mã input, Kết quả, Tủ sách, Thư viện wheel + popup + zoom, Iris chat). Đây là **đặc tả thiết kế cho phần mobile** — bạn cần tích hợp behavior này vào responsive layout của Next.js app, không phải dựng thành màn hình riêng.

## Stack bắt buộc

- **Next.js 14+ với App Router** (`app/` directory)
- **TypeScript** (`.tsx`)
- **Tailwind CSS** + global CSS variables cho design tokens (`@theme` hoặc `:root`)
- **`next/font`** cho Google Fonts (Cormorant Garamond, Be Vietnam Pro)
- **Anthropic SDK** (`@anthropic-ai/sdk`) qua API route — thay thế `window.claude.complete`
- **Framer Motion** cho animation phức tạp (drum ring spin, reveal-on-scroll, popup transitions)
- **localStorage** cho persistence (placed cards, Iris history, translation cache)

## Quy trình làm việc

1. **ĐỌC ĐẦY ĐỦ trước khi code:**
   - `README.md` (overview + design tokens + Next.js plan)
   - `ARCHITECTURE.md` (component-by-component breakdown, state, animation)
   - `source/index.html` + tất cả file `.jsx` trong `source/`
   - `source/styles.css` (3500+ dòng — toàn bộ visual language)
   - `source/mobile/*.jsx` (mobile spec)
2. **Lên kế hoạch trước khi viết code:** liệt kê các route, các component, các API route cần tạo. Confirm với tôi trước khi bắt đầu code.
3. **Triển khai theo từng phase:** (a) setup + tokens + layout shell, (b) routes tĩnh (home, sản phẩm, liên hệ, FAQ), (c) blog + Iris chat, (d) thư viện trống đồng (phức tạp nhất), (e) responsive mobile refinement.
4. **Đối chiếu pixel-perfect:** sau mỗi component, mở `source/index.html` và mockup mobile để so sánh. Mọi giá trị (màu, spacing, animation duration, easing curve) phải khớp.

## Quy tắc tuyệt đối

- ❌ **KHÔNG được tự sáng tạo** màu, font, spacing, layout, animation. Mọi giá trị đều phải lấy từ `source/styles.css` hoặc inline style trong `.jsx`.
- ❌ **KHÔNG được đơn giản hoá** animation hoặc state. Nếu prototype có 3 lớp easing, output cũng phải có 3 lớp.
- ❌ **KHÔNG được rút gọn copy tiếng Việt**. Mọi đoạn văn, button label, eyebrow, placeholder phải copy nguyên văn.
- ✅ **Được phép cải tiến:** chia file lớn thành component nhỏ hơn, dùng TypeScript types, dùng Tailwind utility thay cho custom CSS *khi giá trị giống hệt token*, route via Next App Router thay vì hash-based router.
- ✅ **Bắt buộc:** thay `window.claude.complete(...)` bằng fetch tới `/api/claude` route — route này dùng `@anthropic-ai/sdk` với model `claude-haiku-4-5`, max_tokens 1024, đọc API key từ `process.env.ANTHROPIC_API_KEY`.

## Output mong đợi

Một dự án Next.js hoàn chỉnh, chạy được bằng `npm run dev`, có:

- `app/layout.tsx` — shell với navbar, footer, Iris floating chat, decorative drum-rings, star field
- `app/page.tsx` — trang chủ (Hero + Process + Lenses + Interpreter)
- `app/giai-ma/page.tsx` + `app/giai-ma/[slug]/page.tsx` — blog list + detail
- `app/san-pham/page.tsx` — 3 tier products + Sleep Goods grid
- `app/thu-vien/page.tsx` — trống đồng tree + bàn rút thẻ + popup branch + zoom card
- `app/lien-he/page.tsx`, `app/faq/page.tsx`
- `app/api/claude/route.ts` — proxy tới Anthropic SDK
- `components/` — tách rõ các React component (use client khi cần)
- `lib/` — hooks (`usePlacedCards`, `useTranslationCache`), data fetchers
- `public/library-data.json` — copy nguyên từ `source/library-data.json`
- `styles/globals.css` — token + base styles + animation keyframes
- `tailwind.config.ts` — alias các token CSS variables
- `.env.local.example` — `ANTHROPIC_API_KEY=`
- `README.md` — hướng dẫn chạy dự án

---

**Bắt đầu bằng cách đọc `README.md` rồi `ARCHITECTURE.md`. Sau đó báo lại kế hoạch của bạn trước khi viết code.**

## BỔ SUNG QUY TẮC PRODUCTION, CMS, UX/UI & TECHNICAL SEO (KHÔNG THAY THẾ QUY TẮC GỐC)

> Đây là lớp yêu cầu production để chuyển prototype thành website thật có thể scale, SEO mạnh, quản trị nội dung và deploy production. **Không được xung đột hoặc ghi đè quy tắc pixel-perfect đã nêu ở trên.** Nếu có mâu thuẫn: **giữ nguyên UI/animation gốc nhưng implement bằng kiến trúc production-friendly hơn.**

---

# 1. Kiến trúc tổng thể (bắt buộc)

Dự án phải bao gồm:

1. **Frontend public website**
2. **CMS/Admin dashboard**
3. **Supabase backend**
4. **Technical SEO production-ready**
5. **Google-friendly rendering**

Toàn bộ nằm trong **1 project Next.js App Router duy nhất**.

Cấu trúc route đề xuất:

```txt
app/
│
├── (public)
│   ├── page.tsx
│   ├── blog/
│   ├── giai-ma/
│   ├── thu-vien/
│   ├── faq/
│   └── ...
│
├── admin/
│   ├── login/
│   ├── dashboard/
│   ├── posts/
│   ├── categories/
│   ├── media/
│   ├── seo/
│   └── settings/
│
├── api/
│   ├── anthropic/
│   ├── revalidate/
│   └── og/
│
components/
lib/
types/
hooks/
services/
```

Không tạo nhiều repo riêng.

Không dùng headless CMS bên ngoài.

---

# 2. Database & CMS (Supabase bắt buộc)

Sử dụng **Supabase PostgreSQL** làm backend.

Phải chuẩn bị schema production-ready.

Ít nhất cần:

```txt
users
roles
posts
categories
tags
seo_metadata
dream_symbols
library_items
media
faq
quotes
ai_logs
settings
```

### CMS phải có:

* CRUD bài viết
* CRUD category/tag
* Upload media
* SEO editor
* Draft / Published
* Slug auto-generate
* Scheduled publish ready
* Preview mode
* Search/filter
* Pagination
* Rich text editor

### Rich editor:

Ưu tiên `Tiptap`.

Editor phải hỗ trợ:

* heading
* image
* quote
* callout
* table
* FAQ block
* internal link
* metadata preview

---

# 3. Rendering strategy (SEO cực kỳ quan trọng)

## Tuyệt đối KHÔNG làm SPA-only.

### Bắt buộc:

* Server Components mặc định
* SSR hoặc SSG/ISR cho content page
* HTML render đầy đủ trước khi hydration
* Nội dung chính tồn tại khi JavaScript bị tắt

### KHÔNG được:

```tsx
'use client'
useEffect(() => fetchContent())
```

cho content SEO.

Google phải nhìn thấy:

* heading
* text
* image
* internal link
* metadata

ngay trong HTML source.

Client component chỉ dùng cho:

* animation
* popup
* drag
* zoom
* local state
* interactive library

---

# 4. Technical SEO bắt buộc (production-grade)

Website phải pass checklist technical SEO production.

## Bắt buộc có:

### Crawlability

* robots.txt
* sitemap.xml dynamic
* image sitemap
* canonical URL
* redirect http → https
* non-www/www canonical consistency

### Metadata

* unique title
* unique meta description
* Open Graph
* Twitter Card
* auto OG image
* metadata API chuẩn Next.js

### Semantic HTML

Bắt buộc dùng:

```html
<header>
<nav>
<main>
<section>
<article>
<aside>
<footer>
```

Không div soup.

### Heading hierarchy

* 1 H1 duy nhất
* H2/H3 logic
* không skip hierarchy

### Structured Data

Implement JSON-LD:

* Organization
* WebSite
* BreadcrumbList
* BlogPosting
* FAQPage
* Article
* Product (nếu có)
* SearchAction

### URL structure

SEO-friendly:

```txt
/blog/[slug]
/giai-ma/[slug]
/thu-vien/[slug]
```

Không query params vô nghĩa.

### Accessibility SEO

* alt image meaningful
* aria-label
* keyboard navigation
* focus state visible
* contrast đạt WCAG

---

# 5. Core Web Vitals

Mục tiêu production:

### Mobile:

* LCP < 2.5s
* CLS < 0.1
* INP < 200ms

### Desktop:

90+ Lighthouse

### Bắt buộc:

* next/image
* font optimization
* lazy loading đúng chỗ
* dynamic import cho interactive heavy component
* cache strategy hợp lý

Không lazy-load nội dung SEO chính.

---

# 6. UX/UI rules (bắt buộc)

## UX consistency

### Người dùng phải hiểu website trong 3 giây.

Hero phải trả lời:

1. Đây là gì?
2. Dùng để làm gì?
3. CTA là gì?

### Rule:

1 screen = 1 primary CTA.

---

## Popup / modal behavior

### Bắt buộc:

✅ click outside backdrop để đóng popup

✅ ESC để đóng

✅ mobile swipe-down close nếu phù hợp

✅ trap focus accessibility

✅ body scroll lock

❌ không tạo modal “kẹt” không thoát được

Nếu prototype hiện tại không có close behavior, hãy thêm behavior UX-friendly mà không phá UI gốc.

---

## Form UX

* validation realtime
* loading state
* disabled state
* error state rõ ràng
* success feedback

Không silent fail.

---

## Navigation

* tối đa 3 click tới content chính
* breadcrumb
* related content
* internal linking logic

---

## Mobile-first

Thiết kế phải responsive thật, không chỉ scale nhỏ.

Bắt buộc:

* touch target ≥ 44px
* sticky CTA khi cần
* readable typography
* spacing nhất quán

---

# 7. CMS security

Admin route:

```txt
/admin
```

### Auth:

Supabase Auth

### Role:

* admin
* editor
* viewer

Middleware bảo vệ route admin.

Không expose admin content public.

---

# 8. Không được phá design gốc

Nếu có conflict giữa:

* UX production
* technical SEO
* animation fidelity
* visual fidelity

Thứ tự ưu tiên:

1. Visual fidelity
2. Interaction fidelity
3. SEO safety
4. Performance optimization

Nhưng luôn cố đạt tất cả.

Trước khi code:
phải trình bày kế hoạch architecture đầy đủ (routes, database, CMS, SEO strategy, rendering strategy, animation migration strategy).

