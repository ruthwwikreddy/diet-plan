
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreatePlan from "./pages/CreatePlan";
import EditPlan from "./pages/EditPlan";
import ViewPlan from "./pages/ViewPlan";
import TraineeDashboard from "./pages/TraineeDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { createAdminUser } from "./utils/createAdmin";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Create admin user on app start
    createAdminUser();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-plan" element={<CreatePlan />} />
              <Route path="/edit-plan/:id" element={<EditPlan />} />
              <Route path="/plan/:id" element={<ViewPlan />} />
              <Route path="/trainee-dashboard" element={<TraineeDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
