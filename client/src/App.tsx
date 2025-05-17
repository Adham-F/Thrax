// Core dependencies
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Helmet } from "react-helmet";

// Context providers
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/contexts/cart-context";
import { AdminEditProvider } from "@/contexts/admin-edit-context";
import { ProtectedRoute } from "@/lib/protected-route";
import { AdminToolbar } from "@/components/admin/admin-toolbar";

// Main pages
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ProductPage from "@/pages/product-page";
import CategoryPage from "@/pages/category-page";
import CheckoutPage from "@/pages/checkout-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";

// Admin pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminHelpPages from "@/pages/admin/help-pages";
import AdminNewsletters from "@/pages/admin/newsletters";

// Help pages
import ContactUsPage from "@/pages/help/contact-us";
import FAQsPage from "@/pages/help/faqs";
import ShippingPage from "@/pages/help/shipping";
import TrackOrderPage from "@/pages/help/track-order";
import SizeGuidePage from "@/pages/help/size-guide";

// Legal pages
import PrivacyPolicyPage from "@/pages/legal/privacy-policy";
import TermsOfServicePage from "@/pages/legal/terms-of-service";
import CookiePolicyPage from "@/pages/legal/cookie-policy";

/**
 * Application router configuration
 * Add new routes here to make them accessible in the application
 */
function Router() {
  return (
    <Switch>
      {/* Main Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/category/:category" component={CategoryPage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes - Require Authentication */}
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Help & Support Pages */}
      <Route path="/help/contact-us" component={ContactUsPage} />
      <Route path="/help/faqs" component={FAQsPage} />
      <Route path="/help/shipping" component={ShippingPage} />
      <Route path="/help/track-order" component={TrackOrderPage} />
      <Route path="/help/size-guide" component={SizeGuidePage} />
      
      {/* Legal Pages */}
      <Route path="/legal/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/legal/terms-of-service" component={TermsOfServicePage} />
      <Route path="/legal/cookie-policy" component={CookiePolicyPage} />
      
      {/* Admin Routes - Protected */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} />
      <ProtectedRoute path="/admin/help-pages" component={AdminHelpPages} />
      <ProtectedRoute path="/admin/newsletters" component={AdminNewsletters} />
      
      {/* 404 Route - Must be last */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AuthProvider>
          <CartProvider>
            <AdminEditProvider>
              <TooltipProvider>
                <Toaster />
                <Router />
                <AdminToolbar />
              </TooltipProvider>
            </AdminEditProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
