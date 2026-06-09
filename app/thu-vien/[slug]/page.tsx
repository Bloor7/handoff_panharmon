import type { Metadata } from "next";
import { notFound } from "next/navigation";
import libraryData from "@/public/library-data.json";
import type { LibraryData } from "@/types/content";

const data = libraryData as LibraryData;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return data.entries.slice(0, 200).map((entry) => ({ slug: entry.t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = data.entries.find((item) => item.t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === slug);
  if (!entry) return {};
  return {
    title: `${entry.v || entry.t} trong giấc mơ`,
    description: entry.d.slice(0, 155)
  };
}

export default async function LibrarySymbolPage({ params }: Props) {
  const { slug } = await params;
  const entry = data.entries.find((item) => item.t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === slug);
  if (!entry) notFound();
  const tags = entry.g.map((key) => data.tags.find((tag) => tag.key === key)?.vi || key);
  return (
    <article className="page-shell blog-shell">
      <header className="blog-article-head">
        <div className="eyebrow"><span className="dot"></span>Biểu tượng giấc mơ</div>
        <h1 className="page-title">{entry.v || entry.t}</h1>
        <p className="page-sub">{entry.d}</p>
        <div className="blog-card-tags">{tags.map((tag) => <span key={tag} className="blog-tag">{tag}</span>)}</div>
      </header>
    </article>
  );
}
