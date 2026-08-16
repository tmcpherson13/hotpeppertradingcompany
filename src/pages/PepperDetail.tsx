import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LogoDivider } from '@/components/ui/LogoDivider';
import { SEO, SITE_URL } from '@/components/SEO';
import { speciesDisplayNames } from '@/data/peppers';
import { useAllPeppers } from '@/hooks/usePeppers';
import { getConsortiumsForPepper, consortiumShopPath } from '@/data/blendContents';
import { usePepperOverrides } from '@/hooks/usePepperOverrides';
import { Flame, MapPin } from 'lucide-react';
import type { Pepper } from '@/data/pepperTypes';

function formatScoville(min: number, max: number): string {
  if (min === 0 && max === 0) return 'No measurable heat';
  const fmt = (n: number) => n.toLocaleString('en-US');
  return min === max ? `${fmt(min)} SHU` : `${fmt(min)}–${fmt(max)} SHU`;
}

function formatYear(year: number): string {
  if (year < 0) return `${Math.abs(year).toLocaleString('en-US')} BCE`;
  return `${year} CE`;
}

/** Resolve a primary image URL without touching localStorage (SSR-safe). */
function primaryImage(pepper: Pepper): string | undefined {
  if (pepper.gallery && pepper.gallery.length > 0) {
    const primary = pepper.gallery.find((g) => g.isPrimary) ?? pepper.gallery[0];
    return primary.url;
  }
  return pepper.imageUrl;
}

/** Related cultivars: prefer same species, then same region, then fill by region. */
function relatedPeppers(pepper: Pepper, all: Pepper[]): Pepper[] {
  const others = all.filter((p) => p.id !== pepper.id);
  const sameSpecies = others.filter((p) => p.species === pepper.species);
  const sameRegion = others.filter((p) => p.region === pepper.region && p.species !== pepper.species);
  return [...sameSpecies, ...sameRegion].slice(0, 4);
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <span className="font-heading text-muted-foreground uppercase tracking-widest text-xs small-caps block mb-1">
    {children}
  </span>
);

const NotFoundPepper = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container max-w-2xl mx-auto px-6 pt-40 pb-32 text-center">
      <SEO
        title="Cultivar Not Found"
        description="This cultivar is not recorded in the Compendium."
        path="/peppers"
        noIndex
      />
      <h1 className="font-display text-4xl text-foreground mb-4">Not in the Registry</h1>
      <p className="font-body text-muted-foreground text-lg mb-8">
        This cultivar isn't recorded in our Compendium. It may have been renamed, or the reference is mistaken.
      </p>
      <Link to="/compendium" className="font-heading uppercase tracking-widest text-sm text-primary hover:text-primary/80">
        Browse the full Compendium →
      </Link>
    </main>
    <Footer />
  </div>
);

