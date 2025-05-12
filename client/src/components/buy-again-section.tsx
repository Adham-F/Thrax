import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { RefreshCw, ShoppingCart } from "lucide-react";

interface BuyAgainProps {
  className?: string;
}

export default function BuyAgainSection({ className }: BuyAgainProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  // In a real application, these would come from order history
  // Using mock previously purchased items for now
  const previousPurchases = [
    {
      id: 9,
      name: "Hydrating Face Serum",
      price: 2999,
      imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4cb64c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 10,
      name: "Wireless Phone Charger",
      price: 2499,
      imageUrl: "https://images.unsplash.com/photo-1622989635040-b27d5955e3d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 11,
      name: "Organic Shampoo",
      price: 1899,
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 12,
      name: "Cotton T-Shirt",
      price: 1999,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    }
  ];

  // Hide if not logged in or no purchase history
  if (!user || previousPurchases.length === 0) {
    return null;
  }

  const handleAddToCart = (productId: number) => {
    const product = previousPurchases.find(p => p.id === productId);
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        description: "",
        category: "",
      });
    }
  };

  return (
    <section className={cn("py-12 px-4 bg-background", className)}>
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
          <RefreshCw className="mr-2 h-6 w-6" />
          Buy Again
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {previousPurchases.map((product) => (
            <Card key={product.id} className="h-full overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <a className="block">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                </a>
              </Link>
              <CardContent className="p-4">
                <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                <p className="text-sm font-bold text-primary mt-1 mb-3">
                  {formatPrice(product.price)}
                </p>
                <Button 
                  onClick={() => handleAddToCart(product.id)}
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add Again
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}