import { useState } from 'react';
import { Menu, X, Search, LogOut, Shield, Heart } from 'lucide-react';
import { CartDrawer } from '@/components/trading-post/CartDrawer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoDark from '@/assets/logo-dark.svg';


const navLinks = [
  { name: 'Home', href: '/', isRoute: true },
  { name: 'Trading Post', href: '/trading-post', isRoute: true },
  { name: 'The Compendium', href: '/compendium', isRoute: true },
  { name: 'Our Heritage', href: '/#heritage', isRoute: false },
  { name: 'Trade Routes', href: '#routes', isRoute: false },
  { name: 'Origins Map', href: '/origins', isRoute: true },
  { name: 'About', href: '/about', isRoute: true },
];


export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isLoading, isAdmin } = useAuth();
  const isHomePage = location.pathname === '/';


  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    // Extract hash correctly from both '#routes' and '/#heritage' formats
    const hashIndex = href.indexOf('#');
    const targetId = hashIndex !== -1 ? href.slice(hashIndex + 1) : '';
    
    if (!isHomePage) {
      // Navigate to home with hash - ScrollToHash in App.tsx handles the scroll
      navigate('/' + (targetId ? '#' + targetId : ''));
    } else if (targetId) {
      // Already on homepage - scroll to element directly
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
