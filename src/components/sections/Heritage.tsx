import { motion } from 'framer-motion';
import antiqueMap from '@/assets/antique-map.jpg';

export function Heritage() {
  return (
    <section id="heritage" className="py-24 bg-card">
      <div className="container mx-auto px-4">
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
            {/* Decorative corner elements */}
            <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-accent" />
            <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-accent" />
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
              <span className="text-accent text-xl">✦</span>
              <span className="text-muted-foreground font-body text-sm uppercase tracking-[0.3em]">
                Our Heritage
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl text-foreground font-semibold leading-tight">
              Guardians of the <br />
              <span className="italic text-accent">Ancient Routes</span>
            </h2>

            <div className="space-y-4 font-body text-muted-foreground text-lg leading-relaxed">
              <p>
                For millennia, the spice trade shaped civilizations. Phoenician merchants 
                braved the Mediterranean, their ships laden with precious cargo—cinnamon 
                from Ceylon, pepper from Malabar, saffron from Persia.
              </p>
              <p>
                At Hot Pepper Trading Company, we honor this legacy. We work directly 
                with growers in the world's most storied spice regions, following 
                trade routes that have remained unchanged for centuries.
              </p>
              <p>
                Every jar we offer tells a story of geography, culture, and 
                generations of craft. This is not merely commerce—it is the 
                continuation of a tradition older than written history.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border mt-8">
              {[
                { value: '27', label: 'Countries' },
                { value: '150+', label: 'Artisan Growers' },
                { value: '3000', label: 'Years of Tradition' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
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
