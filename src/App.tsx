
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import Feed from "@/pages/Feed";
import Mates from "@/pages/Mates";
import Jobs from "@/pages/Jobs";
import DoxyAI from "@/pages/DoxyAI";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Chat from "@/pages/Chat";
import Messages from "@/pages/Messages";
import Research from "@/pages/Research";
import CaseStudies from "@/pages/CaseStudies";
import Mentorship from "@/pages/Mentorship";
import Events from "@/pages/Events";
import Search from "@/pages/Search";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mates"
                element={
                  <ProtectedRoute>
                    <Mates />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doxy-ai"
                element={
                  <ProtectedRoute>
                    <DoxyAI />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/research"
                element={
                  <ProtectedRoute>
                    <Research />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/case-studies"
                element={
                  <ProtectedRoute>
                    <CaseStudies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentorship"
                element={
                  <ProtectedRoute>
                    <Mentorship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
