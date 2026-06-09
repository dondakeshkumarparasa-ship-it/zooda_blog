import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateBusinessForm from "./components/business/CreateBussinessForm";
import { AppProvider } from "@/components/Chat/Chatbot";
import { BusinessChatHistory } from "./components/Chat/Chatinterface";

// Parse SSO parameters from storefront redirect
const params = new URLSearchParams(window.location.search);
const ssoToken = params.get("token");
const ssoUser = params.get("user");
if (ssoToken && ssoUser) {
  localStorage.setItem("token", ssoToken);
  localStorage.setItem("user", ssoUser);
  // Clean up URL parameters
  const newUrl = window.location.pathname + window.location.hash;
  window.history.replaceState({}, document.title, newUrl);
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create-business" element={<CreateBusinessForm />} />
            <Route path="/chat" element={<BusinessChatHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;