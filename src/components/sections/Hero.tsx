import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-spice-trade-new.jpg';
import logoWhite from '@/assets/logo-white.svg';
import { useRef } from 'react';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const scrollToHeritage = () => {
    const heritageSection = document.getElementById('heritage');
    if (heritageSection) {
      heritageSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <img
          src={heroImage}
          alt="Ancient maritime spice trade scene with Phoenician ships and exotic spices"
          className="w-full h-[120%] object-cover"
        />
        {/* Aged parchment overlay */}
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 hero-parchment-overlay" />
      </motion.div>

      {/* Period-Accurate Compass Rose - Top Left */}
      <div className="absolute top-20 left-8 md:left-16 opacity-25 pointer-events-none">
        <svg width="140" height="140" viewBox="0 0 140 140" className="text-parchment">
          {/* Outer decorative rings */}
          <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="70" cy="70" r="64" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="70" cy="70" r="58" fill="none" stroke="currentColor" strokeWidth="0.3" />
          
          {/* 32-point degree markers */}
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i * 11.25 - 90) * Math.PI / 180;
            const isCardinal = i % 8 === 0;
            const isIntercardinal = i % 4 === 0 && !isCardinal;
            const innerR = isCardinal ? 58 : isIntercardinal ? 60 : 62;
            const outerR = 64;
            return (
              <line
                key={i}
                x1={70 + innerR * Math.cos(angle)}
                y1={70 + innerR * Math.sin(angle)}
                x2={70 + outerR * Math.cos(angle)}
                y2={70 + outerR * Math.sin(angle)}
                stroke="currentColor"
                strokeWidth={isCardinal ? 1.5 : isIntercardinal ? 1 : 0.5}
                opacity={isCardinal ? 1 : isIntercardinal ? 0.8 : 0.5}
              />
            );
          })}
          
          {/* Cardinal points - Large fleur-de-lis style pointers */}
          {/* North - Primary with fleur-de-lis */}
          <g>
            <polygon points="70,8 76,50 70,58 64,50" fill="currentColor" />
            <polygon points="70,8 73,20 70,15 67,20" fill="hsl(var(--gold))" opacity="0.6" />
            {/* Fleur-de-lis ornament */}
            <path d="M70,4 C72,6 74,5 74,3 C74,7 70,10 70,10 C70,10 66,7 66,3 C66,5 68,6 70,4" fill="currentColor" opacity="0.8" />
          </g>
          <polygon points="70,132 76,90 70,82 64,90" fill="currentColor" opacity="0.7" />
          <polygon points="8,70 50,64 58,70 50,76" fill="currentColor" opacity="0.7" />
          <polygon points="132,70 90,64 82,70 90,76" fill="currentColor" opacity="0.7" />
          
          {/* Intercardinal points - Smaller ornate pointers */}
          <polygon points="21,21 52,58 58,58 58,52" fill="currentColor" opacity="0.5" />
          <polygon points="119,21 88,58 82,58 82,52" fill="currentColor" opacity="0.5" />
          <polygon points="21,119 52,82 58,82 58,88" fill="currentColor" opacity="0.5" />
          <polygon points="119,119 88,82 82,82 82,88" fill="currentColor" opacity="0.5" />
          
          {/* Secondary intercardinals - thin lines */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => {
            const angle = (deg - 90) * Math.PI / 180;
            return (
              <line
                key={deg}
                x1={70 + 25 * Math.cos(angle)}
                y1={70 + 25 * Math.sin(angle)}
                x2={70 + 50 * Math.cos(angle)}
                y2={70 + 50 * Math.sin(angle)}
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
            );
          })}
          
          {/* Center decorative rings */}
          <circle cx="70" cy="70" r="18" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="70" cy="70" r="12" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="70" cy="70" r="6" fill="hsl(var(--parchment))" stroke="currentColor" strokeWidth="1" opacity="0.8" />
          <circle cx="70" cy="70" r="2" fill="hsl(var(--gold))" opacity="0.7" />
          
          {/* Cardinal direction labels - period script style */}
          <text x="70" y="22" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="serif" fontWeight="bold">N</text>
          <text x="70" y="128" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="serif" opacity="0.7">S</text>
          <text x="128" y="72" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="serif" opacity="0.7">E</text>
          <text x="12" y="72" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="serif" opacity="0.7">W</text>
          
          {/* Intercardinal labels */}
          <text x="110" y="32" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.5">NE</text>
          <text x="110" y="112" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.5">SE</text>
          <text x="30" y="112" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.5">SW</text>
          <text x="30" y="32" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.5">NW</text>
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
            className="text-parchment/90 font-body text-base md:text-lg max-w-3xl mx-auto mb-6 leading-relaxed"
          >
            The Hot Pepper Trading Company is an online trading house devoted to peppers—prepared and offered as curated Cargo, and recorded in the Compendium from which they are drawn. Each cultivar is selected for its flavor profile, pungency, and regional provenance, then assembled into small Pepper Consortiums as availability allows. Alongside the Cargo, the Compendium preserves the history of peppers and the routes by which they traveled, offering context for what is traded as well as what is studied.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-parchment/70 font-heading italic text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-10"
          >
            The Cargo serves as our storefront. The Compendium serves as our record.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            {/* Market Button with Label */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.8 }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex flex-col items-center gap-2 text-parchment/60"
                >
                  <span className="text-xs uppercase tracking-widest font-body">Market</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </motion.div>
              <Button variant="pepper" size="xl" className="min-w-[220px] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_25px_hsla(6,75%,45%,0.5)]" asChild>
                <a href="#collection">View Current Consignment</a>
              </Button>
            </div>

            {/* Discover Button with Label */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                  className="flex flex-col items-center gap-2 text-parchment/60"
                >
                  <span className="text-xs uppercase tracking-widest font-body">Discover</span>
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </motion.div>
              <Button 
                variant="tyrian" 
                size="xl" 
                className="min-w-[220px] transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_0_25px_hsla(300,100%,18%,0.5)]"
                onClick={scrollToHeritage}
              >
                Learn About Our Heritage
              </Button>
            </div>
          </motion.div>
        </motion.div>

      </div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none hero-vignette" />
    </section>
  );
}
