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
