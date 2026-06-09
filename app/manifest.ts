import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Panharmon",
    short_name: "Panharmon",
    description: "Giải mã giấc mơ Việt",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e1f",
    theme_color: "#0a0e1f"
  };
}
