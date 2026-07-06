import { Helmet } from 'react-helmet-async';

export const SITE_URL = 'https://hotpeppertradingcompany.com';
export const SITE_NAME = 'Hot Pepper Trading Company';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SEOProps {
  /** Page title. The site name is appended automatically unless this is the homepage. */
  title: string;
  description: string;
  /** Path beginning with "/", e.g. "/compendium". Used for the canonical URL. */
  path: string;
  /** Absolute URL of the social-share image. Defaults to the site-wide OG image. */
  image?: string;
  type?: 'website' | 'article';
  /** One or more schema.org JSON-LD objects. */
  jsonLd?: object | object[];
  /** Set on pages that should not be indexed (admin, wishlist, 404). */
  noIndex?: boolean;
}

export function SEO({ title, description, path, image, type = 'website', jsonLd, noIndex }: SEOProps) {
  const fullTitle = path === '/' ? title : `${title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${path === '/' ? '' : path}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const jsonLdBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdBlocks.map((block, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(block)}</script>
      ))}
    </Helmet>
  );
}
