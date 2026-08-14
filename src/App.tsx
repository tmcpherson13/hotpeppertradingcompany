import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "./components/auth/AdminRoute";

// Content pages: kept eager because they are prerendered at build time (SSG).
import Index from "./pages/Index";
import Compendium from "./pages/Compendium";
import PepperDetail from "./pages/PepperDetail";
import About from "./pages/About";
import PreColumbianOrigins from "./pages/history/PreColumbianOrigins";
import ColumbianExchange from "./pages/history/ColumbianExchange";
import GlobalIntegration from "./pages/history/GlobalIntegration";
import SeedStartingGuide from "./pages/guides/SeedStartingGuide";
import NotFound from "./pages/NotFound";

// App-like / heavy routes: lazy-loaded. This code-splits large deps (maplibre,
// Shopify, admin tooling) out of the initial bundle and keeps them out of the
// prerender import graph so build-time SSR stays browser-free.
const TradingPost = lazy(() => import("./pages/TradingPost"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Origins = lazy(() => import("./pages/Origins"));

const queryClient = new QueryClient();

const ScrollToHash = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);
  return null;
};

/**
 * Shared providers, used by both the browser entry (main.tsx) and the
 * build-time prerender entry (entry-server.tsx).
 */
export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

/**
 * Route table without a router, so the prerender entry can wrap it in a
 * StaticRouter while the browser wraps it in a BrowserRouter.
 */
export const AppRoutes = () => (
  <>
    <ScrollToHash />
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/trading-post" element={<TradingPost />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/compendium" element={<Compendium />} />
        <Route path="/peppers/:slug" element={<PepperDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/origins" element={<Origins />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
        <Route path="/history/pre-columbian-origins" element={<PreColumbianOrigins />} />
        <Route path="/history/columbian-exchange" element={<ColumbianExchange />} />
        <Route path="/history/global-integration" element={<GlobalIntegration />} />
        <Route path="/guides/seed-starting" element={<SeedStartingGuide />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </>
);

const App = () => (
  <HelmetProvider>
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  </HelmetProvider>
);

export default App;
