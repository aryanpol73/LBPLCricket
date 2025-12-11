import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ClerkProvider } from "@clerk/clerk-react";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import Results from "./pages/Results";
import PointsTable from "./pages/PointsTable";
import Teams from "./pages/Teams";
import Stats from "./pages/Stats";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Community from "./pages/Community";
import Sponsors from "./pages/Sponsors";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const App = () => (
  <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/matches" element={<Matches />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/points-table" element={<PointsTable />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/sponsors" element={<Sponsors />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
