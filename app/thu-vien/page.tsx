import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";
import { LibraryClient } from "@/components/library/LibraryClient";

export const metadata: Metadata = {
  title: "Thư viện Mộng Triệu",
  description: "Hơn 6,302 biểu tượng giấc mơ liên kết qua 18 nhánh cảm xúc trong giao diện trống đồng tương tác."
};

export default function PageThuVien() {
  return (
    <PageShell eyebrow="Thư viện" title={<>Mộng <em>Triệu</em></>} sub="Hơn 6000 biểu tượng giấc mơ liên kết qua các nhánh cảm xúc. Chạm vào một nhánh để mở danh sách thẻ - chọn lá để đặt vào bàn, rồi để Iris đọc cả bộ.">
      <LibraryClient />
    </PageShell>
  );
}
