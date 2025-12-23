import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Flame, BookOpen, Globe, MapPin, Languages, Scroll } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TradeRoutePattern } from '@/components/ui/TradeRoutePattern';
import logoDark from '@/assets/logo-dark.jpg';

interface Citation {
  id: number;
  authors: string;
  year: string;
  title: string;
  publication: string;
  doi?: string;
  url?: string;
}

const citations: Citation[] = [
  {
    id: 1,
    authors: "Kraft, K.H., Brown, C.H., Nabhan, G.P., Luedeling, E., Luna Ruiz, J.J., Coppens d'Eeckenbrugge, G., Hijmans, R.J., & Gepts, P.",
    year: "2014",
    title: "Multiple lines of evidence for the origin of domesticated chili pepper, Capsicum annuum, in Mexico",
    publication: "Proceedings of the National Academy of Sciences, 111(17), 6165-6170",
    doi: "10.1073/pnas.1308933111"
  },
  {
    id: 2,
    authors: "Perry, L., Dickau, R., Zarrillo, S., Holst, I., Pearsall, D.M., Piperno, D.R., Berman, M.J., Cooke, R.G., Rademaker, K., Ranere, A.J., Raymond, J.S., Sandweiss, D.H., Scaramelli, F., Tarble, K., & Zeidler, J.A.",
    year: "2007",
    title: "Starch fossils and the domestication and dispersal of chili peppers (Capsicum spp. L.) in the Americas",
    publication: "Science, 315(5814), 986-988",
    doi: "10.1126/science.1136914"
  },
  {
    id: 3,
    authors: "Sahagún, Bernardino de",
    year: "1569",
    title: "Historia General de las Cosas de Nueva España (The Florentine Codex)",
    publication: "Book 11: Natural Things",
    url: "https://florentinecodex.getty.edu/"
  },
  {
    id: 4,
    authors: "Pickersgill, B.",
    year: "1969",
    title: "The archaeological record of chili peppers (Capsicum spp.) and the sequence of plant domestication in Peru",
    publication: "American Antiquity, 34(1), 54-61",
    doi: "10.2307/278313"
  },
  {
    id: 5,
    authors: "Brown, C.H.",
    year: "2010",
    title: "Development of Agriculture in Prehistoric Mesoamerica: The Linguistic Evidence",
    publication: "In Pre-Columbian Foodways: Interdisciplinary Approaches to Food, Culture, and Markets in Ancient Mesoamerica, Springer",
    doi: "10.1007/978-1-4419-0471-3_4"
  },
  {
    id: 6,
    authors: "Long-Solís, J.",
    year: "1986",
    title: "Capsicum y Cultura: La Historia del Chilli",
    publication: "Fondo de Cultura Económica, Mexico City"
  },
  {
    id: 7,
    authors: "Aguilar-Meléndez, A., Morrell, P.L., Roose, M.L., & Kim, S.C.",
    year: "2009",
    title: "Genetic diversity and structure in semiwild and domesticated chiles (Capsicum annuum; Solanaceae) from Mexico",
    publication: "American Journal of Botany, 96(6), 1190-1202",
    doi: "10.3732/ajb.0800155"
  }
];

