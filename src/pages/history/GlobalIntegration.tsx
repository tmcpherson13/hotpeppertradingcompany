import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Flame, MapPin, TrendingUp, FlaskConical, ChefHat } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { CitationLink, Citation } from '@/components/history/CitationLink';
import logoDark from '@/assets/logo-dark.jpg';

const citations: Citation[] = [
  {
    id: 1,
    authors: "FAO",
    year: "2023",
    title: "FAOSTAT: Crops and Livestock Products",
    publication: "Food and Agriculture Organization of the United Nations",
    url: "https://www.fao.org/faostat/en/#data/QCL"
  },
  {
    id: 2,
    authors: "Bosland, P.W. & Votava, E.J.",
    year: "2012",
    title: "Peppers: Vegetable and Spice Capsicums",
    publication: "CABI Publishing, 2nd Edition",
    doi: "10.1079/9781845938253.0000"
  },
  {
    id: 3,
    authors: "DeWitt, D. & Bosland, P.W.",
    year: "2009",
    title: "The Complete Chile Pepper Book",
    publication: "Timber Press, Portland"
  },
  {
    id: 4,
    authors: "Scoville, W.L.",
    year: "1912",
    title: "A Note on Capsicums",
    publication: "Journal of the American Pharmaceutical Association, 1(5), 453-454",
    doi: "10.1002/jps.3080010520"
  },
  {
    id: 5,
    authors: "Tewksbury, J.J. & Nabhan, G.P.",
    year: "2001",
    title: "Seed dispersal: Directed deterrence by capsaicin in chilies",
    publication: "Nature, 412(6845), 403-404",
    doi: "10.1038/35086653"
  },
  {
    id: 6,
    authors: "Rozin, P. & Schiller, D.",
    year: "1980",
    title: "The nature and acquisition of a preference for chili pepper by humans",
    publication: "Motivation and Emotion, 4(1), 77-101",
    doi: "10.1007/BF00995932"
  }
];

