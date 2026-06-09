import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleGlyph } from "@/components/blog/ArticleGlyph";
import { renderTipTap } from "@/components/blog/RichText";
import { getAllArticles, getArticle, getPublishedArticles } from "@/lib/articles";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/giai-ma/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      url: absoluteUrl(`/giai-ma/${article.slug}`)
    }
  };
}

export default async function PageGiaiMaArticle({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url: absoluteUrl(`/giai-ma/${article.slug}`),
    inLanguage: "vi"
  };
  const relatedArticles = (await getPublishedArticles()).filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <div className="page-shell blog-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="blog-article">
        <Link className="blog-back" href="/giai-ma">← Tủ sách</Link>
        <header className="blog-article-head" style={{ "--accent": article.accent } as React.CSSProperties}>
          <div className="blog-article-glyph">
            <ArticleGlyph kind={article.glyph} accent={article.accent} />
          </div>
          <div className="eyebrow">{article.eyebrow}</div>
          <h1 className="page-title">{article.title}</h1>
          <p className="page-sub">{article.excerpt}</p>
          <div className="blog-article-meta">
            <span>{article.readTime} phút đọc</span>
            <span className="dot-sep">·</span>
            <div className="blog-card-tags">{article.tags.map((tag) => <span key={tag} className="blog-tag">{tag}</span>)}</div>
          </div>
        </header>

        <div className="blog-article-body">
          {renderTipTap(article.content)}
        </div>

        <footer className="blog-article-foot">
          <div className="eyebrow">
            <span className="dot"></span>Tiếp tục đọc
          </div>
          <div className="blog-related">
            {relatedArticles.map((item) => (
              <Link key={item.slug} href={`/giai-ma/${item.slug}`} className="blog-related-item" style={{ "--accent": item.accent } as React.CSSProperties}>
                <div className="blog-related-glyph">
                  <ArticleGlyph kind={item.glyph} accent={item.accent} />
                </div>
                <div>
                  <div className="blog-card-eyebrow">{item.eyebrow}</div>
                  <div className="blog-related-title">{item.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
}
