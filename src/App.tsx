
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Mates from "./pages/Mates";
import Messages from "./pages/Messages";
import Jobs from "./pages/Jobs";
import Research from "./pages/Research";
import CaseStudies from "./pages/CaseStudies";
import Events from "./pages/Events";
import Search from "./pages/Search";
import Mentorship from "./pages/Mentorship";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/mates" element={<Mates />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/research" element={<Research />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/events" element={<Events />} />
          <Route path="/search" element={<Search />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
