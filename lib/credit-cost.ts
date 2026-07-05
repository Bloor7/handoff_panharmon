// Công thức tính credit cho một lượt giải mơ.
// Đặt ở đây để CẢ client (hiện preview) lẫn server (chốt + trừ) dùng CHUNG một công thức,
// tránh lệch nhau. File thuần, không đụng secret, không "server-only".
//
// Lưu ý thiết kế (đọc kỹ trước khi chỉnh giá):
// Chi phí THẬT mỗi lượt phần lớn nằm ở 81 biểu tượng nhét vào + độ dài bài Iris trả ra,
// KHÔNG nằm ở độ dài giấc mơ khách gõ. Nên đây là định giá theo CẢM NHẬN
// (gõ dài = giấc mơ hệ trọng = trả nhiều hơn), không phải theo chi phí thực.
// Giá sàn 1 credit phải đủ bù ~$0.012-0.015/lượt khi quy ra tiền.

export const CREDIT_CONFIG = {
  // Mỗi ngần này ký tự (sau khi bỏ khoảng trắng thừa) tính thêm 1 bậc.
  charsPerCredit: 350,
  // Bậc thấp nhất và cao nhất (làm tròn LÊN nằm sẵn trong Math.ceil).
  minCost: 1,
  maxCost: 3
} as const;

/** Ước lượng số credit cho một đoạn giấc mơ. Luôn trả số nguyên >= minCost, <= maxCost. */
export function estimateCost(dreamText: string): number {
  const len = dreamText.trim().length;
  if (len === 0) return CREDIT_CONFIG.minCost;
  const raw = Math.ceil(len / CREDIT_CONFIG.charsPerCredit); // 1.2 -> 2 (làm tròn lên)
  return Math.min(CREDIT_CONFIG.maxCost, Math.max(CREDIT_CONFIG.minCost, raw));
}
