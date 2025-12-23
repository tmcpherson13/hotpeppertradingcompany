import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TradeRouteDivider } from '@/components/ui/TradeRoutePattern';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section id="contact" className="relative py-16 bg-card paper-texture overflow-hidden">
      {/* Subtle route accent */}
      <div className="absolute inset-0 trade-route-bg" />
      
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
