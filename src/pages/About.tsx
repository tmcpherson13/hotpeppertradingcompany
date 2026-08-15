import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { SEO } from '@/components/SEO';
import { Footer } from '@/components/layout/Footer';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { LogoDivider } from '@/components/ui/LogoDivider';

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8 },
};

const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div {...fadeIn} className={className}>
    {children}
  </motion.div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About — Origins of This Venture"
        description="The founder's story: how a lifelong obsession with capsicum, cultivation, and pepper history grew into a small trading house for rare hot peppers."
        path="/about"
      />
      <Header />
      <main>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <TradeRoutePattern className="inset-0 w-full h-full" variant="subtle" opacity={0.06} />
          <div className="absolute inset-0 paper-texture opacity-25" />
          <div className="container relative z-10 max-w-3xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <LogoDivider variant="standard" size="sm" className="mb-8" />
              <h1 className="font-display text-4xl md:text-6xl text-foreground leading-tight mb-6">
                Origins of<br />
                <span className="font-heading italic text-primary normal-case">This Venture</span>
              </h1>
              <p className="text-muted-foreground font-body text-lg md:text-xl leading-relaxed">
                A brief (and truthful) account of how one person ends up founding a trading house for peppers instead of choosing more sensible ways to spend their evenings.
              </p>
              <LogoDivider variant="minimal" size="sm" className="mt-8" />
            </motion.div>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="container max-w-2xl mx-auto px-6 space-y-10">
            <Section>
              <p className="font-body text-foreground/90 text-lg md:text-xl leading-relaxed">
                My wife has long held a theory about me: I don't have hobbies—I have obsessions. And I pursue every one like it's a competition. She's not wrong; in fact, I drive her crazy with it.
              </p>
            </Section>
            <Section>
              <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                It began in Australia with a clearance-bin bonsai book and a half-dead tree from the local nursery. Within two years, I had 87 specimens, never quite accounting for the endless watering and care they demanded.
              </p>
            </Section>
            <Section>
              <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                Back in the US, it was poison dart frogs. Not just keeping them—I spent nearly a decade mastering museum-grade vivariums: controlled humidity, microfauna colonies, live moss walls, the full apparatus. My family was tolerant. Mostly.
              </p>
            </Section>
            <Section>
              <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                Fascination turned me into an amateur botanist, but Colorado's climate isn't kind to tropicals. So I added solar panels to the roof, LEDs in the basement, and eventually built a full basement greenhouse. What started as a modest aquaponics setup soon consumed most of the lower floor. The tipping point came with a 300-gallon stock tank stocked with 50 tilapia to power the nutrient cycle. I flooded the unfinished basement more than once—thankfully, it was unfinished. My wife had finally had enough, so I switched to traditional hydroponics.
              </p>
            </Section>
            <Section>
              <div className="border-l-2 border-primary/40 pl-6 italic text-foreground/70 font-body text-lg md:text-xl leading-relaxed">
                "What I grow now is primarily exotic hot peppers—the ones you won't find in any store."
              </div>
            </Section>
            <Section>
              <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                Truth be told, I've been obsessed with capsicum longer than any other pursuit. I love the heat, the layered flavors, the astonishing varietals, the endorphin rush—and yes, the history. Hot peppers were unknown outside the Americas until Christopher Columbus's return voyage in 1493. Within a century, they had spread across the globe, becoming defining elements in cuisines from Sichuan to West Africa to Hungary. That rapid, transformative journey is what drew me in deepest.
              </p>
            </Section>
            <Section>
              <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                I wanted to take this obsession and make something unique from it: a place to share the history, curate rare cultivars, and create niche, exclusive products that honor provenance over volume. My kids laugh at the website, saying no one will understand half the words and that I won't sell much. Fair point. But I don't mind. I'd rather build something truly different—even if it appeals only to a small circle of fellow pepper enthusiasts—than chase trends or broad appeal.
              </p>
            </Section>
            <Section>
              <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                My hope is that more people discover it as fascinating as I do: that they come here to explore the Compendium as a genuine resource, learn how varietals evolved across routes and centuries, and perhaps find a consortium or two that speaks to them.
              </p>
            </Section>
            <Section>
              <div className="bg-card border border-border p-8 space-y-3">
                <p className="font-heading text-foreground uppercase tracking-widest text-sm small-caps">A Note on Scale</p>
                <p className="font-body text-muted-foreground text-base leading-relaxed">
                  This is a small operation run by someone with strong opinions about capsicum and a basement that has definitely seen better days. Orders are packed by hand. The Compendium draws from primary sources and my own cultivation experience. Nothing here is automated except where it must be.
                </p>
              </div>
            </Section>
            <Section>
              <p className="font-body text-foreground/90 text-lg md:text-xl leading-relaxed italic">
                If you share even a fraction of this passion for the fire, the flavor, the story...welcome. You're exactly who this trading house was built for.
              </p>
              <div className="mt-8 space-y-1">
                <p className="font-heading text-foreground font-bold tracking-wide">Timothy McPherson</p>
                <p className="font-body text-muted-foreground text-sm">Founder, The Hot Pepper Trading Company</p>
              </div>
            </Section>
            <Section className="flex justify-center">
              <LogoDivider variant="ornate" size="md" />
            </Section>
          </div>
        </section>
        {/* Founding statement + the record we keep — plain type, deliberately undecorated */}
        <section className="py-16 md:py-24 border-t border-border/40">
          <div className="container max-w-2xl mx-auto px-6 space-y-6">
            <p className="font-body text-foreground/90 text-lg md:text-xl leading-relaxed">
              The Company dates itself to 1493. Not because it existed then, but because that is the year the trade began — the first year peppers were carried beyond the hemisphere that made them. Everything in the Compendium descends from that crossing. We keep the record from its opening entry.
            </p>
            <h2 className="font-heading text-2xl md:text-3xl text-foreground pt-6">On the Record We Keep</h2>
            <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
              The Hot Pepper Trading Company borrows the language of a merchant house — manifests, consignments, bills of lading — because that is how the movement of peppers was actually recorded. The routes on our chart are the routes that existed.
            </p>
            <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
              Those same routes carried people. The Atlantic trade that moved capsicum between the Americas, Africa, and the Caribbean was inseparable from the trade in enslaved human beings. Elmina and São Tomé appear on our chart as pepper ports. They were also slaving ports.
            </p>
            <p className="font-body text-foreground/80 text-base md:text-lg leading-relaxed">
              We use the aesthetic of that era. We make no claim that the era was romantic. Where a pepper's history runs through coercion, we say so in the entry rather than around it, and we do not name a product after a period of suffering.
            </p>
            <p className="font-body text-foreground/90 text-base md:text-lg leading-relaxed">
              The ledger is only worth keeping if it is accurate.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
