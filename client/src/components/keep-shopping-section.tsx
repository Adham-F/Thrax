import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

interface KeepShoppingProps {
  className?: string;
}

export default function KeepShoppingSection({ className }: KeepShoppingProps) {
  const { user } = useAuth();
  
  // If we had a real browsing history API, we'd use that instead
  // Using mock browsing history for now
  const recentlyViewed = [
    {
      id: 1,
      name: "Ultra HD Smart Watch",
      price: 24999,
      imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 2,
      name: "Pro Wireless Earbuds",
      price: 12999,
      imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 3,
      name: "Premium Leather Backpack",
      price: 8999,
      imageUrl: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 4,
      name: "Active Noise Cancelling Headphones",
      price: 19999,
      imageUrl: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    }
  ];

  // Hide if not logged in or no browsing history
  if (!user || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-12 px-4 bg-background", className)}>
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
          <ShoppingBag className="mr-2 h-6 w-6" />
          Keep Shopping
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recentlyViewed.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <a className="block">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                    <p className="text-sm font-bold text-primary mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}