export const siteConfig = {
  name: "Panharmon",
  title: "Panharmon - Giải mã bí ẩn giấc mơ",
  description:
    "Giải mã giấc mơ theo tri thức dân gian Việt, tâm lý học Jung và khoa học giấc ngủ hiện đại.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "vi_VN"
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}
