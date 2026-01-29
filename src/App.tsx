import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TripPlanner from "./pages/TripPlanner";
import BudgetEstimator from "./pages/BudgetEstimator";
import BookTrip from "./pages/BookTrip";
import Features from "./pages/Features";
import Transport from "./pages/Transport";
import Meetups from "./pages/Meetups";
import Reels from "./pages/Reels";
import Memories from "./pages/Memories";
import CreatePost from "./pages/CreatePost";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/plan" element={<TripPlanner />} />
            <Route path="/budget-estimator" element={<BudgetEstimator />} />
            <Route path="/book" element={<BookTrip />} />
            <Route path="/features" element={<Features />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/meetups" element={
              <ProtectedRoute>
                <Meetups />
              </ProtectedRoute>
            } />
            <Route path="/reels" element={<Reels />} />
            <Route path="/memories" element={
              <ProtectedRoute>
                <Memories />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
