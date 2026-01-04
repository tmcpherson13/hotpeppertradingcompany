import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, LogOut, Shield, Heart } from 'lucide-react';
import { CartDrawer } from '@/components/trading-post/CartDrawer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoDark from '@/assets/logo-dark.svg';

const navLinks = [
  { name: 'Trading Post', href: '/trading-post', isRoute: true },
  { name: 'The Compendium', href: '/compendium', isRoute: true },
  { name: 'Origins Map', href: '/origins', isRoute: true },
  { name: 'Our Heritage', href: '/#heritage', isRoute: false },
  { name: 'Trade Routes', href: '#routes', isRoute: false },
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-tyrian border-b border-tyrian-dark/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo with hover animation */}
          <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center">
            <motion.img 
              src={logoDark} 
              alt="Hot Pepper Trading Company" 
              className="h-[6.2rem] w-auto brightness-0 invert"
              whileHover={{ 
                scale: 1.05,
                rotate: [0, -2, 2, 0],
                filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(212, 168, 75, 0.4))'
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 25,
                rotate: { duration: 0.4 }
              }}
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
                  className="font-heading text-base font-bold uppercase tracking-[0.15em] text-parchment/90 hover:text-gold transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={isHomePage ? link.href : '/' + link.href}
                  onClick={(e) => handleAnchorClick(e, link.href)}
                  className="font-heading text-base font-bold uppercase tracking-[0.15em] text-parchment/90 hover:text-gold transition-colors duration-300"
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex text-parchment/70 hover:text-gold transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            {user && (
              <Link
                to="/wishlist"
                className="hidden md:flex p-2 text-parchment/80 hover:text-pepper-red transition-colors"
                title="My Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            <CartDrawer />
            
          {/* Auth buttons - Admin only (no public sign-in) */}
          {!isLoading && user && (
            <div className="hidden md:flex items-center gap-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gold hover:text-gold/80 border border-gold/40 rounded-md hover:border-gold/60 transition-colors"
                  title="Admin Panel"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-parchment/80 hover:text-gold border border-parchment/30 rounded-md hover:border-gold/50 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
            
            <button
              className="md:hidden text-parchment"
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
            className="md:hidden bg-tyrian border-b border-tyrian-dark/30 overflow-hidden"
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
                    className="font-heading text-lg uppercase tracking-[0.15em] text-parchment/90 hover:text-gold transition-colors py-2 border-b border-parchment/20"
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
                    className="font-heading text-lg uppercase tracking-[0.15em] text-parchment/90 hover:text-gold transition-colors py-2 border-b border-parchment/20"
                  >
                    {link.name}
                  </a>
                )
              ))}
              
              {/* Mobile Auth Actions - Admin only (no public sign-in) */}
              {!isLoading && user && (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 font-heading text-lg uppercase tracking-[0.15em] text-gold hover:text-gold/80 transition-colors py-2 border-b border-parchment/20"
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
                    className="flex items-center gap-2 font-heading text-lg uppercase tracking-[0.15em] text-parchment/90 hover:text-gold transition-colors py-2 text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
