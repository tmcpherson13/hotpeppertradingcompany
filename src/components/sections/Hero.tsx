import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-spice-trade.jpg';
import logoWhite from '@/assets/logo-white.svg';

export function Hero() {
  const scrollToHeritage = () => {
    const heritageSection = document.getElementById('heritage');
    if (heritageSection) {
      heritageSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Ancient maritime spice trade scene with Phoenician ships and exotic spices"
          className="w-full h-full object-cover"
        />
        {/* Aged parchment overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 hero-parchment-overlay" />
      </div>

      {/* Compass Rose - Top Left */}
      <div className="absolute top-20 left-8 md:left-16 opacity-20 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 120 120" className="text-parchment">
          <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" strokeWidth="0.3" />
          {/* Cardinal directions */}
          <line x1="60" y1="5" x2="60" y2="25" stroke="currentColor" strokeWidth="1.5" />
          <line x1="60" y1="95" x2="60" y2="115" stroke="currentColor" strokeWidth="1" />
          <line x1="5" y1="60" x2="25" y2="60" stroke="currentColor" strokeWidth="1" />
          <line x1="95" y1="60" x2="115" y2="60" stroke="currentColor" strokeWidth="1" />
          {/* Ordinal directions */}
          <line x1="20" y1="20" x2="32" y2="32" stroke="currentColor" strokeWidth="0.5" />
          <line x1="100" y1="20" x2="88" y2="32" stroke="currentColor" strokeWidth="0.5" />
          <line x1="20" y1="100" x2="32" y2="88" stroke="currentColor" strokeWidth="0.5" />
          <line x1="100" y1="100" x2="88" y2="88" stroke="currentColor" strokeWidth="0.5" />
          {/* Center star */}
          <polygon points="60,40 63,55 78,55 66,65 70,80 60,70 50,80 54,65 42,55 57,55" fill="currentColor" opacity="0.6" />
          {/* N marker */}
          <text x="60" y="18" textAnchor="middle" fill="currentColor" fontSize="8" fontFamily="serif">N</text>
        </svg>
      </div>

      {/* Trade Route Lines - Right Side */}
      <div className="absolute top-1/4 right-0 w-1/3 h-1/2 opacity-10 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 200 300" preserveAspectRatio="none">
          <path
            d="M200,50 Q150,80 180,120 T140,180 Q100,220 120,280"
            fill="none"
            stroke="hsl(var(--parchment))"
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <path
            d="M200,100 Q160,130 170,170 T130,230 Q90,270 100,300"
            fill="none"
            stroke="hsl(var(--parchment))"
            strokeWidth="0.5"
            strokeDasharray="2,3"
          />
          {/* Route waypoints */}
          <circle cx="175" cy="90" r="3" fill="hsl(var(--parchment))" opacity="0.5" />
          <circle cx="160" cy="150" r="3" fill="hsl(var(--parchment))" opacity="0.5" />
          <circle cx="130" cy="210" r="3" fill="hsl(var(--parchment))" opacity="0.5" />
        </svg>
      </div>

      {/* Latitude/Longitude Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(var(--parchment))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>
      </div>

      {/* Decorative Corner Flourishes */}
      <div className="absolute bottom-10 left-8 md:left-16 opacity-15 pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 80 80" className="text-parchment">
          <path
            d="M0,80 Q20,60 40,60 Q60,60 60,40 Q60,20 80,0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M0,70 Q15,55 35,55 Q50,55 50,35 Q50,20 65,0"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          {/* Decorative Element - Logo */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-parchment/60 to-transparent" />
            <img src={logoWhite} alt="Hot Pepper Trading Company" className="h-36 w-auto" />
            <span className="w-20 h-px bg-gradient-to-r from-transparent via-parchment/60 to-transparent" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-parchment/80 font-heading text-sm md:text-base uppercase tracking-[0.3em] mb-6 small-caps"
          >
            Celebrating Pepper History, Culture & Cuisine Since 1493
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-parchment leading-tight mb-6 hero-engraved-text text-engraved"
          >
            Hot Pepper <br />
            <span className="font-heading italic text-gold normal-case">Trading Company</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-parchment/90 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Hot peppers originated in the Americas and reshaped global cuisine through centuries of trade. 
            We source directly from the regions that perfected their cultivation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="pepper" size="xl" className="min-w-[220px] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_25px_hsla(6,75%,45%,0.5)]" asChild>
              <a href="#collection">View Current Consignment</a>
            </Button>
            <Button 
              variant="tyrian" 
              size="xl" 
              className="min-w-[220px] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_25px_hsla(300,100%,18%,0.5)]"
              onClick={scrollToHeritage}
            >
              Learn About Our Heritage
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-[40%]"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-parchment/60"
          >
            <span className="text-xs uppercase tracking-widest font-body">Discover</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none hero-vignette" />
    </section>
  );
}
