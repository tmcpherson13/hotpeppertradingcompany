import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { TradingCompany } from '@/components/sections/TradingCompany';
import { BrandPhilosophy } from '@/components/sections/BrandPhilosophy';
import { PepperEducation } from '@/components/sections/PepperEducation';
import { Heritage } from '@/components/sections/Heritage';
import { TradeRoutes } from '@/components/sections/TradeRoutes';
import { Newsletter } from '@/components/sections/Newsletter';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TradingCompany />
        <BrandPhilosophy />
        <Heritage />
        <PepperEducation />
        <TradeRoutes />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
