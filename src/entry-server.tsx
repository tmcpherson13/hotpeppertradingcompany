/**
 * Build-time prerender entry. Used only by scripts/prerender.mjs — never
 * shipped to the browser. Renders a route to static HTML and collects the
 * head tags emitted by react-helmet-async.
 */
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import type { HelmetServerState } from "react-helmet-async";
import { AppProviders, AppRoutes } from "./App";
import { peppers } from "./data/peppers";

/** Static slugs (the frozen 190), used by the prerender script. */
export const pepperSlugs: string[] = peppers.map((p) => p.id);

// Re-export the DB fetch + injection store so the prerender script can pull
// published database peppers at build time and generate their pages too.
export { fetchPublishedPeppers, setInjectedDbPeppers } from "./data/dbPeppers";

export function render(url: string): { html: string; head: string } {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <AppProviders>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppProviders>
    </HelmetProvider>
  );

  const { helmet } = helmetContext;
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ].join("\n")
    : "";

  return { html, head };
}
