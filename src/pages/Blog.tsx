import { type FC } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../hooks/useLang";
import { BLOG_POSTS } from "../data/blog";
import { ScanLine, SL, ST, BODY_FONT } from "../components/UI";

const AC = "#c084fc";

const Blog: FC = () => {
  const { lang } = useLang();

  return (
    <div>
      <ScanLine />
      <section style={{ minHeight: "100vh", padding: "120px 20px 60px", maxWidth: 860, margin: "0 auto" }}>
        <SL num="01" text={lang === "ru" ? "БЛОГ" : "BLOG"} color={AC} />
        <ST>{lang === "ru" ? "Мысли и" : "Thoughts &"}<br /><span style={{ color: AC }}>{lang === "ru" ? "наблюдения" : "observations"}</span></ST>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", background: "rgba(255,255,255,0.02)", border: "1px solid #1a1a1a", padding: "32px 28px", transition: "all 0.3s", borderLeft: `3px solid ${AC}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 10, letterSpacing: 3, color: AC, fontWeight: 700, textTransform: "uppercase", padding: "4px 10px", background: `${AC}12`, border: `1px solid ${AC}22` }}>{post.tag}</span>
                <span style={{ fontFamily: BODY_FONT, fontSize: 11, color: "#555" }}>{post.date}</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: 0.5, marginBottom: 10, lineHeight: 1.3 }}>{lang === "ru" ? post.titleRu : post.titleEn}</div>
              <div style={{ fontFamily: BODY_FONT, fontSize: 13, color: "#888", lineHeight: 1.7 }}>{lang === "ru" ? post.previewRu : post.previewEn}</div>
            </Link>
          ))}
        </div>
      </section>

      <footer style={{ padding: "60px 20px", textAlign: "center", borderTop: `1px solid ${AC}10` }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "#333", letterSpacing: 4 }}>ARENA <span style={{ color: "#ff3e3e" }}>1</span></div>
        <div style={{ fontSize: 10, color: "#333", letterSpacing: 3, marginTop: 8 }}>ARENA 1 BLOG · 2026</div>
      </footer>
    </div>
  );
};

export default Blog;
