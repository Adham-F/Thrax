import { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook, 
  CreditCard,
  Coins,
  DollarSign,
  AppleIcon,
  Mail,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SiteFooterProps {
  className?: string;
}

export default function SiteFooter({ className }: SiteFooterProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const subscribeNewsletter = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/subscribe", { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "You've been added to our newsletter list.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    subscribeNewsletter.mutate(email);
  };
  
  return (
    <footer className={cn("bg-muted pt-12 pb-6 px-4", className)}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          {/* Newsletter Subscription */}
          <div className="lg:col-span-2">
            <h3 className="text-foreground font-bold text-xl mb-4">Join THRAX</h3>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter for exclusive offers, early access to new products, and style inspiration.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={subscribeNewsletter.isPending}>
                {subscribeNewsletter.isPending ? (
                  <span className="flex items-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                    Subscribing...
                  </span>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {/* Footer Navigation Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-3 gap-8">
            {/* Shop Links */}
            <div>
              <h3 className="text-foreground font-bold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/category/new">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      New Arrivals
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/all">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Best Sellers
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/tech">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Tech
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/fashion">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Fashion
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/beauty">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Beauty
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/category/lifestyle">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Lifestyle
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Help Links */}
            <div>
              <h3 className="text-foreground font-bold mb-4">Help</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/help/contact-us">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Contact Us
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/help/faqs">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      FAQs
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/help/shipping">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Shipping & Returns
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/help/track-order">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Track Order
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/help/size-guide">
                    <a className="text-muted-foreground hover:text-primary transition-colors">
                      Size Guide
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal Links */}
            <div>
              <h3 className="text-foreground font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/legal/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Social & Payment */}
            <div className="md:col-span-3 lg:hidden pt-4">
              <h3 className="text-foreground font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
              
              <h3 className="text-foreground font-bold mb-4">Payment Methods</h3>
              <div className="flex flex-wrap gap-2">
                <div className="bg-card p-2 rounded">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="bg-card p-2 rounded">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="bg-card p-2 rounded">
                  <Coins className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="bg-card p-2 rounded">
                  <AppleIcon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright & Legal */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/">
                <a className="text-2xl font-bold">
                  <span className="text-primary">THRAX</span>
                </a>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Accessibility</a>
            </div>
          </div>
          
          <div className="text-center mt-6 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} THRAX. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}