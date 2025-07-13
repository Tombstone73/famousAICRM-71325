import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CompanyDetails from "./pages/CompanyDetails";
import ContactDetails from "./pages/ContactDetails";
import OrderDetails from "./pages/OrderDetails";
import { ProductAudit } from "./pages/ProductAudit";
import { ContactDetailsView } from "./components/contacts/ContactDetailsView";
import { ContactListView } from "./components/contacts/ContactListView";
import { ContactFormView } from "./components/contacts/ContactFormView";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/companies" element={<Index />} />
              <Route path="/companies/:id" element={<CompanyDetails />} />
              <Route path="/contacts" element={<ContactListView />} />
              <Route path="/contacts/new" element={<ContactFormView />} />
              <Route path="/contacts/:id" element={<ContactDetailsView />} />
              <Route path="/contacts/:id/edit" element={<ContactFormView />} />
              <Route path="/orders" element={<Index />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/product-audit" element={<ProductAudit />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;