import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TradeRouteDivider } from '@/components/ui/TradeRoutePattern';

export function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-16 bg-card paper-texture overflow-hidden">
      {/* Subtle route accent with Parallax */}
      <motion.div className="absolute inset-0 trade-route-bg" style={{ y: backgroundY }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <TradeRouteDivider className="mb-8" />

          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-4 text-engraved">
            Trade Correspondence
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8 leading-relaxed">
            Receive periodic updates on new arrivals, seasonal availability, 
            and notes on capsicum cultivars and cultivation.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-3 bg-parchment-dark border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors shadow-card"
            />
            <Button type="submit" variant="pepper" size="lg">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4 font-body">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
