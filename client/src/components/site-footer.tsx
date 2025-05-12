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
  AppleIcon
} from "lucide-react";

interface SiteFooterProps {
  className?: string;
}

export default function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer className={cn("bg-muted pt-12 pb-6 px-4", className)}>
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
          
          <div>
            <h3 className="text-foreground font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-foreground font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          
          <div>
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
        
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/">
                <a className="text-2xl font-bold">
                  <span className="text-primary">VIBE</span>
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
            &copy; {new Date().getFullYear()} VIBE. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
