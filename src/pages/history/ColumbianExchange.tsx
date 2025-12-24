import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Anchor, Ship, Globe, MapPin, Compass } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import { CitationLink, Citation } from '@/components/history/CitationLink';
import logoDark from '@/assets/logo-dark.svg';

const citations: Citation[] = [
  {
    id: 1,
    authors: "Andrews, J.",
    year: "1993",
    title: "Diffusion of Mesoamerican Food Complex to Southeastern Europe",
    publication: "Geographical Review, 83(2), 194-204",
    doi: "10.2307/215258"
  },
  {
    id: 2,
    authors: "Crosby, A.W.",
    year: "1972",
    title: "The Columbian Exchange: Biological and Cultural Consequences of 1492",
    publication: "Greenwood Press, Westport, Connecticut"
  },
  {
    id: 3,
    authors: "Hancock, J.F.",
    year: "2022",
    title: "World Agriculture Before and After 1492: Legacy of the Columbian Exchange",
    publication: "Springer Nature",
    doi: "10.1007/978-3-030-82498-5"
  },
  {
    id: 4,
    authors: "Fuchs, L.",
    year: "1542",
    title: "De historia stirpium commentarii insignes",
    publication: "Basel: Isingrin",
    url: "https://archive.org/details/dehistoriastirpi00fuch"
  },
  {
    id: 5,
    authors: "Álvarez Chanca, D.",
    year: "1494",
    title: "Letter to the Cabildo of Seville",
    publication: "Translated in Journals and Other Documents on the Life and Voyages of Christopher Columbus (1963), Morison, S.E., ed."
  },
  {
    id: 6,
    authors: "Dalby, A.",
    year: "2000",
    title: "Dangerous Tastes: The Story of Spices",
    publication: "University of California Press"
  },
  {
    id: 7,
    authors: "Nabhan, G.P.",
    year: "2014",
    title: "Cumin, Camels, and Caravans: A Spice Odyssey",
    publication: "University of California Press"
  }
];

