import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
    <section className="py-24 bg-background paper-texture">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="vintage-divider mb-8">
            <span className="text-accent text-xl px-4">✦</span>
          </div>

          <h2 className="font-display text-3xl md:text-4xl text-foreground font-semibold mb-4">
            The Merchant's Dispatch
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8">
            Receive tales from the trade routes, seasonal offerings, 
            and the wisdom of spice lore delivered to your correspondence.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 bg-card border-2 border-border font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <Button type="submit" variant="heritage" size="lg">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 font-body">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
