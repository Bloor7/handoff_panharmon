## 19. PHIÊN NÀY — BẢO MẬT + TỐI ƯU CHI PHÍ + MẠCH GIẤC MƠ + NAV ✅

Tiếp Hướng C. Toàn bộ sửa trong repo `handoff_panharmon` (Next.js 16, Vercel, Supabase). Đều đã type-check (`tsc --noEmit` sạch), test logic bằng PGlite/Node, và test tay runtime trước khi push.

### Đã làm (production, test xanh)

**1. [BẢO MẬT] Khoá `/api/admin/login` chống dò mật khẩu**
- `supabase/admin-throttle.sql` — bảng `admin_login_throttle` + 3 RPC `admin_login_status / admin_login_fail / admin_login_reset`. `security definer`, RLS bật (không policy → chỉ `service_role`), revoke khỏi public. Cùng khuôn `credits.sql`.
- Cơ chế: đếm sai theo **IP**, quá **5 lần / 15 phút → khoá 15 phút** (trả 429 + `Retry-After`). Đăng nhập đúng → xoá bộ đếm.
- `lib/admin-session.ts` — `isAllowedAdmin` giờ **async**, so mật khẩu **constant-time** (SHA-256 hai vế rồi XOR từng byte), luôn chạy kể cả email sai (chống lộ email admin qua timing).
- `app/api/admin/login/route.ts` — viết lại: kiểm khoá → so mật khẩu → sai thì ghi throttle (vượt ngưỡng → 429), đúng thì reset + cấp vé. Lấy IP qua `x-forwarded-for`.
- Test thật: `curl` sai 5 lần → **401 ×4 rồi 429**. ✅

**2. [BẢO MẬT] Form `/api/contact` hết nuốt lead**
- `supabase/contact.sql` — bảng `contact_messages` (CHECK độ dài name/email/topic/message, chống payload khổng lồ; `status` new/read/archived; `meta` jsonb; index created_at desc; RLS bật, chỉ `service_role`).
- `app/api/contact/route.ts` — viết lại: ghi vào Supabase qua service client + `meta {ip, ua}`. **Fail-closed**: DB lỗi → trả 500/503 để khách thử lại, KHÔNG còn giả vờ `ok:true` rồi mất lead.
- Test thật: tin hợp lệ → `{ok:true}` + row vào DB; tin rác → 400. ✅

**3. [CHI PHÍ] Phân tích lời/lỗ — KẾT LUẬN: ĐANG LỜI**
- Giá `claude-haiku-4-5` (tra 06/07/2026): **$1/M input, $5/M output**.
- System prompt thật đo lại: **~5.000 token** (tokenizer o200k) / ~6.500 (tokenizer Claude, tiếng Việt nở). → **Mốc "9.000 token" trong sổ cũ là dư**, chi phí input thấp hơn tưởng.
- 1 credit ≈ 1.000đ ≈ $0.039. Chi phí/lượt đầu ~200–375đ. **Biên gộp 34–88%.**
- **Cảnh báo**: route gửi CẢ lịch sử hội thoại mỗi lượt, nhưng credit chỉ tính theo độ dài giấc mơ mới → hội thoại càng dài, lượt hỏi-lại ngắn càng ăn mòn biên (79% → 34%). Vẫn lời, cần để mắt.

**4. [CHI PHÍ] Bật prompt caching — đòn bẩy #1 (KHÁC giả định sổ cũ)**
- `app/api/claude/route.ts` — thêm `cache_control: {type:"ephemeral"}` vào system block. System prompt cố định 100% → cache đọc lại chỉ tính **10%** giá input. Giảm **~53% chi phí/lượt lặp**, KHÔNG đụng chất lượng, KHÔNG cần logic mới.
- **Kết luận quan trọng**: caching > lọc 81 symbol. Lọc symbol phá cache + cần logic chọn (rủi ro giải nông) + phức tạp. Lọc chỉ nên làm nếu số liệu thật cho thấy đa số là lượt-đơn-lẻ (cache không ăn), và khi đó dùng **keyword match thô, KHÔNG embedding/pgvector**.

