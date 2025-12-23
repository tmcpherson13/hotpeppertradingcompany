import { Link } from 'react-router-dom';
import logoWhite from '@/assets/logo-white.png';

const footerLinks = {
  inventory: [
    { name: 'All Varieties', href: '#collection' },
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
              <Link to="/">
                <img 
                  src={logoWhite} 
                  alt="Hot Pepper Trading Company" 
                  className="h-32 w-auto mix-blend-screen"
                />
              </Link>
            </div>
            <p className="font-body text-primary-foreground/80 leading-relaxed max-w-sm mb-6">
              Celebrating the history, cultures, and cuisines of capsicum peppers 
              since 1493. We develop pepper consortiums that honor traditional 
              growing practices and culinary heritage.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/60">
              <span className="text-gold">✦</span>
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
          <p className="font-body text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Hot Pepper Trading Company. Est. 1493. All rights reserved.
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
