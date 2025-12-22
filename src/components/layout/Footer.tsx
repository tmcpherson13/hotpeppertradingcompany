import { motion } from 'framer-motion';
import logoWhite from '@/assets/logo-white.png';

const footerLinks = {
  shop: [
    { name: 'All Spices', href: '#' },
    { name: 'Pepper Collection', href: '#' },
    { name: 'Blends & Rubs', href: '#' },
    { name: 'Gift Sets', href: '#' },
  ],
  learn: [
    { name: 'Our Story', href: '#' },
    { name: 'Trade Routes', href: '#' },
    { name: 'Spice Guide', href: '#' },
    { name: 'Journal', href: '#' },
  ],
  support: [
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Contact', href: '#' },
    { name: 'FAQ', href: '#' },
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
              <img 
                src={logoWhite} 
                alt="Hot Pepper Trading Company" 
                className="h-24 w-auto"
              />
            </div>
            <p className="font-body text-primary-foreground/80 leading-relaxed max-w-sm mb-6">
              Purveyors of exceptional spices sourced from the world's most storied 
              regions. Continuing traditions older than written history.
            </p>
            <div className="flex items-center gap-2 text-primary-foreground/60">
              <span className="text-gold">✦</span>
              <span className="font-body text-sm italic">
                "Where the world's finest spices meet their legacy"
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-primary-foreground mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
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

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-primary-foreground mb-4">
              Learn
            </h4>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
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

          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-primary-foreground mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
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
            © {new Date().getFullYear()} Hot Pepper Trading Company. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-body text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
