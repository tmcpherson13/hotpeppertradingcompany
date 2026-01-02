import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, Search, User, LogOut, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoDark from '@/assets/logo-dark.svg';

const navLinks = [
  { name: 'The Cargo', href: '#collection', isRoute: false },
  { name: 'The Compendium', href: '/compendium', isRoute: true },
  { name: 'Historical Context', href: '#heritage', isRoute: false },
  { name: 'Trade Routes', href: '#routes', isRoute: false },
  { name: 'Inquiry', href: '#contact', isRoute: false },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isLoading, isAdmin } = useAuth();
  const isHomePage = location.pathname === '/';

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePage) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
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
              className="h-14 w-auto mix-blend-multiply"
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
            
          {/* Auth button */}
          {!isLoading && (
            user ? (
              <div className="hidden md:flex items-center gap-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-tyrian hover:text-tyrian/80 border border-tyrian/30 rounded-md hover:border-tyrian/50 transition-colors"
                    title="Admin Panel"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary border border-border rounded-md hover:border-primary transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary border border-border rounded-md hover:border-primary transition-colors"
                title="Sign in"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )
          )}
            
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
              
              {/* Mobile Auth Actions */}
              {!isLoading && (
                user ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 font-heading text-lg uppercase tracking-[0.15em] text-tyrian hover:text-tyrian/80 transition-colors py-2 border-b border-border"
                      >
                        <Shield className="w-5 h-5" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 font-heading text-lg uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors py-2 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 font-heading text-lg uppercase tracking-[0.15em] text-foreground hover:text-primary transition-colors py-2"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                )
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
