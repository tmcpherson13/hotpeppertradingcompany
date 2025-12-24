import { Link } from 'react-router-dom';
import logoWhite from '@/assets/logo-white.svg';

const footerLinks = {
  inventory: [
    { name: 'All Cultivars', href: '#collection' },
    { name: 'By Region', href: '#routes' },
    { name: 'Seasonal Offerings', href: '#' },
    { name: 'Wholesale Inquiries', href: '#' },
  ],
  knowledge: [
    { name: 'Company Heritage', href: '#heritage' },
    { name: 'Sourcing Regions', href: '#routes' },
    { name: 'Capsicum Reference', href: '#' },
    { name: 'Cultivation Notes', href: '#' },
  ],
  trade: [
    { name: 'Shipping Terms', href: '#' },
    { name: 'Return Policy', href: '#' },
    { name: 'Trade Inquiries', href: '#' },
    { name: 'Correspondence', href: '#' },
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
              Celebrating the history, cultures, and cuisines of capsicum peppers 
              since 1493. We develop pepper consortiums that honor traditional 
              growing practices and culinary heritage.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/60">
              <img src={logoWhite} alt="" className="h-4 w-auto mix-blend-screen" aria-hidden="true" />
              <span className="font-body text-sm italic">
                Provenance verified. Quality guaranteed.
              </span>
            </div>
          </div>

          {/* Inventory Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.15em] text-primary-foreground mb-4">
              Inventory
            </h4>
            <ul className="space-y-3">
              {footerLinks.inventory.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
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
                  <a
                    href={link.href}
                    className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trade Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.15em] text-primary-foreground mb-4">
              Trade
            </h4>
            <ul className="space-y-3">
              {footerLinks.trade.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} <span className="font-blackpearl text-base">Hot Pepper Trading Company</span>. Est. 1493. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms of Trade
            </a>
            <a href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Notice
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
