import { type FC } from "react";
import { Helmet } from "react-helmet-async";

const SITE = "https://arena1.gg";
const OG_IMAGE = `${SITE}/og-image.png`;
const DEFAULT_TITLE = "Arena 1 — FPS Championship";

interface SeoProps {
  title?: string; // без суффикса бренда
  description: string;
  path: string; // канонический путь, напр. "/divisions"
  image?: string;
  noindex?: boolean;
  jsonLd?: object; // structured data (schema.org)
}

// Per-page мета: title/description/canonical/OG/Twitter.
// Значения запекаются в HTML при пререндере (см. scripts/prerender.mjs).
export const Seo: FC<SeoProps> = ({ title, description, path, image = OG_IMAGE, noindex, jsonLd }) => {
  const fullTitle = title ? `${title} — Arena 1` : DEFAULT_TITLE;
  const url = `${SITE}${path === "/" ? "" : path}`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Arena 1" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
};
