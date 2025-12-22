import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { PepperEducation } from '@/components/sections/PepperEducation';
import { FeaturedSpices } from '@/components/sections/FeaturedSpices';
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
        <PepperEducation />
        <TradeRoutes />
        <FeaturedSpices />
        <Heritage />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
