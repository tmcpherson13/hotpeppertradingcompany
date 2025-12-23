import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Compendium from "./pages/Compendium";
import PreColumbianOrigins from "./pages/history/PreColumbianOrigins";
import ColumbianExchange from "./pages/history/ColumbianExchange";
import GlobalIntegration from "./pages/history/GlobalIntegration";
import NotFound from "./pages/NotFound";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/compendium" element={<Compendium />} />
          <Route path="/history/pre-columbian-origins" element={<PreColumbianOrigins />} />
          <Route path="/history/columbian-exchange" element={<ColumbianExchange />} />
          <Route path="/history/global-integration" element={<GlobalIntegration />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