**5. [HẠ TẦNG] Tạo bảng `ai_logs` (trước đây route ghi vào bảng KHÔNG tồn tại → log rơi im lặng)**
- `supabase/ai_logs.sql` — bảng `ai_logs` (theo schema) + thêm cột **tách token**: `input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens`. RLS bật, index (feature, created_at). Route giờ ghi đủ các cột này → đo được caching tiết kiệm thật.

**6. [UX] Iris hết nhớ nhầm giấc mơ hôm trước**
- Gốc: mỗi khách chỉ có 1 cuộc "Iris" vĩnh viễn; client luôn nạp + gửi 30 tin cũ → giấc mơ hôm qua lọt vào 12 tin gửi Claude.
- `components/layout/Iris.tsx` — mỗi tin gắn `ts` (thời điểm) + cờ `fresh`; hàm `currentThread()` cắt lấy **mạch hiện tại** (dừng ở khoảng nghỉ >3 tiếng hoặc tin `fresh`). Giấc mơ gửi từ **form trang chủ = mạch mới** (`fresh:true`). Chỉ gửi mạch hiện tại lên Claude. Lịch sử cũ vẫn hiển thị/lưu, chỉ không nhét vào ngữ cảnh. Bonus: giảm token input. KHÔNG đụng server.

**7. [UX] Làm lại phần tài khoản trên nav**
- `components/layout/Nav.tsx` + đoạn CSS thêm cuối `styles/globals.css` — gom credit/tên/nạp/đăng xuất (4 thứ chen vỡ mobile) thành **1 avatar tròn + menu thả** (tên · credit, Nạp credit, Đăng xuất; đóng khi bấm ngoài). Nút "Giải mã ngay" thu còn icon ở ≤760px. Dùng biến CSS sẵn (`--gold`, `--ink`, `--bg-1`, `--line`).

### Quyết định đã chốt (phiên này)
- Rate-limit dùng **Supabase** (không thêm Upstash/Redis) — đúng triết lý ít-dependency; login admin hiếm nên thêm 1 query không sao.
- Đếm khoá **theo IP, không theo email** — tránh kẻ xấu cố tình khoá admin thật (DoS).
- **Fail-open cho login** (thiếu service key → không tự khoá cửa admin), **fail-closed cho contact** (không nuốt lead). Hai hướng ngược nhau, có chủ ý.
- **Caching là đòn bẩy chi phí #1**, không phải lọc symbol (đảo lại giả định BAN_GIAO cũ).
- Định giá theo cảm nhận (độ dài giấc mơ) — giữ nguyên, đang lời tốt.
- Ranh giới mạch giấc mơ = **gap 3h + form fresh**, không thêm nút, không đụng server.

### Còn nợ / phát hiện mới (phiên sau nhặt)
- **Chạy 3 file SQL trên Supabase nếu chưa**: `admin-throttle.sql`, `contact.sql`, `ai_logs.sql`. (admin-throttle + contact đã chạy phiên này; ai_logs chạy khi đè route caching.)
- **Query `ai_logs` lấy token THẬT** → chốt lại kinh tế bằng số thật + xem caching cắt bao nhiêu %:
  `select count(*), round(avg(tokens)), avg(cache_read_tokens), avg(cache_creation_tokens) from public.ai_logs where feature='giai_mo';`
- **Lọc symbol theo keyword**: chỉ làm nếu số liệu thật cho thấy đa số lượt-đơn-lẻ. Keyword match, KHÔNG embedding.
- **CORS + rate-limit cho `/api/claude`** khi lượng khách tăng (chưa làm).
- **Hash mật khẩu admin (bcrypt)** — ưu tiên thấp, để sau.
- **Trang admin đọc `contact_messages`** (giờ phải query tay trong SQL Editor).
- **Nav**: nếm/chỉnh thẩm mỹ (cỡ avatar 38px, màu chữ, ngưỡng thu nút Giải mã ≤760px).
- **[Văn phòng sau]** máy nhà đọc `ai_logs`/`credit_transactions`/`conversations` → báo cáo (chỉ đọc, rủi ro ~0).