export default function GlobalIntegration() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-background paper-texture overflow-hidden">
          <TradeRoutePattern 
            className="inset-0 w-full h-full" 
            variant="subtle" 
            opacity={0.04} 
          />
          
          <img 
            src={logoDark} 
            alt="Hot Pepper Trading Company" 
            className="absolute top-12 right-8 md:right-20 w-[186px] h-[186px] object-contain mix-blend-multiply opacity-80"
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
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  <Globe className="w-6 h-6 text-primary" />
                  <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                
                <p className="text-muted-foreground font-heading text-sm uppercase tracking-[0.3em] mb-4 small-caps">
                  A Historical Treatise
                </p>
                
                <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6 text-engraved leading-tight">
                  Global Integration<br />
                  <span className="text-3xl md:text-4xl font-heading italic font-normal tracking-normal">
                    The Pepper in the Modern World
                  </span>
                </h1>
                
                <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  From regional curiosity to global commodity—how chili peppers became 
                  one of the most widely cultivated spices on Earth.
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
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Introduction
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4 first-letter:text-5xl first-letter:font-display first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    By the end of the Columbian Exchange, chili peppers had established 
                    themselves on every major continent touched by European trade. But 
                    their story was far from complete. In the centuries that followed, 
                    peppers would undergo a remarkable transformation—from exotic novelty 
                    to regional staple to global commodity.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Today, <em>Capsicum</em> species rank among the most widely cultivated 
                    spice crops in the world. An estimated 36 million metric tons of fresh 
                    and dried peppers are produced annually, grown in nearly every country 
                    with suitable climate. They define regional cuisines from Sichuan to 
                    Hungary to West Africa, provide livelihoods for millions of farmers, 
                    and sustain a global hot sauce industry worth billions of dollars.<sup>[1]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    This final chapter traces the modern history of the chili pepper—its 
                    regional adaptations, its rise as a global commodity, and the science 
                    that has revealed why humans are drawn to its burning embrace.
                  </p>
                </div>
              </motion.section>

              {/* Regional Mastery: East Asia */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <ChefHat className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Regional Mastery: East Asia
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    Sichuan: The Art of Málà
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Sichuan Province stands as perhaps the world's most celebrated pepper 
                    culture. Here, the "facing-heaven" pepper (<em>cháotiān jiāo</em>) is 
                    combined with the native Sichuan peppercorn (<em>huājiāo</em>) to 
                    create <em>málà</em>—the signature "numbing-spicy" sensation that 
                    defines the regional cuisine. This dual heat, unknown elsewhere in 
                    the world, produces a complex sensory experience that has captivated 
                    food lovers globally.<sup>[3]</sup>
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    Korea: Gochugaru and National Identity
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Korea's adoption of the chili pepper ranks among the most transformative 
                    in culinary history. <em>Gochugaru</em>—Korean red pepper flakes—became 
                    the essential ingredient in <em>kimchi</em>, transforming a traditional 
                    fermented vegetable preparation into a spicy national symbol. Today, 
                    kimchi is integral to Korean identity, consumed at virtually every meal 
                    and recognized by UNESCO as an intangible cultural heritage.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The fermented pepper paste <em>gochujang</em> further extended the 
                    pepper's reach into Korean cuisine, providing a complex, sweet-spicy 
                    foundation for countless dishes. Korean peppers, selected over centuries 
                    for moderate heat and fruity sweetness, represent a distinct cultivar 
                    group uniquely adapted to local tastes.
                  </p>
                </div>
              </motion.section>

              {/* Regional Mastery: South Asia */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Regional Mastery: South Asia
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    India today stands as both the world's largest producer and largest 
                    consumer of chili peppers, cultivating approximately 1.5 million 
                    metric tons annually across diverse regional varieties. The integration 
                    is so complete that many Indians are surprised to learn the pepper is 
                    not indigenous.<sup>[1]</sup>
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Major Indian Pepper Varieties
                    </h4>
                    <ul className="space-y-2 font-body text-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Kashmiri Chili</strong> — Mild heat, deep red color; prized for curries</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Guntur Sannam</strong> — Andhra Pradesh's fierce export; India's spiciest</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Byadgi</strong> — Karnataka's wrinkled beauty; low heat, brilliant color</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Bhut Jolokia</strong> — Northeast India's "ghost pepper"; once world's hottest</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Beyond cuisine, peppers hold significance in Indian traditional medicine 
                    (Ayurveda), where they are considered heating and stimulating, useful 
                    for digestive complaints and cold conditions. This dual role—culinary 
                    and medicinal—mirrors their use in pre-Columbian Mesoamerica, suggesting 
                    a universal recognition of the pepper's physiological effects.
                  </p>
                </div>
              </motion.section>

              {/* Regional Mastery: Africa & Middle East */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Regional Mastery: Africa & Middle East
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Africa's pepper traditions span the continent, each region developing 
                    distinctive approaches. The <em>peri-peri</em> (or piri-piri) tradition 
                    of Portuguese Africa—Mozambique, Angola, and their diaspora—centers on 
                    the small, fiery African bird's eye pepper, used in marinades and sauces 
                    that have gained international recognition.
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "In Ethiopian cuisine, berbere is not merely a spice blend but a 
                    cultural identity, its preparation passed down through generations 
                    with the care accorded to sacred knowledge."
                    <footer className="text-muted-foreground text-base font-body not-italic mt-2">
                      — Marcus Samuelsson, chef
                    </footer>
                  </blockquote>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Ethiopian <em>berbere</em>—a complex blend of chili peppers with 
                    cardamom, coriander, fenugreek, and other spices—forms the foundation 
                    of that nation's unique cuisine. North African <em>harissa</em>, the 
                    fiery paste of roasted peppers, garlic, and spices, has spread far 
                    beyond its Tunisian origins to become an international condiment.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The Middle East developed its own pepper traditions, notably the 
                    Aleppo pepper of Syria (now endangered by conflict) and the Urfa 
                    pepper of Turkey—both distinguished by their complex, raisin-like 
                    sweetness developed through sun-drying processes.
                  </p>
                </div>
              </motion.section>

              {/* Regional Mastery: The Americas */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Flame className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Regional Mastery: The Americas
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    In their homeland, peppers never ceased to evolve. Mexico remains 
                    the world's center of <em>Capsicum</em> diversity, home to hundreds 
                    of distinct varieties ranging from the mild poblano to the scorching 
                    habanero. Mexican cuisine distinguishes carefully between fresh and 
                    dried peppers—each with its own name and culinary application—in a 
                    sophistication unmatched elsewhere.<sup>[3]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The United States developed its own pepper culture, centered initially 
                    in Louisiana and the Southwest. Tabasco sauce, first produced in 1868 
                    on Avery Island, Louisiana, became America's first nationally distributed 
                    hot sauce and remains an icon. The New Mexico chile industry, dating to 
                    Spanish colonial times, produces distinctive Hatch and Chimayó varieties 
                    that inspire annual harvest celebrations.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The Caribbean, despite its small landmass, contributed disproportionately 
                    to pepper diversity. The Scotch bonnet—essential to Jamaican jerk—and 
                    its relatives spread throughout the islands, each developing local 
                    variations suited to regional tastes.
                  </p>
                </div>
              </motion.section>

              {/* Regional Mastery: Europe */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Regional Mastery: Europe
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Hungary stands alone among European nations in making the pepper 
                    central to national cuisine. <em>Paprika</em>—the word itself Hungarian 
                    in origin—defines dishes from <em>gulyás</em> to <em>paprikás csirke</em>. 
                    The Kalocsa and Szeged regions hold protected status for their paprika 
                    production, carefully grading varieties by heat and sweetness.<sup>[2]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Spain developed <em>pimentón</em>—smoked paprika—in the Extremadura 
                    and La Vera regions, where peppers are dried over oak fires to produce 
                    a distinctively smoky spice essential to chorizo and countless other 
                    dishes. The technique may derive from pre-Columbian smoking methods, 
                    carried back by returning conquistadors.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Italian cuisine, generally restrained in its use of heat, nevertheless 
                    developed regional pepper traditions. Calabrian chili—grown in the 
                    southern toe of Italy—provides the gentle fire in <em>nduja</em>, 
                    the spreadable salami that has conquered restaurant menus worldwide.
                  </p>
                </div>
              </motion.section>

              {/* Modern Production and Trade */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Modern Production and Trade
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Global pepper production has increased dramatically in the modern era. 
                    China now produces more than 50% of the world's peppers, followed by 
                    Mexico, Turkey, Indonesia, and Spain. India, while a major producer, 
                    consumes nearly all of its domestic crop.<sup>[1]</sup>
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Global Pepper Industry Statistics
                    </h4>
                    <ul className="space-y-2 font-body text-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Annual Production</strong> — ~36 million metric tons globally</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Top Producer</strong> — China (~18 million metric tons)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Hot Sauce Market</strong> — $3.7 billion globally (2023)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Varieties Cultivated</strong> — 3,000+ named varieties worldwide</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The hot sauce industry has exploded in the 21st century. What was once 
                    a niche market—Tabasco, Cholula, Sriracha—has become a global 
                    phenomenon. Craft hot sauce makers number in the thousands, and the 
                    "superhot" pepper movement has pushed cultivars to unprecedented heat 
                    levels.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The Carolina Reaper, developed by Ed Currie and certified as the 
                    world's hottest pepper in 2013, exceeded 2 million Scoville Heat 
                    Units—400 times hotter than a jalapeño. Its successor, Pepper X, 
                    has since claimed the record. These extremes, while impractical for 
                    everyday cuisine, demonstrate the ongoing human fascination with 
                    capsicum's burning potential.
                  </p>
                </div>
              </motion.section>

              {/* The Science of Capsaicin */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    The Science of Capsaicin
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Modern science has revealed the mechanism behind the pepper's burn. 
                    Capsaicin, the molecule responsible for pungency, binds to the TRPV1 
                    receptor—the same receptor activated by physical heat. The brain, 
                    receiving signals it interprets as burning, responds with pain signals 
                    and, crucially, a flood of endorphins.<sup>[5]</sup>
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "Humans are the only species that deliberately seeks out chemically 
                    induced oral pain. We have turned a plant's defense mechanism into 
                    a source of pleasure."
                    <footer className="text-muted-foreground text-base font-body not-italic mt-2">
                      — Paul Rozin, psychologist<sup>[6]</sup>
                    </footer>
                  </blockquote>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    This endorphin release may explain why humans—alone among mammals—seek 
                    out spicy food. The phenomenon, termed "benign masochism" by psychologist 
                    Paul Rozin, allows us to enjoy the thrill of pain while knowing we are 
                    in no actual danger. Chili eating becomes, in effect, a controlled 
                    adventure.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Wilbur Scoville developed his famous scale in 1912, measuring pepper 
                    heat through organoleptic testing—trained tasters determining how much 
                    sugar-water dilution was required to neutralize the burn. Modern methods 
                    use high-performance liquid chromatography (HPLC) for precision, but 
                    Scoville Heat Units remain the standard measure.<sup>[4]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Medical applications of capsaicin have expanded dramatically. Topical 
                    capsaicin creams treat arthritis and neuropathic pain; the compound 
                    is under investigation for cancer treatment, weight loss, and 
                    cardiovascular health. The pepper that began as a Mesoamerican 
                    seasoning has become a pharmaceutical of genuine promise.
                  </p>
                </div>
              </motion.section>

              {/* Conclusion */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Conclusion: A Six-Thousand-Year Journey
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    From the wild chiltepin of prehistoric Mexico to the Carolina Reaper 
                    of modern South Carolina, the chili pepper has traveled an extraordinary 
                    path. Domesticated some 6,000 years ago by the ancestors of the Maya 
                    and Aztec, carried across the world by Spanish and Portuguese ships, 
                    adopted and adapted by cultures on every inhabited continent—<em>Capsicum</em> 
                    has proven itself one of the most successful cultivated plants in 
                    human history.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Today, peppers are so thoroughly integrated into global cuisines that 
                    their American origins are often forgotten. Thai food without chili, 
                    Indian curry without heat, Sichuan cooking without <em>málà</em>—these 
                    are unimaginable to modern palates, yet none of these traditions 
                    existed before the Columbian Exchange.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The story of the chili pepper is, in microcosm, the story of 
                    globalization itself—of discovery and exchange, adaptation and 
                    transformation. It reminds us that the foods we consider essential 
                    to our cultures are often immigrants themselves, brought by trade 
                    and travel, shaped by local tastes and conditions, until they become 
                    inseparable from our identities. The pepper's journey continues, 
                    as breeders develop new varieties, chefs discover new applications, 
                    and millions of people around the world reach, once again, for that 
                    irresistible burn.
                  </p>
                </div>
              </motion.section>

              {/* Citations */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="pt-8 border-t border-border"
              >
                <h2 className="font-display text-2xl text-foreground mb-6">
                  References & Citations
                </h2>
                
                <ol className="space-y-4 list-none">
                  {citations.map((citation) => (
                    <CitationLink key={citation.id} citation={citation} />
                  ))}
                </ol>
              </motion.section>

              {/* Navigation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <Link 
                  to="/history/columbian-exchange" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous: The Columbian Exchange
                </Link>
                
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  Return to Home
                </Link>
              </motion.div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
