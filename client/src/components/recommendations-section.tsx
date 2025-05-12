import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Zap } from "lucide-react";

interface RecommendationsProps {
  className?: string;
}

export default function RecommendationsSection({ className }: RecommendationsProps) {
  const { user } = useAuth();
  
  // In a real app, these would come from a recommendation API
  // Using mock recommendations for now
  const recommendations = [
    {
      id: 5,
      name: "Smart Fitness Tracker",
      price: 9999,
      imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 6,
      name: "Wireless Charging Pad",
      price: 3999,
      imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 7,
      name: "Minimalist Desk Lamp",
      price: 4999,
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    },
    {
      id: 8,
      name: "Portable Power Bank",
      price: 5999,
      imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
    }
  ];

  // Hide if not logged in
  if (!user) {
    return null;
  }

  return (
    <section className={cn("py-12 px-4 bg-muted/30", className)}>
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
          <Zap className="mr-2 h-6 w-6 text-primary" />
          Recommended For You
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recommendations.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <a className="block">
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all">
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                      For You
                    </div>
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