### Files phiên này
- SQL (chạy Supabase SQL Editor): `supabase/admin-throttle.sql`, `supabase/contact.sql`, `supabase/ai_logs.sql`.
- Code: `app/api/admin/login/route.ts`, `lib/admin-session.ts`, `app/api/contact/route.ts`, `app/api/claude/route.ts`, `components/layout/Iris.tsx`, `components/layout/Nav.tsx`, `styles/globals.css` (append cuối).
- Mẹo mới: **PGlite** (`@electric-sql/pglite`, Postgres WASM chạy trong Node) để test migration/RPC plpgsql cục bộ trước khi giao — không cần cài Postgres thật.

## 20. PHÁT HIỆN CUỐI PHIÊN (chưa sửa — đưa vào mạch phiên sau)

**A. [BUG THẬT] Mất tin nhắn khi load lại / đăng nhập lại.**
Triệu chứng: các lượt hỏi-lại sau giấc mơ đầu (vd tin "vậy điều này có nghĩa là gì" + bài Iris trả) KHÔNG được lưu — F5 hoặc đăng nhập lại thì mất.
Đã điều tra, LOẠI giả thuyết giới hạn 4000 ký tự (đo reply thật chỉ 2.514 < 4.000). Hai chỗ hở thật:
- **Hở 1 — lưu "xóa sạch rồi ghi lại":** `app/api/conversations/route.ts` PUT xóa hết messages rồi insert lại toàn bộ. Client `Iris.tsx` gọi PUT mỗi lần `messages` đổi (1 lượt = ≥2 PUT: tin user, rồi tin Iris). Các PUT chạy song song, không xếp thứ tự → PUT mang ảnh chụp CŨ tới muộn sẽ xóa tin mới rồi đắp lại bản thiếu → rơi tin.
- **Hở 2 — load đè vô điều kiện:** `onAuthStateChange` (kể cả khi Supabase tự làm mới token định kỳ, hoặc đăng nhập lại) gọi `loadConversation` rồi `setMessages(server)` đè thẳng state đang có. Server thiếu (do Hở 1) → kéo bản thiếu về đè bản đủ → mất, rồi lưu lại bản thiếu → mất vĩnh viễn.
- **Fix đề xuất (đều ở client `components/layout/Iris.tsx`, không cần đụng server):**
  1. Lưu **tuần tự + gộp (debounce ~600ms)**: chỉ 1 PUT in-flight; nếu có thay đổi khi đang bay thì PUT lại với ảnh chụp mới nhất. Hết race.
  2. **Chỉ nạp server MỘT LẦN** lúc vào (dùng ref cờ đã-load); không để token-refresh kéo bản cũ về đè.
  3. (tùy chọn, chắc hơn) đổi server PUT sang **upsert theo id** thay vì delete-all-insert — nhưng client phải gửi id; để sau nếu (1)(2) chưa đủ.
- Lưu ý: fix này chỉ chống mất tin TỪ GIỜ; dữ liệu đã mất trước đó không khôi phục được.

**B. [GIỌNG IRIS] Tinh chỉnh `lib/iris-prompt.ts` (nếm nhiều vòng).** Nhận xét từ 1 giấc mơ thật:
- **Lặp ở lượt hỏi-lại:** khi người mơ hỏi tiếp ("vậy nghĩa là gì"), Iris tóm lại y hệt lượt trước thay vì đào sâu. → thêm luật: khi người mơ hỏi tiếp, KHÔNG tóm lại, chọn một ý đi sâu hoặc mở góc mới.
- **Giọng nghiêng "lên lớp/coach"** ở lượt sau ("bạn có sẵn sàng bước từ mơ ra...", "xây dựng đời sống thực sự"). → hạ bớt, giữ thủ thỉ.
- **Câu hỏi kết trúc trắc, dịch-máy** ("Bạn có muốn gì từ điều này — từ việc tiếp tục nhớ cô ấy theo cách này?"). Gốc: luật "LUÔN khép bằng câu hỏi mở" ép ra câu gượng. → nới thành "có thể khép bằng câu hỏi mở, ngắn, tự nhiên như lời nói thường — không bắt buộc", và dặn tránh cú pháp dịch-máy.
## 19. PHIÊN NÀY — BẢO MẬT + TỐI ƯU CHI PHÍ + MẠCH GIẤC MƠ + NAV ✅

