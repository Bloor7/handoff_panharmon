import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import "@/styles/globals.css";
import { DrumRing } from "@/components/patterns";
import { Footer } from "@/components/layout/Footer";
import { Iris } from "@/components/layout/Iris";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Nav } from "@/components/layout/Nav";
import { TopUpModal } from "@/components/layout/TopUpModal";
import { StarField } from "@/components/layout/StarField";
import { siteConfig } from "@/lib/site";

const serif = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif"
});

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/giai-ma?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="vi" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <StarField />
        <DrumRing className="drum-ring tl" />
        <DrumRing className="drum-ring br" />
        <Nav />
        <main className="shell">{children}</main>
        <div className="shell">
          <Footer />
        </div>
        <Iris />
        <TopUpModal />
        <MobileTabBar />
      </body>
    </html>
  );
}