export default function ColumbianExchange() {
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
                  <Anchor className="w-6 h-6 text-primary" />
                  <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                
                <p className="text-muted-foreground font-heading text-base md:text-lg uppercase tracking-[0.3em] mb-4 small-caps">
                  A Historical Treatise
                </p>
                
                <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6 text-engraved leading-tight">
                  The Columbian Exchange<br />
                  <span className="text-3xl md:text-4xl font-heading italic font-normal tracking-normal">
                    & the Global Dispersal of Capsicum
                  </span>
                </h1>
                
                <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  How Spanish galleons and Portuguese carracks carried the fiery fruits 
                  of the Americas to every corner of the known world within a single century.
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
                  <Ship className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Introduction
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4 first-letter:text-5xl first-letter:font-display first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    In the autumn of 1492, Christopher Columbus set sail westward from 
                    Spain in search of a new route to the spice-rich Indies. He sought 
                    black pepper (<em>Piper nigrum</em>), cinnamon, and cloves—precious 
                    commodities that had driven trade and empire for centuries. What he 
                    found instead would prove far more consequential: the chili pepper, 
                    a fruit that would transform cuisines across the globe within a 
                    single century.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The Columbian Exchange—that vast biological and cultural transfer 
                    between the Old World and the New—encompassed countless species of 
                    plants, animals, and diseases. Yet few plants achieved the rapid and 
                    complete global adoption of <em>Capsicum</em>. Within fifty years of 
                    first contact, peppers had circumnavigated the globe. Within a century, 
                    they had become indispensable to cuisines from Sichuan to Hungary, 
                    from West Africa to the Indian subcontinent.<sup>[2]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    This is the story of that extraordinary diffusion—how a plant unknown 
                    outside the Americas in 1491 became one of the most widely cultivated 
                    spices on Earth by 1600.
                  </p>
                </div>
              </motion.section>

              {/* Columbus and the Discovery */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Compass className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Columbus and the Discovery
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The first European documentation of chili peppers comes from Columbus's 
                    second voyage in 1493. Dr. Diego Álvarez Chanca, the fleet physician, 
                    wrote to the city council of Seville describing the local spices 
                    encountered on the island of Hispaniola:
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "There is also plenty of <em>ají</em>, which is their pepper, which 
                    is more valuable than pepper, and all the people eat nothing else, 
                    it being very wholesome. Fifty caravels might be annually loaded 
                    with it."
                    <footer className="text-muted-foreground text-base font-body not-italic mt-2">
                      — Dr. Diego Álvarez Chanca, Letter to the Cabildo of Seville, 1494<sup>[5]</sup>
                    </footer>
                  </blockquote>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Columbus himself, convinced he had reached the Indies, called the new 
                    spice <em>pimiento</em>—the Spanish word for black pepper (<em>pimienta</em>). 
                    This misnomer would persist, forever confusing the unrelated <em>Piper</em> 
                    and <em>Capsicum</em> genera in European languages. The irony was 
                    profound: seeking the pepper that had driven centuries of Asian trade, 
                    Columbus had stumbled upon an entirely different plant that would 
                    ultimately prove more transformative.<sup>[2]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The Spanish quickly recognized the commercial potential of this new 
                    spice. Unlike black pepper, which required precise tropical conditions 
                    and years to mature, chili peppers grew readily, produced abundantly 
                    in their first year, and could be dried for long preservation. By 1493, 
                    chili seeds had made the return voyage to Spain.
                  </p>
                </div>
              </motion.section>

              {/* Portuguese Maritime Networks */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Ship className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Portuguese Maritime Networks
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    While Spain controlled the American colonies where peppers originated, 
                    it was the Portuguese who would prove most instrumental in their global 
                    dispersal. Portugal's maritime empire—stretching from Brazil to Goa to 
                    Macao—provided the perfect network for rapid diffusion.<sup>[6]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    In 1498, Vasco da Gama reached India by rounding the Cape of Good Hope, 
                    establishing a direct sea route between Europe and the spice markets of 
                    Asia. Portuguese trading posts soon dotted the coasts of Africa, India, 
                    and Southeast Asia: Mozambique (1505), Goa (1510), Malacca (1511), and 
                    eventually Macao (1557). These way-stations became nodes of exchange 
                    where American crops mingled with Asian and African flora.
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Key Portuguese Trading Posts
                    </h4>
                    <ul className="space-y-2 font-body text-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Azores & Madeira</strong> — Atlantic waypoints, pepper cultivation by 1510s</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>West African Coast</strong> — Guinea, São Tomé, Angola by 1500s</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Goa, India</strong> — Primary Asian hub from 1510</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Malacca</strong> — Gateway to Southeast Asia from 1511</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Macao, China</strong> — Entry point to East Asia from 1557</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The chili pepper proved ideally suited to long sea voyages. Unlike 
                    many fruits, dried peppers retained their pungency for months, even 
                    years. Ships' crews valued them both as seasoning and as a source of 
                    vitamin C to combat scurvy. Seeds traveled easily—sometimes intentionally 
                    carried, sometimes as contaminants in spice cargoes—spreading to every 
                    port of call along the Portuguese trade routes.<sup>[7]</sup>
                  </p>
                </div>
              </motion.section>

              {/* Arrival in Africa */}
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
                    Arrival in Africa
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Africa received chili peppers through multiple channels. Portuguese 
                    traders introduced them to the West African coast as early as the 
                    1500s, where they found immediate acceptance among populations already 
                    accustomed to the pungent <em>Aframomum melegueta</em>—the "grains of 
                    paradise" or melegueta pepper that had been a valued spice for centuries.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The Atlantic trade networks accelerated this dispersal. 
                    Peppers were included on merchant ships as provisions and trade goods, spreading 
                    cultivars between African ports and the Caribbean. By the early 1600s, 
                    chili peppers had become so thoroughly integrated into West African 
                    cuisine that European observers sometimes mistook them for native 
                    species.<sup>[2]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    On the East African coast, peppers arrived via the Indian Ocean trade 
                    routes. Arab and Swahili merchants, connected to the broader spice 
                    networks extending to India and beyond, adopted and disseminated the 
                    new crop. From there, peppers spread inland, eventually reaching every 
                    corner of the continent. Today, Africa's pepper cuisines—from North 
                    African harissa to West African shito to East African peri-peri—reflect 
                    this complex history of introduction and adaptation.
                  </p>
                </div>
              </motion.section>

              {/* India and the Spice Revolution */}
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
                    India and the Spice Revolution
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Perhaps nowhere was the impact of the chili pepper more profound than 
                    in India. Portuguese traders introduced <em>Capsicum</em> to Goa in the 
                    early sixteenth century—ironically bringing to the original land of 
                    pepper a competitor for its namesake spice. The new arrival was 
                    sometimes called "Pernambuco pepper," after the Brazilian captaincy 
                    from which many specimens originated.<sup>[6]</sup>
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "The chilli was perhaps the most revolutionary addition to the 
                    Indian kitchen. It transformed local cuisines more thoroughly than 
                    any other single ingredient."
                    <footer className="text-muted-foreground text-base font-body not-italic mt-2">
                      — K.T. Achaya, food historian
                    </footer>
                  </blockquote>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    India already possessed a sophisticated spice culture, employing 
                    black pepper, long pepper (<em>Piper longum</em>), and pungent ginger 
                    to add heat to dishes. The chili pepper offered a different kind of 
                    pungency—one that came from capsaicin rather than piperine—and proved 
                    remarkably adaptable to Indian growing conditions. By the late sixteenth 
                    century, it had spread from the Portuguese enclaves throughout the 
                    subcontinent.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The adoption was so complete that within two centuries, chili peppers 
                    had become indispensable to Indian cuisine. Regional cultivars 
                    developed—the mild Kashmiri chili prized for its color, the fiery 
                    Guntur and Byadgi cultivars of the south—each adapted to local tastes 
                    and conditions. Today, India is the world's largest producer and 
                    consumer of chili peppers, a testament to this remarkable integration.
                  </p>
                </div>
              </motion.section>

              {/* East Asian Adoption */}
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
                    East Asian Adoption
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Chili peppers reached China through multiple pathways in the early 
                    sixteenth century. Portuguese traders at Macao brought specimens from 
                    their American and Asian trading posts. Simultaneously, peppers may 
                    have traveled overland via Central Asian trade routes, carried by 
                    merchants who obtained them from Indian or Middle Eastern sources.<sup>[3]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Initial Chinese reception was mixed. Coastal regions largely rejected 
                    the new spice, preferring traditional flavorings. But in the interior 
                    provinces of Sichuan, Hunan, and Guizhou—regions with humid climates 
                    where the warming properties of spicy food were valued—peppers found 
                    enthusiastic adopters. By the seventeenth century, these provinces had 
                    developed the intensely spicy cuisines for which they remain famous today.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Korea's adoption of the chili pepper would prove equally transformative. 
                    Introduced possibly via Japanese trade or Portuguese contact in the 
                    late sixteenth or early seventeenth century, the pepper became central 
                    to Korean cuisine within two centuries. <em>Gochugaru</em>—Korean red 
                    pepper flakes—became the essential ingredient in <em>kimchi</em>, 
                    transforming a traditional fermented vegetable dish into the spicy 
                    national food of Korea.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Southeast Asian cuisines, many already incorporating local peppers 
                    and other pungent spices, readily adopted <em>Capsicum</em> cultivars 
                    from Portuguese and later Dutch traders. Thai, Vietnamese, and 
                    Indonesian cuisines integrated chili peppers into existing culinary 
                    traditions, creating the complex, balanced heat that characterizes 
                    these food cultures today.
                  </p>
                </div>
              </motion.section>

              {/* The Ottoman and European Path */}
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
                    The Ottoman and European Path
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Europe's own adoption of the chili pepper followed a more circuitous 
                    route. While Spanish and Portuguese sailors brought peppers directly 
                    from the Americas, much of the diffusion into Central and Eastern 
                    Europe came via Ottoman trade networks. Turkish merchants, connected 
                    to both Mediterranean and Indian Ocean commerce, introduced peppers 
                    to the Balkans and Hungary.<sup>[1]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The German botanist Leonhart Fuchs illustrated chili peppers in his 
                    1542 herbal <em>De historia stirpium</em>, calling them "Calicut pepper" 
                    (after the Indian trading port) and "Brazilian pepper"—reflecting the 
                    confusion about their origins that would persist for centuries. By 
                    mid-century, peppers were being cultivated in German gardens, though 
                    primarily as curiosities rather than culinary staples.<sup>[4]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Hungary's embrace of the pepper proved exceptional. Introduced via 
                    Turkish trade in the sixteenth century, the pepper found ideal growing 
                    conditions in the Pannonian Basin. Hungarian cultivators developed 
                    milder, sweeter cultivars—the ancestors of modern paprika—that could 
                    be used in quantity as a seasoning rather than merely as a fiery accent. 
                    By the eighteenth century, paprika had become a defining element of 
                    Hungarian cuisine.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Elsewhere in Europe, adoption was slower. The cool, damp climates 
                    of Northern Europe proved less suitable for cultivation, and established 
                    culinary traditions showed little initial interest in the new spice. 
                    The chili pepper would remain a minor element in most European cuisines 
                    until the late twentieth century—a striking contrast to its rapid 
                    adoption in Asia, Africa, and the Americas.
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
                  <Anchor className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Conclusion: Fifty Years to Circle the Globe
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    By the mid-sixteenth century—scarcely fifty years after Columbus's 
                    first voyage—chili peppers had established themselves on every major 
                    landmass touched by European trade. No other Columbian Exchange plant 
                    achieved such rapid global adoption. Maize, potatoes, and tomatoes 
                    would take centuries to gain widespread acceptance; the chili pepper 
                    was embraced within decades.<sup>[2]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Several factors explain this remarkable success. The chili pepper was 
                    easy to grow, adapted readily to diverse climates, and produced 
                    abundantly in its first year. Its fruits dried well and retained their 
                    pungency indefinitely. Most importantly, it filled a niche that existed 
                    in cuisines worldwide: the desire for pungent, stimulating food that 
                    made bland staples more palatable and was believed to aid digestion 
                    and preserve health.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The Columbian Exchange of the chili pepper was complete. But the story 
                    was far from over. In the centuries that followed, peppers would 
                    continue to evolve through cultivation and selection, developing into 
                    the thousands of regional cultivars we know today. They would become 
                    so thoroughly integrated into local cuisines that their American origins 
                    would be forgotten, their presence taken for granted as if they had 
                    always been there. That story of global integration and regional 
                    adaptation represents the final chapter in the history of <em>Capsicum</em>.
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
                  to="/history/pre-columbian-origins" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous: Pre-Columbian Origins
                </Link>
                
                <Link 
                  to="/history/global-integration" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  Next: Global Integration
                  <ArrowRight className="w-4 h-4" />
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
