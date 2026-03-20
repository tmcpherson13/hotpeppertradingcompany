import { Link } from 'react-router-dom';
import logoWhite from '@/assets/logo-white.svg';

const footerLinks = {
  cargo: [
    { name: 'All Cultivars', href: '/compendium', isRoute: true },
    { name: 'By Route', href: '/origins', isRoute: true },
    { name: 'Trading Post', href: '/trading-post', isRoute: true },
    { name: 'Wishlist', href: '/wishlist', isRoute: true },
  ],
  knowledge: [
    { name: 'Company Heritage', href: '/#heritage', isRoute: false },
    { name: 'Trade Routes', href: '/origins', isRoute: true },
    { name: 'Capsicum Reference', href: '/compendium', isRoute: true },
    { name: 'Our Heritage', href: '/#heritage', isRoute: false },
  ],
  history: [
    { name: 'Pre-Columbian Origins', href: '/history/pre-columbian-origins', isRoute: true },
    { name: 'Columbian Exchange', href: '/history/columbian-exchange', isRoute: true },
    { name: 'Global Integration', href: '/history/global-integration', isRoute: true },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Link to="/" className="block">
                <img 
                  src={logoWhite} 
                  alt="Hot Pepper Trading Company" 
                  className="h-24 w-auto mix-blend-screen mb-3"
                />
                <span className="font-blackpearl text-2xl text-primary-foreground/90">
                  Hot Pepper Trading Company
                </span>
              </Link>
            </div>
            <p className="font-body text-primary-foreground/80 leading-relaxed max-w-sm mb-6">
              Hot Pepper Trading Company curates capsicum collections assembled by route, 
              region, and lineage. We are a trading house, not a commodity sellerâpresenting 
              cultivars with intent, restraint, and respect for provenance.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/60">
              <img src={logoWhite} alt="" className="h-10 w-auto mix-blend-screen" aria-hidden="true" />
              <span className="font-body text-sm italic">
                Selection with intent. Trade with purpose.
              </span>
            </div>
          </div>

          {/* Cargo Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.15em] text-primary-foreground mb-4">
              Cargo
            </h4>
            <ul className="space-y-3">
              {footerLinks.cargo.map((link) => (
                <li key={link.name}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Knowledge Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.15em] text-primary-foreground mb-4">
              Knowledge
            </h4>
            <ul className="space-y-3">
              {footerLinks.knowledge.map((link) => (
                <li key={link.name}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* History Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.15em] text-primary-foreground mb-4">
              History
            </h4>
            <ul className="space-y-3">
              {footerLinks.history.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            Â© {new Date().getFullYear()} <span className="font-blackpearl text-base">Hot Pepper Trading Company</span>. Est. 1493. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms of Trade
            </a>
            <a href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Notice
            </a>
            <Link to="/admin" className="font-body text-sm text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
