import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoDark from '@/assets/logo-dark.svg';

const navLinks = [
  { name: 'The Cargo', href: '#collection', isRoute: false },
  { name: 'Heritage', href: '#heritage', isRoute: false },
  { name: 'Trade Routes', href: '#routes', isRoute: false },
  { name: 'The Compendium', href: '/compendium', isRoute: true },
  { name: 'Inquiry', href: '#contact', isRoute: false },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePage) {
      e.preventDefault();
      navigate('/' + href);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
            <img 
              src={logoDark} 
              alt="Hot Pepper Trading Company" 
              className="h-16 w-auto mix-blend-multiply"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => window.scrollTo(0, 0)}
                  className="font-heading text-base font-bold uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={isHomePage ? link.href : '/' + link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="font-heading text-base font-bold uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors duration-300"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex text-muted-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="relative text-muted-foreground hover:text-primary transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                0
              </span>
            </button>
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setIsOpen(false);
                    }}
                    className="font-heading text-lg uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={isHomePage ? link.href : '/' + link.href}
                    onClick={(e) => {
                      handleAnchorClick(e, link.href);
                      setIsOpen(false);
                    }}
                    className="font-heading text-lg uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors py-2 border-b border-border"
                  >
                    {link.name}
                  </a>
                )
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
