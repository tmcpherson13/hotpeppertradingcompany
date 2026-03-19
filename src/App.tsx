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
import About from "./pages/About";


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