Tiếp Hướng C. Toàn bộ sửa trong repo `handoff_panharmon` (Next.js 16, Vercel, Supabase). Đều đã type-check (`tsc --noEmit` sạch), test logic bằng PGlite/Node, và test tay runtime trước khi push.

### Đã làm (production, test xanh)

**1. [BẢO MẬT] Khoá `/api/admin/login` chống dò mật khẩu**
- `supabase/admin-throttle.sql` — bảng `admin_login_throttle` + 3 RPC `admin_login_status / admin_login_fail / admin_login_reset`. `security definer`, RLS bật (không policy → chỉ `service_role`), revoke khỏi public. Cùng khuôn `credits.sql`.
- Cơ chế: đếm sai theo **IP**, quá **5 lần / 15 phút → khoá 15 phút** (trả 429 + `Retry-After`). Đăng nhập đúng → xoá bộ đếm.
- `lib/admin-session.ts` — `isAllowedAdmin` giờ **async**, so mật khẩu **constant-time** (SHA-256 hai vế rồi XOR từng byte), luôn chạy kể cả email sai (chống lộ email admin qua timing).
- `app/api/admin/login/route.ts` — viết lại: kiểm khoá → so mật khẩu → sai thì ghi throttle (vượt ngưỡng → 429), đúng thì reset + cấp vé. Lấy IP qua `x-forwarded-for`.
- Test thật: `curl` sai 5 lần → **401 ×4 rồi 429**. ✅

**2. [BẢO MẬT] Form `/api/contact` hết nuốt lead**
- `supabase/contact.sql` — bảng `contact_messages` (CHECK độ dài name/email/topic/message, chống payload khổng lồ; `status` new/read/archived; `meta` jsonb; index created_at desc; RLS bật, chỉ `service_role`).
- `app/api/contact/route.ts` — viết lại: ghi vào Supabase qua service client + `meta {ip, ua}`. **Fail-closed**: DB lỗi → trả 500/503 để khách thử lại, KHÔNG còn giả vờ `ok:true` rồi mất lead.
- Test thật: tin hợp lệ → `{ok:true}` + row vào DB; tin rác → 400. ✅

**3. [CHI PHÍ] Phân tích lời/lỗ — KẾT LUẬN: ĐANG LỜI**
- Giá `claude-haiku-4-5` (tra 06/07/2026): **$1/M input, $5/M output**.
- System prompt thật đo lại: **~5.000 token** (tokenizer o200k) / ~6.500 (tokenizer Claude, tiếng Việt nở). → **Mốc "9.000 token" trong sổ cũ là dư**, chi phí input thấp hơn tưởng.
- 1 credit ≈ 1.000đ ≈ $0.039. Chi phí/lượt đầu ~200–375đ. **Biên gộp 34–88%.**
- **Cảnh báo**: route gửi CẢ lịch sử hội thoại mỗi lượt, nhưng credit chỉ tính theo độ dài giấc mơ mới → hội thoại càng dài, lượt hỏi-lại ngắn càng ăn mòn biên (79% → 34%). Vẫn lời, cần để mắt.

**4. [CHI PHÍ] Bật prompt caching — đòn bẩy #1 (KHÁC giả định sổ cũ)**
- `app/api/claude/route.ts` — thêm `cache_control: {type:"ephemeral"}` vào system block. System prompt cố định 100% → cache đọc lại chỉ tính **10%** giá input. Giảm **~53% chi phí/lượt lặp**, KHÔNG đụng chất lượng, KHÔNG cần logic mới.
- **Kết luận quan trọng**: caching > lọc 81 symbol. Lọc symbol phá cache + cần logic chọn (rủi ro giải nông) + phức tạp. Lọc chỉ nên làm nếu số liệu thật cho thấy đa số là lượt-đơn-lẻ (cache không ăn), và khi đó dùng **keyword match thô, KHÔNG embedding/pgvector**.

