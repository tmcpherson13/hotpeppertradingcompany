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