export default function PepperDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { peppers, isLoading } = useAllPeppers();
  const { getOverride } = usePepperOverrides();
  const pepper = peppers.find((p) => p.id === slug);

  // While DB peppers may still be loading on the client, don't 404 a real slug.
  if (!pepper) return isLoading ? <div className="min-h-screen bg-background" /> : <NotFoundPepper />;

  // Apply the published enrichment override (same fields as the compendium modal)
  // so the full record shows the enriched prose, not the sparse static seed data.
  const override = getOverride(pepper.id);
  const description = override?.description ?? pepper.description;
  const historicalNotes = override?.historical_notes ?? pepper.historicalNotes;
  const tradeRoute = override?.trade_route ?? pepper.tradeRoute;
  const origin = override?.origin ?? pepper.origin;
  const heatLevel = override?.heat_level ?? pepper.heatLevel;
  const scovilleMin = override?.scoville_min ?? pepper.scovilleMin;
  const scovilleMax = override?.scoville_max ?? pepper.scovilleMax;

  const img = override?.image_url ?? primaryImage(pepper);
  const related = relatedPeppers(pepper, peppers);
  const consortiums = getConsortiumsForPepper(pepper.id);
  const sciName = pepper.scientificName || speciesDisplayNames[pepper.species];
  const metaDescription =
    `${pepper.name} (${sciName}) — ${heatLevel}, ${formatScoville(scovilleMin, scovilleMax)}. ` +
    `Origin: ${origin}. ${description}`.slice(0, 300);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Compendium', item: `${SITE_URL}/compendium` },
        { '@type': 'ListItem', position: 3, name: pepper.name, item: `${SITE_URL}/peppers/${pepper.id}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      // A cultivar is most accurately a taxon; Article keeps the rich, cited prose indexable.
      '@type': 'Article',
      headline: `${pepper.name} — ${sciName}`,
      description,
      about: sciName,
      ...(img ? { image: img.startsWith('http') ? img : `${SITE_URL}${img}` } : {}),
      isPartOf: { '@type': 'WebSite', name: 'Hot Pepper Trading Company', url: SITE_URL },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${pepper.name} — ${sciName}`}
        description={metaDescription}
        path={`/peppers/${pepper.id}`}
        image={img && img.startsWith('http') ? img : undefined}
        type="article"
        jsonLd={jsonLd}
      />
      <Header />
      <main>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="container max-w-4xl mx-auto px-6 pt-28 pb-2">
          <ol className="flex flex-wrap items-center gap-2 font-body text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li aria-hidden>·</li>
            <li><Link to="/compendium" className="hover:text-primary">Compendium</Link></li>
            <li aria-hidden>·</li>
            <li className="text-foreground">{pepper.name}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="container max-w-4xl mx-auto px-6 pt-6 pb-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {img ? (
              <img
                src={img}
                alt={`${pepper.name} (${sciName})`}
                className="w-full aspect-square object-cover border border-border"
                loading="eager"
                width={640}
                height={640}
              />
            ) : (
              <div className="w-full aspect-square border border-border bg-card flex items-center justify-center">
                <span className="font-heading text-muted-foreground uppercase tracking-widest text-sm">
                  Illustration Forthcoming
                </span>
              </div>
            )}
            <div>
              {pepper.inStock && (
                <span className="inline-block mb-3 px-2 py-1 bg-[#2d5a3d] text-[#f5efe6] text-[10px] font-heading uppercase tracking-wider">
                  In Cargo
                </span>
              )}
              <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-1">
                {pepper.name}
              </h1>
              <p className="font-heading italic text-primary text-lg mb-4">{sciName}</p>
              {pepper.alternateNames && pepper.alternateNames.length > 0 && (
                <p className="font-body text-muted-foreground text-sm mb-4">
                  Also known as: {pepper.alternateNames.join(', ')}
                </p>
              )}
              {/* Fact tiles — same shape and labels as the compendium modal */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                <div className="text-center p-3 bg-card border border-border">
                  <Flame className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="font-heading text-[9px] uppercase tracking-wider text-muted-foreground">Pungency</p>
                  <p className="font-body text-sm font-medium text-foreground">{heatLevel}</p>
                </div>
                <div className="text-center p-3 bg-card border border-border">
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="font-heading text-[9px] uppercase tracking-wider text-muted-foreground">Provenance</p>
                  <p className="font-body text-sm font-medium text-foreground">{origin}</p>
                </div>
                <div className="text-center p-3 bg-card border border-border">
                  <div className="w-5 h-5 mx-auto mb-1 flex items-center justify-center text-primary font-display text-xs">SHU</div>
                  <p className="font-heading text-[9px] uppercase tracking-wider text-muted-foreground">Scoville</p>
                  <p className="font-body text-sm font-medium text-foreground tabular-nums">{formatScoville(scovilleMin, scovilleMax)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LogoDivider variant="minimal" size="sm" className="my-2" />

        {/* Body */}
        <section className="container max-w-2xl mx-auto px-6 py-10 space-y-10">
          <div>
            <h2 className="font-display text-2xl text-foreground mb-3">Character</h2>
            <p className="font-body text-foreground/85 text-lg leading-relaxed">{description}</p>
          </div>

          {historicalNotes && (
            <div>
              <h2 className="font-display text-2xl text-foreground mb-3">History &amp; Provenance</h2>
              <p className="font-body text-foreground/85 text-lg leading-relaxed">{historicalNotes}</p>
            </div>
          )}

          {/* Provenance facts — kept with the narrative, before the sensory notes */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <Label>Trade Route</Label>
              <p className="font-body text-foreground/85">{tradeRoute}</p>
            </div>
            <div>
              <Label>Recorded Introduction</Label>
              <p className="font-body text-foreground/85">{formatYear(pepper.yearIntroduced)}</p>
            </div>
          </div>

          {/* Sensory & culinary — deliberately last */}
          {(pepper.flavorNotes?.length > 0
            || (pepper.aromaNotes && pepper.aromaNotes.length > 0)
            || pepper.culinaryUses?.length > 0
            || (pepper.pairings && pepper.pairings.length > 0)) && (
            <div className="grid sm:grid-cols-2 gap-6 pt-2 border-t border-border">
              {pepper.flavorNotes?.length > 0 && (
                <div>
                  <Label>Flavor Notes</Label>
                  <p className="font-body text-foreground/85">{pepper.flavorNotes.join(', ')}</p>
                </div>
              )}
              {pepper.aromaNotes && pepper.aromaNotes.length > 0 && (
                <div>
                  <Label>Aroma</Label>
                  <p className="font-body text-foreground/85">{pepper.aromaNotes.join(', ')}</p>
                </div>
              )}
              {pepper.culinaryUses?.length > 0 && (
                <div>
                  <Label>Culinary Uses</Label>
                  <p className="font-body text-foreground/85">{pepper.culinaryUses.join(', ')}</p>
                </div>
              )}
              {pepper.pairings && pepper.pairings.length > 0 && (
                <div>
                  <Label>Pairs With</Label>
                  <p className="font-body text-foreground/85">{pepper.pairings.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {/* Cross-links: keep the Compendium/Origins loop, and point toward the shop */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
            <Link
              to={`/origins?highlight=${encodeURIComponent(origin)}`}
              className="font-heading uppercase tracking-widest text-sm text-primary hover:text-primary/80"
            >
              See {origin} on the Origins map →
            </Link>
            <Link
              to="/compendium"
              className="font-heading uppercase tracking-widest text-sm text-muted-foreground hover:text-primary"
            >
              Back to the Compendium →
            </Link>
            {pepper.inStock && (
              <Link
                to="/trading-post"
                className="font-heading uppercase tracking-widest text-sm text-primary hover:text-primary/80"
              >
                Find it in the Cargo →
              </Link>
            )}
          </div>
        </section>

        {/* Featured in These Consortiums — the shop conversion hook */}
        {consortiums.length > 0 && (
          <section className="container max-w-4xl mx-auto px-6 py-12">
            <h2 className="font-display text-2xl text-foreground mb-2 text-center">
              Featured in These Consortiums
            </h2>
            <p className="font-body text-muted-foreground text-center mb-6">
              Acquire this cultivar as part of a curated trade lot.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {consortiums.map((c) => (
                <Link
                  key={c.consortiumId}
                  to={consortiumShopPath(c)}
                  className="group block border border-border bg-card p-5 hover:border-primary transition-colors"
                >
                  <span className="font-heading text-muted-foreground uppercase tracking-widest text-[10px] small-caps block mb-1">
                    {c.tradeLot} · {c.regionLabel}
                  </span>
                  <h3 className="font-display text-xl text-foreground leading-tight group-hover:text-primary transition-colors mb-3">
                    {c.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-body text-foreground tabular-nums">{c.price}</span>
                    <span className="font-heading uppercase tracking-widest text-xs text-primary">
                      Acquire →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related cultivars */}
        {related.length > 0 && (
          <section className="container max-w-4xl mx-auto px-6 py-12">
            <h2 className="font-display text-2xl text-foreground mb-6 text-center">Kindred Cultivars</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {related.map((r) => {
                const rImg = primaryImage(r);
                return (
                  <Link key={r.id} to={`/peppers/${r.id}`} className="group block">
                    {rImg ? (
                      <img
                        src={rImg}
                        alt={r.name}
                        className="w-full aspect-square object-cover border border-border mb-2"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full aspect-square border border-border bg-card mb-2" />
                    )}
                    <p className="font-heading text-foreground text-sm group-hover:text-primary transition-colors">
                      {r.name}
                    </p>
                    <p className="font-body text-muted-foreground text-xs italic">{speciesDisplayNames[r.species]}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