**5. [HẠ TẦNG] Tạo bảng `ai_logs` (trước đây route ghi vào bảng KHÔNG tồn tại → log rơi im lặng)**
- `supabase/ai_logs.sql` — bảng `ai_logs` (theo schema) + thêm cột **tách token**: `input_tokens, output_tokens, cache_read_tokens, cache_creation_tokens`. RLS bật, index (feature, created_at). Route giờ ghi đủ các cột này → đo được caching tiết kiệm thật.

**6. [UX] Iris hết nhớ nhầm giấc mơ hôm trước**
- Gốc: mỗi khách chỉ có 1 cuộc "Iris" vĩnh viễn; client luôn nạp + gửi 30 tin cũ → giấc mơ hôm qua lọt vào 12 tin gửi Claude.
- `components/layout/Iris.tsx` — mỗi tin gắn `ts` (thời điểm) + cờ `fresh`; hàm `currentThread()` cắt lấy **mạch hiện tại** (dừng ở khoảng nghỉ >3 tiếng hoặc tin `fresh`). Giấc mơ gửi từ **form trang chủ = mạch mới** (`fresh:true`). Chỉ gửi mạch hiện tại lên Claude. Lịch sử cũ vẫn hiển thị/lưu, chỉ không nhét vào ngữ cảnh. Bonus: giảm token input. KHÔNG đụng server.

**7. [UX] Làm lại phần tài khoản trên nav**
- `components/layout/Nav.tsx` + đoạn CSS thêm cuối `styles/globals.css` — gom credit/tên/nạp/đăng xuất (4 thứ chen vỡ mobile) thành **1 avatar tròn + menu thả** (tên · credit, Nạp credit, Đăng xuất; đóng khi bấm ngoài). Nút "Giải mã ngay" thu còn icon ở ≤760px. Dùng biến CSS sẵn (`--gold`, `--ink`, `--bg-1`, `--line`).

### Quyết định đã chốt (phiên này)
- Rate-limit dùng **Supabase** (không thêm Upstash/Redis) — đúng triết lý ít-dependency; login admin hiếm nên thêm 1 query không sao.
- Đếm khoá **theo IP, không theo email** — tránh kẻ xấu cố tình khoá admin thật (DoS).
- **Fail-open cho login** (thiếu service key → không tự khoá cửa admin), **fail-closed cho contact** (không nuốt lead). Hai hướng ngược nhau, có chủ ý.
- **Caching là đòn bẩy chi phí #1**, không phải lọc symbol (đảo lại giả định BAN_GIAO cũ).
- Định giá theo cảm nhận (độ dài giấc mơ) — giữ nguyên, đang lời tốt.
- Ranh giới mạch giấc mơ = **gap 3h + form fresh**, không thêm nút, không đụng server.

### Còn nợ / phát hiện mới (phiên sau nhặt)
- **Chạy 3 file SQL trên Supabase nếu chưa**: `admin-throttle.sql`, `contact.sql`, `ai_logs.sql`. (admin-throttle + contact đã chạy phiên này; ai_logs chạy khi đè route caching.)
- **Query `ai_logs` lấy token THẬT** → chốt lại kinh tế bằng số thật + xem caching cắt bao nhiêu %:
  `select count(*), round(avg(tokens)), avg(cache_read_tokens), avg(cache_creation_tokens) from public.ai_logs where feature='giai_mo';`
- **Lọc symbol theo keyword**: chỉ làm nếu số liệu thật cho thấy đa số lượt-đơn-lẻ. Keyword match, KHÔNG embedding.
- **CORS + rate-limit cho `/api/claude`** khi lượng khách tăng (chưa làm).
- **Hash mật khẩu admin (bcrypt)** — ưu tiên thấp, để sau.
- **Trang admin đọc `contact_messages`** (giờ phải query tay trong SQL Editor).
- **Nav**: nếm/chỉnh thẩm mỹ (cỡ avatar 38px, màu chữ, ngưỡng thu nút Giải mã ≤760px).
- **[Văn phòng sau]** máy nhà đọc `ai_logs`/`credit_transactions`/`conversations` → báo cáo (chỉ đọc, rủi ro ~0).

