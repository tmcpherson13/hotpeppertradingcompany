import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LogoDivider } from "@/components/ui/LogoDivider";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO
        title="Off the Charted Routes"
        description="This page could not be found in the trading company's records."
        path="/404"
        noIndex
      />
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="max-w-lg text-center">
          <LogoDivider variant="minimal" size="sm" className="mb-8" />
          <p className="font-heading text-muted-foreground uppercase tracking-[0.3em] text-sm mb-4">
            Chart Reference 404
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground mb-5">
            Off the Charted Routes
          </h1>
          <p className="font-body text-muted-foreground text-lg leading-relaxed mb-8">
            No such page appears in our records. The manifest may have changed, or this route was never charted.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="font-heading uppercase tracking-widest text-sm text-primary hover:text-primary/80"
            >
              Return to Port →
            </Link>
            <Link
              to="/compendium"
              className="font-heading uppercase tracking-widest text-sm text-muted-foreground hover:text-primary"
            >
              Browse the Compendium →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
