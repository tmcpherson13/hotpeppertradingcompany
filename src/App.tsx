import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Compendium from "./pages/Compendium";
import TradingPost from "./pages/TradingPost";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";
import Wishlist from "./pages/Wishlist";
import Origins from "./pages/Origins";
import { AdminRoute } from "./components/auth/AdminRoute";
import PreColumbianOrigins from "./pages/history/PreColumbianOrigins";
import ColumbianExchange from "./pages/history/ColumbianExchange";
import GlobalIntegration from "./pages/history/GlobalIntegration";
import SeedStartingGuide from "./pages/guides/SeedStartingGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle hash link scrolling
const ScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      // Small delay to ensure DOM is ready after navigation
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Scroll to top when navigating to a page without hash
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToHash />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/trading-post" element={<TradingPost />} />
            <Route path="/product/:handle" element={<ProductDetail />} />
            <Route path="/compendium" element={<Compendium />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/origins" element={<Origins />} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/history/pre-columbian-origins" element={<PreColumbianOrigins />} />
            <Route path="/history/columbian-exchange" element={<ColumbianExchange />} />
            <Route path="/history/global-integration" element={<GlobalIntegration />} />
            <Route path="/guides/seed-starting" element={<SeedStartingGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