### Files phiên này
- SQL (chạy Supabase SQL Editor): `supabase/admin-throttle.sql`, `supabase/contact.sql`, `supabase/ai_logs.sql`.
- Code: `app/api/admin/login/route.ts`, `lib/admin-session.ts`, `app/api/contact/route.ts`, `app/api/claude/route.ts`, `components/layout/Iris.tsx`, `components/layout/Nav.tsx`, `styles/globals.css` (append cuối).
- Mẹo mới: **PGlite** (`@electric-sql/pglite`, Postgres WASM chạy trong Node) để test migration/RPC plpgsql cục bộ trước khi giao — không cần cài Postgres thật.

## 20. PHÁT HIỆN CUỐI PHIÊN (chưa sửa — đưa vào mạch phiên sau)

**A. [BUG THẬT] Mất tin nhắn khi load lại / đăng nhập lại.**
Triệu chứng: các lượt hỏi-lại sau giấc mơ đầu (vd tin "vậy điều này có nghĩa là gì" + bài Iris trả) KHÔNG được lưu — F5 hoặc đăng nhập lại thì mất.
Đã điều tra, LOẠI giả thuyết giới hạn 4000 ký tự (đo reply thật chỉ 2.514 < 4.000). Hai chỗ hở thật:
- **Hở 1 — lưu "xóa sạch rồi ghi lại":** `app/api/conversations/route.ts` PUT xóa hết messages rồi insert lại toàn bộ. Client `Iris.tsx` gọi PUT mỗi lần `messages` đổi (1 lượt = ≥2 PUT: tin user, rồi tin Iris). Các PUT chạy song song, không xếp thứ tự → PUT mang ảnh chụp CŨ tới muộn sẽ xóa tin mới rồi đắp lại bản thiếu → rơi tin.
- **Hở 2 — load đè vô điều kiện:** `onAuthStateChange` (kể cả khi Supabase tự làm mới token định kỳ, hoặc đăng nhập lại) gọi `loadConversation` rồi `setMessages(server)` đè thẳng state đang có. Server thiếu (do Hở 1) → kéo bản thiếu về đè bản đủ → mất, rồi lưu lại bản thiếu → mất vĩnh viễn.
- **Fix đề xuất (đều ở client `components/layout/Iris.tsx`, không cần đụng server):**
  1. Lưu **tuần tự + gộp (debounce ~600ms)**: chỉ 1 PUT in-flight; nếu có thay đổi khi đang bay thì PUT lại với ảnh chụp mới nhất. Hết race.
  2. **Chỉ nạp server MỘT LẦN** lúc vào (dùng ref cờ đã-load); không để token-refresh kéo bản cũ về đè.
  3. (tùy chọn, chắc hơn) đổi server PUT sang **upsert theo id** thay vì delete-all-insert — nhưng client phải gửi id; để sau nếu (1)(2) chưa đủ.
- Lưu ý: fix này chỉ chống mất tin TỪ GIỜ; dữ liệu đã mất trước đó không khôi phục được.

**B. [GIỌNG IRIS] Tinh chỉnh `lib/iris-prompt.ts` (nếm nhiều vòng).** Nhận xét từ 1 giấc mơ thật:
- **Lặp ở lượt hỏi-lại:** khi người mơ hỏi tiếp ("vậy nghĩa là gì"), Iris tóm lại y hệt lượt trước thay vì đào sâu. → thêm luật: khi người mơ hỏi tiếp, KHÔNG tóm lại, chọn một ý đi sâu hoặc mở góc mới.
- **Giọng nghiêng "lên lớp/coach"** ở lượt sau ("bạn có sẵn sàng bước từ mơ ra...", "xây dựng đời sống thực sự"). → hạ bớt, giữ thủ thỉ.
- **Câu hỏi kết trúc trắc, dịch-máy** ("Bạn có muốn gì từ điều này — từ việc tiếp tục nhớ cô ấy theo cách này?"). Gốc: luật "LUÔN khép bằng câu hỏi mở" ép ra câu gượng. → nới thành "có thể khép bằng câu hỏi mở, ngắn, tự nhiên như lời nói thường — không bắt buộc", và dặn tránh cú pháp dịch-máy.
