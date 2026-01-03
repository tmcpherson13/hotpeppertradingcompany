import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sprout, Thermometer, Droplets, Sun, Calendar, Leaf, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { LogoDivider } from '@/components/ui/LogoDivider';
import logoDark from '@/assets/logo-dark.svg';

export default function SeedStartingGuide() {
  const heroRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative py-24 md:py-32 overflow-hidden"
        >
          {/* Parallax background pattern */}
          <motion.div 
            className="absolute inset-0 bg-card"
            style={{ y: backgroundY }}
          />
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-background/60" />
          
          <TradeRoutePattern 
            className="inset-0 w-full h-full" 
            variant="subtle" 
            opacity={0.04} 
          />
          
          <img 
            src={logoDark} 
            alt="Hot Pepper Trading Company" 
            className="absolute top-12 right-8 md:right-20 w-[186px] h-[186px] object-contain mix-blend-multiply opacity-80 z-10"
          />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              {/* Back Navigation */}
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-body"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Home
              </Link>
              
              {/* Header */}
              <div className="text-center mb-12">
                <LogoDivider variant="standard" size="md" className="mb-6" />
                
                <p className="text-muted-foreground font-heading text-base md:text-lg uppercase tracking-[0.3em] mb-4 small-caps">
                  A Cultivator's Companion
                </p>
                
                <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6 text-engraved leading-tight">
                  Seed Starting Guide<br />
                  <span className="text-3xl md:text-4xl font-heading italic font-normal tracking-normal">
                    for Capsicum Cultivars
                  </span>
                </h1>
                
                <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  From dormant seed to vigorous seedling—the traditional methods and 
                  essential wisdom for germinating peppers of every heat level.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Article Content */}
        <article className="relative py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              
              {/* Introduction */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sprout className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    The Art of Pepper Propagation
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4 first-letter:text-5xl first-letter:font-display first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    The journey from pepper seed to harvest begins with patience and precision. 
                    Unlike quick-germinating annuals, capsicum seeds demand specific conditions 
                    that mirror their tropical origins—consistent warmth, steady moisture, and 
                    the gentle encouragement of light. Master these fundamentals, and you shall 
                    cultivate peppers of remarkable vigor and abundant yield.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Whether you seek to grow the mild bell peppers that grace summer salads or 
                    the fearsome superhots that challenge the boldest palate, the principles 
                    remain constant. This guide distills centuries of horticultural wisdom into 
                    practical counsel for the modern cultivator.
                  </p>
                </div>
              </motion.section>

              {/* Timing Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Timing the Sowing
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Peppers require a long growing season—typically 60 to 100 days from 
                    transplant to first harvest, with superhot cultivars often demanding 
                    120 days or more. Begin seeds indoors 8 to 12 weeks before your last 
                    expected frost date.
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Timing by Cultivar Type
                    </h4>
                    <ul className="space-y-2 font-body text-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Sweet & Mild (Annuum)</strong> — Start 8 weeks before last frost</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Hot Peppers (Annuum/Frutescens)</strong> — Start 10 weeks before last frost</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Chinense Varieties</strong> — Start 10-12 weeks (habaneros, scotch bonnets)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Superhots</strong> — Start 12+ weeks (reapers, scorpions, bhut jolokia)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Baccatum & Pubescens</strong> — Start 12 weeks (rocotos, ajis)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.section>

              {/* Temperature Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Thermometer className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Temperature: The Critical Factor
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    More than any other variable, soil temperature determines germination 
                    success. Seeds planted in cool soil will rot before they sprout. The 
                    optimal range lies between 80°F and 90°F (27°C–32°C), with germination 
                    rates dropping precipitously below 70°F (21°C).
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "A heat mat beneath your seed trays is not luxury—it is necessity. 
                    The difference between success and failure often lies in those 
                    critical ten degrees."
                  </blockquote>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                    <div className="bg-background/50 border border-border p-4">
                      <h5 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Optimal Range
                      </h5>
                      <p className="font-display text-2xl text-foreground">80–90°F</p>
                      <p className="font-body text-sm text-muted-foreground">(27–32°C)</p>
                    </div>
                    <div className="bg-background/50 border border-border p-4">
                      <h5 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Minimum Threshold
                      </h5>
                      <p className="font-display text-2xl text-foreground">70°F</p>
                      <p className="font-body text-sm text-muted-foreground">(21°C)</p>
                    </div>
                  </div>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Seedling heat mats provide consistent bottom heat and can reduce 
                    germination time by half. Place the mat beneath your tray and use a 
                    thermostat probe inserted into the soil to maintain precise control.
                  </p>
                </div>
              </motion.section>

              {/* Moisture Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Droplets className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Moisture Management
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Pepper seeds require consistent moisture but never saturated conditions. 
                    The goal is a medium that feels like a wrung-out sponge—damp throughout 
                    but not dripping. Humidity domes or plastic wrap over trays maintain 
                    moisture during the germination period.
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    Recommended Growing Medium
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Use a sterile, soilless seed-starting mix composed of peat moss or coco 
                    coir, perlite, and vermiculite. Avoid garden soil, which harbors 
                    pathogens and compacts too readily. Pre-moisten the mix before filling 
                    cells to ensure even hydration.
                  </p>
                  
                  <div className="bg-background/50 border border-primary/20 p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Pre-Soaking for Stubborn Seeds
                    </h4>
                    <p className="font-body text-foreground">
                      Superhot and chinense seeds benefit from a 12–24 hour soak in warm 
                      water before planting. Some growers add a dilute hydrogen peroxide 
                      solution (1 teaspoon per cup of water) to soften seed coats and 
                      discourage fungal growth.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Light Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Sun className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Light Requirements
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    While pepper seeds can germinate in darkness, emerging seedlings 
                    require abundant light immediately upon sprouting. Insufficient light 
                    produces weak, leggy seedlings prone to disease and transplant shock.
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Light Guidelines
                    </h4>
                    <ul className="space-y-2 font-body text-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Duration:</strong> 14–16 hours of light daily</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Intensity:</strong> 200–400 PPFD (photosynthetic photon flux density)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Height:</strong> Position lights 2–4 inches above seedlings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Type:</strong> Full-spectrum LED or T5 fluorescent fixtures</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Window light, even south-facing, rarely provides sufficient intensity 
                    in winter months. Invest in dedicated grow lights to ensure stocky, 
                    vigorous seedlings.
                  </p>
                </div>
              </motion.section>

              {/* Germination Timeline */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Leaf className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Expected Germination Times
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Patience is essential. Unlike tomato seeds that sprout in days, pepper 
                    seeds often require one to four weeks, depending on cultivar and 
                    conditions. Do not despair if trays appear dormant—consistent warmth 
                    and moisture will eventually yield results.
                  </p>
                  
                  <div className="space-y-4 my-8">
                    <div className="flex items-center gap-4 p-4 bg-background/50 border border-border">
                      <div className="w-20 text-center">
                        <span className="font-display text-lg text-foreground">5–10</span>
                        <span className="font-body text-sm text-muted-foreground block">days</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-heading text-sm uppercase tracking-wider text-muted-foreground">Annuum Types</p>
                        <p className="font-body text-foreground">Jalapeño, Cayenne, Bell, Serrano</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-background/50 border border-border">
                      <div className="w-20 text-center">
                        <span className="font-display text-lg text-foreground">10–21</span>
                        <span className="font-body text-sm text-muted-foreground block">days</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-heading text-sm uppercase tracking-wider text-muted-foreground">Chinense Types</p>
                        <p className="font-body text-foreground">Habanero, Scotch Bonnet, Datil</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-background/50 border border-border">
                      <div className="w-20 text-center">
                        <span className="font-display text-lg text-foreground">14–28</span>
                        <span className="font-body text-sm text-muted-foreground block">days</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-heading text-sm uppercase tracking-wider text-muted-foreground">Superhots</p>
                        <p className="font-body text-foreground">Carolina Reaper, Scorpion, Ghost, Pepper X</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-background/50 border border-border">
                      <div className="w-20 text-center">
                        <span className="font-display text-lg text-foreground">14–30</span>
                        <span className="font-body text-sm text-muted-foreground block">days</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-heading text-sm uppercase tracking-wider text-muted-foreground">Pubescens (Rocoto)</p>
                        <p className="font-body text-foreground">Requires cooler temps (65–75°F preferred)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Step by Step */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Step-by-Step Procedure
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <ol className="space-y-6 font-body text-foreground">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-display text-lg rounded-full">1</span>
                      <div>
                        <strong className="font-heading">Prepare the Medium</strong>
                        <p className="mt-1">Pre-moisten seed-starting mix until evenly damp but not soggy. Fill cells to within ¼ inch of the top and lightly tamp.</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-display text-lg rounded-full">2</span>
                      <div>
                        <strong className="font-heading">Sow Seeds</strong>
                        <p className="mt-1">Plant seeds ¼ inch deep, two per cell. Cover lightly with medium and press gently to ensure contact.</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-display text-lg rounded-full">3</span>
                      <div>
                        <strong className="font-heading">Apply Bottom Heat</strong>
                        <p className="mt-1">Place tray on heat mat set to 85°F (29°C). Cover with humidity dome or plastic wrap.</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-display text-lg rounded-full">4</span>
                      <div>
                        <strong className="font-heading">Monitor Daily</strong>
                        <p className="mt-1">Check moisture levels and remove dome briefly each day to prevent damping-off. Mist if surface appears dry.</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-display text-lg rounded-full">5</span>
                      <div>
                        <strong className="font-heading">Upon Emergence</strong>
                        <p className="mt-1">Remove dome immediately when sprouts appear. Position under grow lights and reduce heat mat to 75°F (24°C).</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-display text-lg rounded-full">6</span>
                      <div>
                        <strong className="font-heading">Thin Seedlings</strong>
                        <p className="mt-1">Once true leaves develop, snip the weaker seedling at soil level. Begin light feeding with quarter-strength fertilizer.</p>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-display text-lg rounded-full">7</span>
                      <div>
                        <strong className="font-heading">Transplant</strong>
                        <p className="mt-1">When seedlings have 4–6 true leaves and outdoor temperatures remain above 60°F (16°C) at night, harden off over 7–10 days before planting out.</p>
                      </div>
                    </li>
                  </ol>
                </div>
              </motion.section>

              {/* Troubleshooting */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="bg-background/50 border border-border p-8">
                  <h3 className="font-display text-xl text-foreground mb-6">
                    Common Troubles & Remedies
                  </h3>
                  
                  <div className="space-y-6 font-body text-foreground">
                    <div>
                      <h4 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Seeds Fail to Germinate
                      </h4>
                      <p>
                        Most often caused by insufficient heat. Verify soil temperature with a 
                        probe thermometer. Old seeds may also have reduced viability—purchase 
                        fresh seed from reputable sources.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Leggy Seedlings
                      </h4>
                      <p>
                        Indicates inadequate light. Move lights closer or increase duration. 
                        A small fan providing gentle air movement also strengthens stems.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Damping Off
                      </h4>
                      <p>
                        Fungal disease causing seedlings to topple at soil level. Improve 
                        airflow, reduce moisture, and use sterile medium. Remove affected 
                        seedlings immediately.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-heading text-sm uppercase tracking-wider text-muted-foreground mb-2">
                        Purple Leaves
                      </h4>
                      <p>
                        Often indicates phosphorus deficiency, exacerbated by cold roots. 
                        Warm the growing medium and ensure adequate nutrition.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>

            </div>
          </div>
        </article>

        {/* Navigation Footer */}
        <section className="py-16 bg-background border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="font-display text-2xl text-foreground mb-4">
                Continue Your Journey
              </h3>
              <p className="font-body text-muted-foreground mb-8">
                Explore our Pepper Compendium to discover cultivars suited to your growing 
                conditions and culinary aspirations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  to="/compendium"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-heading uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
                >
                  Browse the Compendium
                </Link>
                <Link 
                  to="/trading-post"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-heading uppercase tracking-wider text-sm hover:bg-muted transition-colors"
                >
                  Visit the Trading Post
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
