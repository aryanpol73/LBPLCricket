import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "@/components/ScrollToTop";
import Footer from "@/components/Footer";
import PwaBottomNav from "@/components/PwaBottomNav";
import Index from "./pages/Index";
import Matches from "./pages/Matches";
import Results from "./pages/Results";
import PointsTable from "./pages/PointsTable";
import Teams from "./pages/Teams";
import Stats from "./pages/Stats";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Community from "./pages/Community";
import Sponsors from "./pages/Sponsors";
import NotFound from "./pages/NotFound";
import SettingsHome from "./pages/settings/SettingsHome";
import SettingsAbout from "./pages/settings/SettingsAbout";
import SettingsRules from "./pages/settings/SettingsRules";
import SettingsDeveloper from "./pages/settings/SettingsDeveloper";
import SettingsHelp from "./pages/settings/SettingsHelp";
import AppearanceSettings from "./components/settings/AppearanceSettings";
import NotificationSettings from "./components/settings/NotificationSettings";
import LiveScoreWidget from "./pages/widget/LiveScoreWidget";

const queryClient = new QueryClient();

const App = () => (
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
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="/settings" element={<SettingsHome />} />
                <Route path="/settings/about" element={<SettingsAbout />} />
                <Route path="/settings/rules" element={<SettingsRules />} />
                <Route path="/settings/developer" element={<SettingsDeveloper />} />
                <Route path="/settings/appearance" element={<AppearanceSettings />} />
                <Route path="/settings/notifications" element={<NotificationSettings />} />
                <Route path="/settings/help" element={<SettingsHelp />} />
                <Route path="/widget/live" element={<LiveScoreWidget />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
            <PwaBottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
