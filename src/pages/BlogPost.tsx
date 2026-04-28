import { type FC } from "react";
import { useParams, Link } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { useIsMobile } from "../hooks/useIsMobile";
import { BLOG_POSTS } from "../data/blog";
import { ScanLine, BODY_FONT } from "../components/UI";

const AC = "#c084fc";

function renderMarkdown(text: string) {
  const blocks: { type: "h2" | "p"; text: string }[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3) });
    } else {
      blocks.push({ type: "p", text: trimmed });
    }
  }
  return blocks;
}

function renderInline(text: string) {
  const parts: (string | { bold: string })[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push({ bold: match[1] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const BlogPost: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();
  const mob = useIsMobile();
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 48px)", padding: "68px 20px 20px", textAlign: "center" }}>
        <ScanLine />
        <div style={{ fontSize: 48, fontWeight: 900, color: "#333", marginBottom: 16 }}>404</div>
        <div style={{ fontFamily: BODY_FONT, fontSize: 14, color: "#555", marginBottom: 32 }}>{lang === "ru" ? "Статья не найдена" : "Post not found"}</div>
        <Link to="/blog" style={{ fontFamily: BODY_FONT, fontSize: 13, color: AC, textDecoration: "none" }}>{lang === "ru" ? "Назад к блогу" : "Back to blog"}</Link>
      </div>
    );
  }

  const title = lang === "ru" ? post.titleRu : post.titleEn;
  const content = lang === "ru" ? post.contentRu : post.contentEn;
  const blocks = renderMarkdown(content);

  return (
    <div style={{ overflowX: "hidden" }}>
      <ScanLine />
      <article style={{ maxWidth: 720, margin: "0 auto", padding: mob ? "80px 16px 40px" : "120px 20px 60px" }}>
        {/* Back link */}
        <Link to="/blog" style={{ fontFamily: BODY_FONT, fontSize: 12, color: AC, textDecoration: "none", letterSpacing: 1, display: "inline-block", marginBottom: mob ? 28 : 40 }}>&larr; {lang === "ru" ? "Блог" : "Blog"}</Link>

        {/* Header */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: AC, fontWeight: 700, textTransform: "uppercase", padding: "4px 10px", background: `${AC}12`, border: `1px solid ${AC}22` }}>{post.tag}</span>
          <span style={{ fontFamily: BODY_FONT, fontSize: 11, color: "#555" }}>{post.date}</span>
        </div>
        <h1 style={{ fontSize: "clamp(24px,5vw,44px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, margin: mob ? "0 0 32px" : "0 0 48px", letterSpacing: -0.5 }}>{title}</h1>

        {/* Content */}
        <div>
          {blocks.map((block, i) => {
            if (block.type === "h2") {
              return <h2 key={i} style={{ fontSize: mob ? 18 : 22, fontWeight: 800, color: "#fff", margin: mob ? "36px 0 12px" : "48px 0 16px", letterSpacing: 0.3, lineHeight: 1.2 }}>{block.text}</h2>;
            }
            const parts = renderInline(block.text);
            return (
              <p key={i} style={{ fontFamily: BODY_FONT, fontSize: mob ? 14 : 15, color: "#aaa", lineHeight: 1.85, margin: "0 0 18px" }}>
                {parts.map((part, j) =>
                  typeof part === "string" ? <span key={j}>{part}</span> : <strong key={j} style={{ color: "#fff", fontWeight: 700 }}>{part.bold}</strong>
                )}
              </p>
            );
          })}
        </div>

        {/* Footer nav */}
        <div style={{ marginTop: mob ? 40 : 64, paddingTop: 32, borderTop: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between" }}>
          <Link to="/blog" style={{ fontFamily: BODY_FONT, fontSize: 13, color: AC, textDecoration: "none" }}>&larr; {lang === "ru" ? "Все статьи" : "All posts"}</Link>
        </div>
      </article>

      <footer style={{ padding: mob ? "40px 16px" : "60px 20px", textAlign: "center", borderTop: `1px solid ${AC}10` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#333", letterSpacing: 4 }}>ARENA <span style={{ color: "#ff3e3e" }}>1</span></div>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: 3, marginTop: 8 }}>ARENA 1 BLOG · 2026</div>
      </footer>
    </div>
  );
};

export default BlogPost;
