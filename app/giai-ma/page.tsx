import type { Metadata } from "next";
import Link from "next/link";
import { ArticleGlyph } from "@/components/blog/ArticleGlyph";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Tủ sách giải mã",
  description: "Những bài viết dài về biểu tượng giấc mơ phổ biến từ dân gian Việt, Jung và khoa học giấc ngủ."
};

export const revalidate = 60;

export default async function PageGiaiMa() {
  const articles = await getAllArticles();

  return (
    <div className="page-shell blog-shell">
      <div className="page-header">
        <div className="eyebrow">
          <span className="dot"></span>
          Tủ sách giải mã · Giấc mơ theo biểu tượng
        </div>
        <h1 className="page-title">
          Mỗi biểu tượng <em>là một câu chuyện</em>
        </h1>
        <p className="page-sub">
          Những bài viết dài về các biểu tượng giấc mơ phổ biến - đọc từ góc nhìn dân gian Việt, tâm lý học hiện đại, và cách áp dụng vào cuộc sống thực. Đọc chậm. Ngẫm chậm.
        </p>
      </div>

      <div className="blog-grid">
        {articles.map((article) => {
          const card = (
            <article className="blog-card" style={{ "--accent": article.accent } as React.CSSProperties}>
              <div className={`blog-card-cover ${article.image ? "has-image" : ""}`}>
                <div className="blog-card-glyph">
                  <ArticleGlyph kind={article.glyph} accent={article.accent} />
                </div>
              </div>
              <div className="blog-card-body">
                <div className="blog-card-eyebrow">{article.eyebrow}</div>
                <h2 className="blog-card-title">{article.title}</h2>
                <p className="blog-card-excerpt">{article.excerpt}</p>
                <div className="blog-card-meta">
                  <div className="blog-card-tags">
                    {article.tags.map((tag) => <span key={tag} className="blog-tag">{tag}</span>)}
                  </div>
                  <div className="blog-card-time"><span>{article.readTime} phút đọc →</span></div>
                </div>
              </div>
            </article>
          );
          return <Link key={article.slug} href={`/giai-ma/${article.slug}`}>{card}</Link>;
        })}
      </div>
    </div>
  );
}
