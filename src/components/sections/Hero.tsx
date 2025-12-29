import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-spice-trade-new.jpg';
import logoWhite from '@/assets/logo-white.svg';
import { useRef } from 'react';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';

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

      {/* Trade Route Pattern overlay */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full z-[1]" 
        variant="tyrian" 
        opacity={0.04} 
      />

      {/* Paper texture overlay */}
      <div className="absolute inset-0 z-[2] paper-texture opacity-20" />

      {/* Ornate Period-Accurate Compass Rose - Top Left with Floating Animation */}
      <motion.div 
        className="absolute top-20 left-8 md:left-16 opacity-25 pointer-events-none"
        animate={{ 
          rotate: [0, 2, -2, 0],
          y: [0, -8, 0, 8, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.svg 
          width="160" 
          height="160" 
          viewBox="0 0 160 160" 
          className="text-parchment"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Outermost decorative ring with flourishes */}
          <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          <circle cx="80" cy="80" r="74" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="72" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.5" />
          
          {/* Ornate outer flourish ring */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5 - 90) * Math.PI / 180;
            const x = 80 + 74 * Math.cos(angle);
            const y = 80 + 74 * Math.sin(angle);
            return (
              <circle key={`flourish-${i}`} cx={x} cy={y} r="2" fill="currentColor" opacity="0.4" />
            );
          })}
          
          {/* 32-point degree markers with ornate ends */}
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i * 11.25 - 90) * Math.PI / 180;
            const isCardinal = i % 8 === 0;
            const isIntercardinal = i % 4 === 0 && !isCardinal;
            const innerR = isCardinal ? 64 : isIntercardinal ? 66 : 68;
            const outerR = 72;
            return (
              <g key={i}>
                <line
                  x1={80 + innerR * Math.cos(angle)}
                  y1={80 + innerR * Math.sin(angle)}
                  x2={80 + outerR * Math.cos(angle)}
                  y2={80 + outerR * Math.sin(angle)}
                  stroke="currentColor"
                  strokeWidth={isCardinal ? 2 : isIntercardinal ? 1.2 : 0.5}
                  opacity={isCardinal ? 1 : isIntercardinal ? 0.8 : 0.4}
                />
                {isCardinal && (
                  <circle 
                    cx={80 + (outerR + 1) * Math.cos(angle)} 
                    cy={80 + (outerR + 1) * Math.sin(angle)} 
                    r="1.5" 
                    fill="currentColor" 
                    opacity="0.6" 
                  />
                )}
              </g>
            );
          })}
          
          {/* Inner decorative ring */}
          <circle cx="80" cy="80" r="64" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" strokeDasharray="2 2" />
          
          {/* North - Ornate fleur-de-lis pointer */}
          <g>
            {/* Main north pointer */}
            <polygon points="80,10 88,58 80,66 72,58" fill="currentColor" />
            {/* Gold accent */}
            <polygon points="80,10 84,28 80,22 76,28" fill="hsl(var(--gold))" opacity="0.7" />
            {/* Fleur-de-lis top */}
            <path d="M80,4 C84,8 88,6 88,2 C88,10 80,16 80,16 C80,16 72,10 72,2 C72,6 76,8 80,4" fill="currentColor" opacity="0.9" />
            {/* Fleur-de-lis side curls */}
            <path d="M72,10 C68,8 66,12 68,14 C66,10 72,8 72,10" fill="currentColor" opacity="0.7" />
            <path d="M88,10 C92,8 94,12 92,14 C94,10 88,8 88,10" fill="currentColor" opacity="0.7" />
          </g>
          
          {/* South pointer */}
          <g>
            <polygon points="80,150 88,102 80,94 72,102" fill="currentColor" opacity="0.6" />
            <polygon points="80,150 84,138 80,142 76,138" fill="currentColor" opacity="0.3" />
          </g>
          
          {/* East pointer */}
          <g>
            <polygon points="150,80 102,72 94,80 102,88" fill="currentColor" opacity="0.6" />
            <path d="M150,80 C146,76 142,78 144,82 C140,78 148,76 150,80" fill="currentColor" opacity="0.4" />
          </g>
          
          {/* West pointer */}
          <g>
            <polygon points="10,80 58,72 66,80 58,88" fill="currentColor" opacity="0.6" />
            <path d="M10,80 C14,76 18,78 16,82 C20,78 12,76 10,80" fill="currentColor" opacity="0.4" />
          </g>
          
          {/* Intercardinal ornate pointers */}
          <polygon points="24,24 58,64 66,64 64,56" fill="currentColor" opacity="0.45" />
          <polygon points="136,24 102,64 94,64 96,56" fill="currentColor" opacity="0.45" />
          <polygon points="24,136 58,96 66,96 64,104" fill="currentColor" opacity="0.45" />
          <polygon points="136,136 102,96 94,96 96,104" fill="currentColor" opacity="0.45" />
          
          {/* Decorative intercardinal diamonds */}
          {[45, 135, 225, 315].map((deg) => {
            const angle = (deg - 90) * Math.PI / 180;
            const x = 80 + 56 * Math.cos(angle);
            const y = 80 + 56 * Math.sin(angle);
            return (
              <polygon 
                key={deg}
                points={`${x},${y-3} ${x+2},${y} ${x},${y+3} ${x-2},${y}`}
                fill="hsl(var(--gold))"
                opacity="0.5"
              />
            );
          })}
          
          {/* Secondary intercardinal rays */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((deg) => {
            const angle = (deg - 90) * Math.PI / 180;
            return (
              <line
                key={deg}
                x1={80 + 28 * Math.cos(angle)}
                y1={80 + 28 * Math.sin(angle)}
                x2={80 + 54 * Math.cos(angle)}
                y2={80 + 54 * Math.sin(angle)}
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.35"
              />
            );
          })}
          
          {/* Center ornate rose */}
          <circle cx="80" cy="80" r="24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          <circle cx="80" cy="80" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          
          {/* Inner star pattern */}
          <polygon 
            points="80,60 83,74 97,74 86,83 90,97 80,88 70,97 74,83 63,74 77,74" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.8" 
            opacity="0.4"
          />
          
          {/* Center decorative rings */}
          <circle cx="80" cy="80" r="12" fill="hsl(var(--parchment))" fillOpacity="0.3" stroke="currentColor" strokeWidth="1" opacity="0.7" />
          <circle cx="80" cy="80" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
          <circle cx="80" cy="80" r="4" fill="hsl(var(--gold))" opacity="0.6" />
          <circle cx="80" cy="80" r="1.5" fill="hsl(var(--parchment))" />
          
          {/* Cardinal direction labels - ornate script */}
          <text x="80" y="28" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="serif" fontWeight="bold" fontStyle="italic">N</text>
          <text x="80" y="148" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="serif" opacity="0.6" fontStyle="italic">S</text>
          <text x="146" y="83" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="serif" opacity="0.6" fontStyle="italic">E</text>
          <text x="14" y="83" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="serif" opacity="0.6" fontStyle="italic">W</text>
          
          {/* Intercardinal labels */}
          <text x="126" y="38" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.4">NE</text>
          <text x="126" y="128" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.4">SE</text>
          <text x="34" y="128" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.4">SW</text>
          <text x="34" y="38" textAnchor="middle" fill="currentColor" fontSize="5" fontFamily="serif" opacity="0.4">NW</text>
        </motion.svg>
      </motion.div>


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

      {/* Bottom Right Compass Rose - Enhanced Visibility with Floating Animation */}
      <motion.div 
        className="absolute bottom-16 right-8 md:right-16 opacity-25 pointer-events-none"
        animate={{ 
          rotate: [0, 3, -3, 0],
          y: [0, -6, 0, 6, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.svg 
          width="160" 
          height="160"
          viewBox="0 0 100 100" 
          className="text-parchment"
          animate={{ 
            filter: [
              'drop-shadow(0 0 8px hsla(42, 72%, 48%, 0.3))',
              'drop-shadow(0 0 16px hsla(42, 72%, 48%, 0.5))',
              'drop-shadow(0 0 8px hsla(42, 72%, 48%, 0.3))'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Outer ring */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.4" />
          
          {/* Degree marks */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5 - 90) * Math.PI / 180;
            const isCardinal = i % 4 === 0;
            const innerR = isCardinal ? 36 : 39;
            return (
              <line
                key={i}
                x1={50 + innerR * Math.cos(angle)}
                y1={50 + innerR * Math.sin(angle)}
                x2={50 + 42 * Math.cos(angle)}
                y2={50 + 42 * Math.sin(angle)}
                stroke="currentColor"
                strokeWidth={isCardinal ? 2 : 0.8}
                opacity={isCardinal ? 0.9 : 0.5}
              />
            );
          })}
          
          {/* Cardinal points - North with gold accent */}
          <polygon points="50,6 55,38 50,44 45,38" fill="currentColor" opacity="0.8" />
          <polygon points="50,6 52,20 50,16 48,20" fill="hsl(var(--gold))" opacity="0.7" />
          
          {/* South */}
          <polygon points="50,94 55,62 50,56 45,62" fill="currentColor" opacity="0.5" />
          
          {/* East */}
          <polygon points="94,50 62,45 56,50 62,55" fill="currentColor" opacity="0.5" />
          
          {/* West */}
          <polygon points="6,50 38,45 44,50 38,55" fill="currentColor" opacity="0.5" />
          
          {/* Intercardinal points */}
          <polygon points="16,16 38,42 44,42 42,36" fill="currentColor" opacity="0.35" />
          <polygon points="84,16 62,42 56,42 58,36" fill="currentColor" opacity="0.35" />
          <polygon points="16,84 38,58 44,58 42,64" fill="currentColor" opacity="0.35" />
          <polygon points="84,84 62,58 56,58 58,64" fill="currentColor" opacity="0.35" />
          
          {/* Center decorative rings */}
          <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          <circle cx="50" cy="50" r="6" fill="hsl(var(--parchment))" fillOpacity="0.2" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
          <circle cx="50" cy="50" r="3" fill="hsl(var(--gold))" opacity="0.7" />
          
          {/* Cardinal direction labels */}
          <text x="50" y="24" textAnchor="middle" fill="currentColor" fontSize="6" fontFamily="serif" fontWeight="bold" fontStyle="italic" opacity="0.8">N</text>
        </motion.svg>
      </motion.div>

      {/* Animated navigation stars */}
      {[
        { x: '15%', y: '25%', delay: 0, size: 8 },
        { x: '85%', y: '35%', delay: 1.5, size: 6 },
        { x: '20%', y: '70%', delay: 3, size: 5 },
        { x: '75%', y: '75%', delay: 2, size: 7 },
      ].map((star, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: star.x, top: star.y }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: star.delay }}
        >
          <svg width={star.size * 2} height={star.size * 2} viewBox="0 0 12 12" className="text-parchment">
            <polygon 
              points="6,0 7,4.5 12,4.5 8,7.5 9.5,12 6,9 2.5,12 4,7.5 0,4.5 5,4.5" 
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}

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
            className="font-blackpearl text-4xl md:text-6xl lg:text-7xl text-parchment leading-tight mb-6 normal-case"
            style={{ textShadow: '0 0 20px hsla(42, 72%, 48%, 0.4), 0 0 40px hsla(42, 72%, 48%, 0.2), 0 2px 4px hsla(28, 35%, 10%, 0.5)' }}
          >
            Hot Pepper <br />
            <span className="text-gold">Trading Company</span>
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
