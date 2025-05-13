import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/contexts/cart-context";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import ProductPage from "@/pages/product-page";
import CategoryPage from "@/pages/category-page";
import CheckoutPage from "@/pages/checkout-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AdminHelpPages from "@/pages/admin/help-pages";
import AdminNewsletters from "@/pages/admin/newsletters";
import ContactUsPage from "@/pages/help/contact-us";
import FAQsPage from "@/pages/help/faqs";
import ShippingPage from "@/pages/help/shipping";
import TrackOrderPage from "@/pages/help/track-order";
import SizeGuidePage from "@/pages/help/size-guide";
import { ProtectedRoute } from "@/lib/protected-route";
import { Helmet } from "react-helmet";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/category/:category" component={CategoryPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Help Pages */}
      <Route path="/help/contact-us" component={ContactUsPage} />
      <Route path="/help/faqs" component={FAQsPage} />
      <Route path="/help/shipping" component={ShippingPage} />
      <Route path="/help/track-order" component={TrackOrderPage} />
      <Route path="/help/size-guide" component={SizeGuidePage} />
      
      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={AdminProducts} />
      <ProtectedRoute path="/admin/help-pages" component={AdminHelpPages} />
      <ProtectedRoute path="/admin/newsletters" component={AdminNewsletters} />
      
      <Route path="/auth" component={AuthPage} />
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
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
