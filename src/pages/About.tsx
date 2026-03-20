import React from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
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
      <Header />
      <main>
        <section className="relative pt-32 pb-20 overflow-hidden">
          <TradeRoutePattern className="inset-0 w-full h-full" variant="subtle" opacity={0.06} />
          <div className="absolute inset-0 paper-texture opacity-25" />
          <div className="container relative z-10 max-w-3xl mx-auto px-6 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
              <LogoDivider variant="standard" size="sm" className="mb-8" />
              <h1 className="font-display text-4xl md:text-6xl text-foreground leading-tight mb-6">

                The Man Behind<br />
                <span className="font-heading italic text-primary normal-case">the Freezer Full of Peppers</span>
              </h1>
              <p className="text-muted-foreground font-body text-lg md:text-xl leading-relaxed">
                A brief accounting of how a person ends up building a pepper compendium instead of doing something sensible with their evenings.
              </p>
              <LogoDivider variant="minimal" size="sm" className="mt-8" />
            </motion.div>
          </div>
        </section>
        <section className="py-16 md:py-24">
          <div className="container max-w-2xl mx-auto px-6 space-y-16">
            <Section>
              <p className="font-body text-foreground/90 text-lg md:text-xl leading-relaxed">
                My wife has a theory about me. It is not a flattering theory, but it has the virtue of being accurate: when I find something interesting, I don't pursue a hobby. I build an infrastructure.
              </p>
            </Section>
            <Section>
              <h2 className="font-heading text-2xl text-foreground uppercase tracking-widest mb-4 small-caps">The Pattern</h2>
              <div className="space-y-5 font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                <p>It started with Poison Dart Frogs. Not just keeping them — I spent the better part of a decade learning to build museum-grade vivariums. Controlled humidity, microfauna colonies, live moss walls, the whole apparatus. My family was tolerant. Mostly.</p>
                <p>Then came the basement. What began as a modest aquaponics system eventually consumed most of the lower floor. I became an amateur botanist by necessity, then by genuine fascination. A significant portion of that operation was dedicated to exotic hot peppers. This is where things started to get specific.</p>
                <p>For over twenty years I have practiced bonsai. In recent years I have been training bonsai from hot pepper plants — a discipline that combines the patience of classical bonsai with the particular stubbornness of capsicum. It is, objectively, a niche within a niche. I consider this a feature.</p>
              </div>
            </Section>
            <Section>
              <div className="border-l-2 border-primary/40 pl-6 italic text-foreground/70 font-body text-lg md:text-xl leading-relaxed">
                "The frogs needed a rainforest. The peppers needed a farm. The bonsai needed decades. None of this seemed unreasonable at the time."
              </div>
            </Section>
            <Section>
              <h2 className="font-heading text-2xl text-foreground uppercase tracking-widest mb-4 small-caps">The Academic Detour</h2>
              <div className="space-y-5 font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                <p>I studied behavioral economics — Oxford dissertation, years of operational leadership after that. The central insight is that people are not machines. They make decisions based on framing, emotion, context, and a catalogue of predictable irrationalities.</p>
                <p>This turns out to be excellent preparation for building something obsessive and niche. Understanding why people value what they value informs everything from how we present a pepper's origin story to why provenance matters more than Scoville units to serious buyers.</p>
                <p>People don't buy hot sauce. They buy a story they want to be part of. The behavioral economics background helps me build that story honestly.</p>
              </div>
            </Section>
            <Section>
              <h2 className="font-heading text-2xl text-foreground uppercase tracking-widest mb-4 small-caps">Why Peppers</h2>
              <div className="space-y-5 font-body text-foreground/80 text-base md:text-lg leading-relaxed">
                <p>Hot peppers have everything I find interesting compressed into a single subject. Thousands of cultivars, each with a distinct flavor profile, heat signature, and regional character. The history is remarkable — capsicum originated in the Americas over six thousand years ago, and within decades of the Columbian Exchange had become essential to cuisines that had never known it.</p>
                <p>Trade routes, colonial economics, agricultural adaptation, cultural transformation — it is all there in a single genus. And then at the end of the study, you get to eat something extraordinary.</p>
                <p>The Compendium is the record of what I have learned. The Trading Post is what I have grown. The freezer is what happens when both projects proceed simultaneously without adequate planning.</p>
              </div>
            </Section>
            <Section>
              <div className="bg-card border border-border p-8 text-center space-y-3">
                <p className="font-heading text-foreground uppercase tracking-widest text-sm small-caps">A Note on Scale</p>
                <p className="font-body text-muted-foreground text-base leading-relaxed">This is a small operation run by one person with strong opinions about capsicum and a basement that has seen better days. Orders are fulfilled by hand. The Compendium is written from primary sources and personal cultivation. Nothing here is automated except the parts that have to be.</p>
                <p className="font-body text-foreground/60 text-sm italic">— Timothy McPherson, founder</p>
              </div>
            </Section>
            <Section className="flex justify-center">
              <LogoDivider variant="ornate" size="md" />
            </Section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
