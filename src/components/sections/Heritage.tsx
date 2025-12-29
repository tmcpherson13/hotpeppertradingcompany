import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { DropCap } from '@/components/ui/DropCap';
import heritageMap from '@/assets/heritage-map.jpg';
import logoDark from '@/assets/logo-dark.svg';

export function Heritage() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "10%"]);
  const ornamentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.15, 0.15, 0.1]);
  
  const scrollToEducation = () => {
    const educationSection = document.getElementById('pepper-education');
    if (educationSection) {
      educationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={sectionRef} id="heritage" className="relative py-20 bg-background overflow-hidden">
      {/* Trade Route Background */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full" 
        variant="subtle" 
        opacity={0.08} 
      />
      
      {/* Paper texture overlay */}
      <div className="absolute inset-0 z-[1] paper-texture opacity-30" />
      
      {/* Decorative vignette */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, hsla(28, 35%, 12%, 0.08) 100%)'
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image with Parallax */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden border-4 border-border shadow-deep">
              <motion.img
                src={heritageMap}
                alt="Stylized 17th century nautical map with compass rose and trade routes"
                className="w-full aspect-square object-cover scale-110"
                style={{ y: imageY }}
              />
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent" />
            </div>
            {/* Decorative corner elements - Tyrian Purple accent */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-primary" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-primary" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <img 
                  src={logoDark} 
                  alt="" 
                  className="h-12 w-auto transition-transform duration-300 hover:scale-110" 
                  aria-hidden="true" 
                />
                <span className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>
              <span className="text-foreground font-heading text-lg md:text-xl font-bold uppercase tracking-[0.25em] small-caps">
                Our Heritage
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight text-engraved">
              Guardians of the <br />
              <span className="font-heading italic text-primary normal-case">Ancient Routes</span>
            </h2>

            <div className="space-y-4 font-body text-muted-foreground text-xl md:text-2xl leading-relaxed">
              <DropCap>
                Capsicum peppers originated in the Americas more than six thousand years ago. 
                The Columbian Exchange carried them across every ocean, and within decades 
                they had become essential to cuisines that had never known them.
              </DropCap>
              <p>
                Hot Pepper Trading Company traces its work to these same routes—sourcing, 
                selecting, and presenting cultivars as cargo rather than commodity. We study 
                the corridors by which capsicum traveled from the Levant to Southeast Asia, 
                the Indian subcontinent, and back across the Atlantic.
              </p>
              <p>
                Our role is not to sell peppers, but to curate them—assembling collections 
                that honor the lineages, the growers, and the centuries of cultivation that 
                brought each variety to its present form.
              </p>
            </div>

          </motion.div>
        </div>

        {/* Old-School Compass Rose - Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-16"
        >
          <button
            onClick={scrollToEducation}
            className="group flex flex-col items-center gap-4 text-muted-foreground hover:text-primary transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg p-2"
            aria-label="Scroll to Historical Content"
          >
            <span className="text-xs uppercase tracking-[0.25em] font-heading">Explore the History</span>
            
            {/* Old-School Compass Rose with Floating Animation */}
            <motion.svg 
              width="80" 
              height="80" 
              viewBox="0 0 80 80" 
              className="text-primary"
              animate={{ 
                scale: [1, 1.05, 1],
                y: [0, -6, 0, 6, 0],
                rotate: [0, 1, -1, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer decorative ring */}
              <circle cx="40" cy="40" r="38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
              <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
              
              {/* Degree tick marks */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <line
                  key={angle}
                  x1={40 + 32 * Math.cos((angle - 90) * Math.PI / 180)}
                  y1={40 + 32 * Math.sin((angle - 90) * Math.PI / 180)}
                  x2={40 + 36 * Math.cos((angle - 90) * Math.PI / 180)}
                  y2={40 + 36 * Math.sin((angle - 90) * Math.PI / 180)}
                  stroke="currentColor"
                  strokeWidth={angle % 90 === 0 ? "1.5" : "0.8"}
                  opacity={angle % 90 === 0 ? "0.6" : "0.3"}
                />
              ))}
              
              {/* Intercardinal points (NE, SE, SW, NW) - smaller */}
              {[45, 135, 225, 315].map((angle) => (
                <polygon
                  key={angle}
                  points="40,22 43,40 40,44 37,40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  opacity="0.4"
                  transform={`rotate(${angle} 40 40)`}
                />
              ))}
              
              {/* Cardinal points - N, E, W */}
              <polygon points="40,12 44,40 40,46 36,40" fill="currentColor" opacity="0.3" transform="rotate(0 40 40)" />
              <polygon points="40,12 44,40 40,46 36,40" fill="currentColor" opacity="0.3" transform="rotate(90 40 40)" />
              <polygon points="40,12 44,40 40,46 36,40" fill="currentColor" opacity="0.3" transform="rotate(270 40 40)" />
              
              {/* SOUTH - Prominent main arrow pointing down */}
              <motion.g
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <polygon 
                  points="40,8 46,40 40,48 34,40" 
                  fill="hsl(var(--tyrian))"
                  transform="rotate(180 40 40)"
                />
                {/* Arrow decorative details */}
                <path 
                  d="M40 48 L40 68" 
                  stroke="hsl(var(--tyrian))" 
                  strokeWidth="2"
                />
                <polygon 
                  points="40,68 46,60 40,64 34,60" 
                  fill="hsl(var(--tyrian))"
                />
              </motion.g>
              
              {/* Center decorative ring */}
              <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
              <circle cx="40" cy="40" r="4" fill="hsl(var(--parchment))" stroke="currentColor" strokeWidth="1" />
              <circle cx="40" cy="40" r="2" fill="hsl(var(--tyrian))" opacity="0.6" />
              
              {/* Cardinal direction labels - old style */}
              <text x="40" y="10" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.5" fontFamily="serif">N</text>
              <text x="70" y="42" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.5" fontFamily="serif">E</text>
              <text x="10" y="42" textAnchor="middle" fontSize="6" fill="currentColor" opacity="0.5" fontFamily="serif">W</text>
            </motion.svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