function CitationLink({ citation }: { citation: Citation }) {
  return (
    <li className="font-body text-muted-foreground text-sm leading-relaxed pl-8 -indent-8">
      <span className="font-semibold text-foreground">[{citation.id}]</span>{' '}
      {citation.authors} ({citation.year}). "{citation.title}." <em>{citation.publication}</em>.
      {citation.doi && (
        <>
          {' '}
          <a
            href={`https://doi.org/${citation.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2 inline-flex items-center gap-1"
          >
            DOI: {citation.doi}
            <ExternalLink className="w-3 h-3" />
          </a>
        </>
      )}
      {citation.url && (
        <>
          {' '}
          <a
            href={citation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline underline-offset-2 inline-flex items-center gap-1"
          >
            View Source
            <ExternalLink className="w-3 h-3" />
          </a>
        </>
      )}
    </li>
  );
}

export default function PreColumbianOrigins() {
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
            className="absolute top-12 right-8 md:right-20 w-[140px] h-[140px] object-contain mix-blend-multiply opacity-80"
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
                  <Flame className="w-6 h-6 text-primary" />
                  <span className="w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                </div>
                
                <p className="text-muted-foreground font-heading text-sm uppercase tracking-[0.3em] mb-4 small-caps">
                  A Historical Treatise
                </p>
                
                <h1 className="font-display text-4xl md:text-6xl text-foreground mb-6 text-engraved leading-tight">
                  Pre-Columbian Origins<br />
                  <span className="text-3xl md:text-4xl font-heading italic font-normal tracking-normal">
                    of the Capsicum Pepper
                  </span>
                </h1>
                
                <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  An examination of the archaeological, genetic, and linguistic evidence 
                  for the domestication and cultivation of chili peppers in the Americas 
                  before European contact.
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
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Introduction
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4 first-letter:text-5xl first-letter:font-display first-letter:text-primary first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    The chili pepper, genus <em>Capsicum</em>, stands among the most consequential 
                    plant domestications in human history. Long before European ships reached 
                    American shores, indigenous peoples of the Americas had cultivated, selected, 
                    and developed these fiery fruits for more than six millennia—creating a 
                    sophisticated agricultural tradition that would eventually transform cuisines 
                    across the globe.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Today, capsicum peppers rank among the most widely cultivated spice crops 
                    worldwide, yet their origins lie exclusively in the tropical and subtropical 
                    regions of the Americas. Archaeological evidence, genetic analysis, and 
                    linguistic reconstruction have converged to reveal a complex story of 
                    domestication centered in what is now central-east Mexico, with secondary 
                    centers of cultivation extending from South America to the Caribbean.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    This examination traces the pre-Columbian history of <em>Capsicum</em>, from 
                    its wild progenitors to its role as a cornerstone of Mesoamerican civilization, 
                    drawing upon the most current scientific research and primary historical sources.
                  </p>
                </div>
              </motion.section>

              {/* The Wild Ancestor */}
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
                    The Wild Ancestor: Chiltepin
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The story of the domesticated chili pepper begins with <em>Capsicum annuum</em> var. 
                    <em>glabriusculum</em>, commonly known as the chiltepin or bird pepper. This 
                    diminutive wild pepper, bearing fruits no larger than a pea, represents the 
                    direct progenitor of what would become <em>Capsicum annuum</em>—the species that 
                    includes jalapeños, serranos, poblanos, and the vast majority of commercially 
                    cultivated peppers today.<sup>[1]</sup>
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "The chiltepin is the 'mother of all peppers'—the wild form from which 
                    countless domesticated varieties have descended."
                    <footer className="text-muted-foreground text-base font-body not-italic mt-2">
                      — Gary Paul Nabhan, ethnobotanist
                    </footer>
                  </blockquote>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Genetic evidence suggests that the genus <em>Capsicum</em> originated in South 
                    America approximately 15 million years ago. The small, brightly colored 
                    fruits evolved to attract birds, which, unlike mammals, lack receptors for 
                    capsaicin and can consume the peppers without discomfort. This avian dispersal 
                    mechanism proved remarkably effective: birds carried pepper seeds across vast 
                    distances, eventually establishing wild populations from northern South America 
                    through Central America and into the southern regions of North America.<sup>[2]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    The wild chiltepin still grows today across this range, from Peru to Arizona, 
                    often in the protective shade of nurse trees such as mesquite and hackberry. 
                    In the Sonoran Desert borderlands, it remains a celebrated wild-harvested 
                    delicacy, commanding prices that exceed those of saffron by weight.
                  </p>
                </div>
              </motion.section>

              {/* Archaeological Evidence */}
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
                    Archaeological Evidence
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The archaeological record of chili pepper use in the Americas is extensive 
                    and compelling. Excavations at sites across Mesoamerica and South America 
                    have yielded macrobotanical remains—seeds, fruit fragments, and desiccated 
                    specimens—as well as microscopic evidence in the form of starch grains and 
                    phytoliths preserved on ancient grinding stones and pottery.
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    The Tehuacán Valley Discoveries
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The oldest macroremains of chili peppers in Mesoamerica come from the 
                    Tehuacán Valley of Puebla, Mexico, where excavations led by archaeologist 
                    Richard MacNeish in the 1960s recovered desiccated pepper specimens dating 
                    to approximately 5,600 years before present (BP). Additional remains from 
                    the Ocampo Caves in Tamaulipas extend the record of human-pepper interaction 
                    to at least 7,000 BP.<sup>[4]</sup>
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Key Archaeological Sites
                    </h4>
                    <ul className="space-y-2 font-body text-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Tehuacán Valley, Puebla, Mexico</strong> — Macroremains ~5,600 BP</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Ocampo Caves, Tamaulipas, Mexico</strong> — Evidence ~7,000 BP</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Huaca Prieta, Peru</strong> — Starch fossils ~6,000 BP</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>Las Vegas, Ecuador</strong> — Microfossil evidence ~6,100 BP</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1.5">•</span>
                        <span><strong>The Bahamas</strong> — Pre-contact cultivation evidence</span>
                      </li>
                    </ul>
                  </div>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    Starch Fossil Analysis
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    A groundbreaking 2007 study published in <em>Science</em> analyzed starch 
                    microfossils from seven archaeological sites across the Americas, providing 
                    direct evidence of early chili pepper processing. The distinctive starch 
                    grains of <em>Capsicum</em>—identified by their unique size, shape, and surface 
                    features—were recovered from grinding stones, ceramic sherds, and sediments 
                    spanning more than six millennia.<sup>[2]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    This microfossil evidence revealed that by 6,000 years ago, domesticated 
                    chili peppers had already spread from their center of origin to become a 
                    pan-American crop, cultivated from Peru to the Caribbean. The rapidity of 
                    this dispersal speaks to the importance early Americans placed on this 
                    pungent condiment.
                  </p>
                </div>
              </motion.section>

              {/* Domestication in Mesoamerica */}
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
                    Domestication in Mesoamerica
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Where, precisely, did the domestication of the chili pepper occur? For 
                    decades, South America—with its remarkable diversity of wild <em>Capsicum</em> 
                    species—was assumed to be the center of origin. However, a comprehensive 
                    2014 study published in the <em>Proceedings of the National Academy of 
                    Sciences</em> synthesized genetic, ecological, archaeological, and linguistic 
                    evidence to definitively establish central-east Mexico as the locus of 
                    <em>C. annuum</em> domestication.<sup>[1]</sup>
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "All lines of evidence point toward central-east Mexico as the origin of 
                    domesticated <em>Capsicum annuum</em>."
                    <footer className="text-muted-foreground text-base font-body not-italic mt-2">
                      — Kraft et al., PNAS 2014
                    </footer>
                  </blockquote>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The researchers employed ecological niche modeling to predict the 
                    distribution of wild <em>C. annuum</em> populations, then compared these 
                    predictions against the known distribution of archaeological sites with 
                    early pepper remains. The overlap centered on the highlands and valleys 
                    of east-central Mexico—precisely where the greatest genetic diversity of 
                    semi-wild and landrace peppers persists to this day.<sup>[7]</sup>
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    The Five Domesticated Species
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    While <em>Capsicum annuum</em> achieved the widest distribution, pre-Columbian 
                    peoples domesticated at least five distinct species of chili pepper, each 
                    originating in different regions of the Americas:
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <ul className="space-y-3 font-body text-foreground">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-semibold">1.</span>
                        <span><strong><em>Capsicum annuum</em></strong> — Mexico (jalapeño, serrano, poblano, cayenne)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-semibold">2.</span>
                        <span><strong><em>Capsicum chinense</em></strong> — Amazon Basin (habanero, Scotch bonnet)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-semibold">3.</span>
                        <span><strong><em>Capsicum frutescens</em></strong> — Central/South America (tabasco, piri piri)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-semibold">4.</span>
                        <span><strong><em>Capsicum baccatum</em></strong> — Bolivia/Peru (aji amarillo, aji limo)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-semibold">5.</span>
                        <span><strong><em>Capsicum pubescens</em></strong> — Andean highlands (rocoto, manzano)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    These independent domestication events—occurring across thousands of miles 
                    and involving distinct wild progenitors—underscore the profound importance 
                    of peppers to pre-Columbian cultures throughout the Americas.
                  </p>
                </div>
              </motion.section>

              {/* Linguistic Evidence */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Languages className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Linguistic Evidence
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Historical linguistics provides a remarkable independent line of evidence 
                    for the antiquity of pepper cultivation. By reconstructing ancestral 
                    vocabulary, linguists can estimate when a term—and by extension, the 
                    concept or object it names—entered a language family.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Research by linguist Cecil H. Brown demonstrated that a word for "chili 
                    pepper" can be reconstructed to Proto-Otomanguean, the ancestor of a major 
                    language family centered in Oaxaca and adjacent regions of Mexico. Based 
                    on glottochronological estimates, this proto-language was spoken approximately 
                    6,600 years ago—placing the earliest Mesoamerican pepper terminology in 
                    remarkable agreement with the archaeological record.<sup>[5]</sup>
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    The Etymology of "Chilli"
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The word "chili" (or "chile") derives from the Nahuatl term <em>chīlli</em>, 
                    used by the Aztecs to denote hot peppers. This terminology was adopted by 
                    the Spanish and subsequently diffused worldwide, becoming the basis for 
                    names in languages from English to Hindi. The Nahuatl lexicon distinguished 
                    dozens of pepper varieties by name, reflecting the agricultural sophistication 
                    of Mesoamerican pepper culture.<sup>[6]</sup>
                  </p>
                  
                  <div className="bg-background/50 border border-border p-6 my-8">
                    <h4 className="font-heading text-lg text-foreground font-semibold mb-3">
                      Nahuatl Pepper Terminology
                    </h4>
                    <ul className="space-y-2 font-body text-foreground">
                      <li><strong>Chīlli</strong> — Generic term for hot pepper</li>
                      <li><strong>Chīltecpin</strong> — The wild bird pepper (chiltepin)</li>
                      <li><strong>Chīlcōztic</strong> — Yellow chili</li>
                      <li><strong>Chīlpozōnalli</strong> — Blistered/roasted chili</li>
                      <li><strong>Chīlmōlli</strong> — Chili sauce (origin of "mole")</li>
                    </ul>
                  </div>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Similarly rich vocabularies existed in Maya languages, where peppers were 
                    classified by color, heat level, size, and culinary application. This 
                    linguistic complexity mirrors the biological diversity: pre-Columbian 
                    Mesoamerica cultivated hundreds of distinct pepper varieties, far exceeding 
                    the diversity maintained today.
                  </p>
                </div>
              </motion.section>

              {/* Aztec & Maya Cultivation */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Scroll className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-2xl md:text-3xl text-foreground">
                    Aztec & Maya Cultivation
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    By the time of Spanish contact in 1519, chili peppers had become fundamental 
                    to Mesoamerican civilization. The Aztec empire, centered at Tenochtitlan, 
                    incorporated peppers into nearly every aspect of daily life—as food, medicine, 
                    currency, and ritual offering.
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    The Florentine Codex
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Our most detailed account of pre-contact pepper culture comes from the 
                    <em>Florentine Codex</em>, an encyclopedic work compiled by the Franciscan 
                    friar Bernardino de Sahagún between 1545 and 1590. Working with Nahua 
                    informants who had lived in the pre-conquest world, Sahagún documented 
                    the cultivation, preparation, and cultural significance of chili peppers 
                    in extraordinary detail.<sup>[3]</sup>
                  </p>
                  
                  <blockquote className="border-l-4 border-primary pl-6 my-8 italic font-display text-xl text-foreground">
                    "The chile seller... sells mild red chiles, broad chiles, hot green chiles, 
                    yellow chiles, <em>cuauhchilli</em>, <em>tenpilchilli</em>, <em>chichioachilli</em>. 
                    He sells water chiles, <em>conchilli</em>; he sells smoked chiles, small chiles, 
                    tree chiles, thin chiles, those like beetles. He sells hot chiles, the 
                    early variety, the hollow-based kind."
                    <footer className="text-muted-foreground text-base font-body not-italic mt-2">
                      — Florentine Codex, Book 10, 16th century
                    </footer>
                  </blockquote>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The Codex describes a sophisticated system of pepper agriculture, including 
                    seed selection, transplanting techniques, irrigation, and drying methods. 
                    Aztec farmers cultivated peppers in <em>chinampas</em>—the famous "floating 
                    gardens" of the Valley of Mexico—as well as in rain-fed and irrigated fields 
                    throughout the empire.
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    Tribute and Trade
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Peppers served as a unit of tribute in the Aztec imperial economy. The 
                    <em>Matrícula de Tributos</em> and <em>Codex Mendoza</em> record that 
                    conquered provinces were required to deliver specified quantities of dried 
                    chiles to Tenochtitlan. A single load (<em>carga</em>) contained 8,000 chiles, 
                    and some provinces owed 1,600 such loads annually—a staggering 12.8 million 
                    peppers per year from a single tributary region.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Beyond their role as tribute, peppers circulated through the great markets 
                    of Mesoamerica. Spanish conquistadors marveled at the pepper vendors in the 
                    Tlatelolco market, which offered dozens of varieties—fresh, dried, smoked, 
                    and ground—organized by type, provenance, and heat level.
                  </p>
                  
                  <h3 className="font-heading text-xl text-foreground font-semibold mt-8 mb-4">
                    Culinary, Medicinal, and Ritual Uses
                  </h3>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    Peppers formed the foundation of Mesoamerican cuisine. They were ground 
                    with tomatoes and other ingredients to create complex sauces; combined with 
                    cacao in ritual beverages; dried and smoked to preserve for the lean season; 
                    and featured in virtually every prepared dish. Fasting from peppers constituted 
                    a significant religious sacrifice—a testament to their centrality in daily life.<sup>[6]</sup>
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    Medicinally, peppers were employed to treat respiratory ailments, digestive 
                    disorders, and infections. Their antimicrobial properties, now validated by 
                    modern science, would have provided genuine therapeutic benefit. Ritually, 
                    the burning of dried peppers produced a pungent smoke used in ceremonies and, 
                    at times, as a form of punishment for misbehaving children.
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
                    Conclusion
                  </h2>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    The pre-Columbian history of <em>Capsicum</em> reveals one of humanity's 
                    great agricultural achievements. Over millennia, the indigenous peoples of 
                    the Americas transformed a small, wild berry into a dazzling array of 
                    domesticated varieties, developing cultivation techniques and culinary 
                    traditions of remarkable sophistication.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed mb-4">
                    When European explorers first encountered these peppers in the late 15th 
                    century, they discovered not a wild plant awaiting domestication, but the 
                    culmination of more than six thousand years of agricultural innovation. 
                    Within decades, Iberian traders would carry these American fruits to Africa, 
                    Asia, and Europe—initiating the global dispersal that would make capsicum 
                    peppers one of the most consumed spices on Earth.
                  </p>
                  
                  <p className="font-body text-foreground leading-relaxed">
                    That remarkable story of the Columbian Exchange and its aftermath represents 
                    the next chapter in the history of <em>Capsicum</em>—a tale of trade routes, 
                    cultural adaptation, and culinary transformation that continues to unfold today.
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
                
                <ol className="space-y-4">
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
                  to="/" 
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Home
                </Link>
                
                <p className="font-body text-sm text-muted-foreground text-center sm:text-right">
                  Next: <span className="italic">The Columbian Exchange</span> — coming soon
                </p>
              </motion.div>
            </div>
          </div>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
