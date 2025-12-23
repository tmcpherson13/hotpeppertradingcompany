import { motion } from 'framer-motion';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import antiqueMap from '@/assets/antique-map.jpg';

export function Heritage() {
  return (
    <section id="heritage" className="relative py-20 bg-background overflow-hidden">
      {/* Trade Route Background */}
      <TradeRoutePattern 
        className="inset-0 w-full h-full" 
        variant="subtle" 
        opacity={0.08} 
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden border-4 border-border shadow-deep">
              <img
                src={antiqueMap}
                alt="Antique compass rose map showing Mediterranean trade routes"
                className="w-full aspect-square object-cover"
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
            <div className="flex items-center gap-4">
              <svg width="20" height="20" viewBox="0 0 20 20" className="text-primary">
                <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="currentColor" />
              </svg>
              <span className="text-muted-foreground font-heading text-sm uppercase tracking-[0.25em] small-caps">
                Our Heritage
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl text-foreground leading-tight text-engraved">
              Guardians of the <br />
              <span className="font-heading italic text-primary normal-case">Ancient Routes</span>
            </h2>

            <div className="space-y-4 font-body text-muted-foreground text-lg leading-relaxed">
              <p>
                Capsicum peppers originated in the Americas more than six thousand years ago. 
                The Columbian Exchange carried them across every ocean, and within decades 
                they had become essential to cuisines that had never known them.
              </p>
              <p>
                We are fascinated by this history—the trade routes that carried peppers from 
                the Levant to Southeast Asia, the Indian subcontinent to the Americas. 
                Understanding where peppers come from and how they traveled helps us 
                appreciate their place in global culinary traditions.
              </p>
              <p>
                Our role is to celebrate these stories, document the varieties, and share 
                our passion for the remarkable journey of capsicum around the world.
              </p>
            </div>

            {/* Stats with route connectors */}
            <div className="relative grid grid-cols-3 gap-6 pt-8 border-t border-border mt-8">
              {/* Route line connecting stats */}
              <div className="absolute top-0 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              
              {[
                { value: '27', label: 'Countries' },
                { value: '150+', label: 'Artisan Growers' },
                { value: '500', label: 'Years of Trade' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center relative">
                  {/* Waypoint marker */}
                  <div className="absolute -top-[17px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/50" />
                  <div className="font-display text-2xl md:text-3xl text-foreground font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
