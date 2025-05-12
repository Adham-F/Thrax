import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Product } from "@shared/schema";
import { Sparkles } from "lucide-react";
import AnimatedProductCard from "@/components/animated-product-card";

interface PersonalizedRecommendationsProps {
  productId?: number; // Current product ID to exclude from recommendations
  className?: string;
}

export default function PersonalizedRecommendations({ 
  productId,
  className 
}: PersonalizedRecommendationsProps) {
  const { user } = useAuth();
  
  // In a real application, this would come from an API based on user's browsing history,
  // past purchases, and preferences. Using mock data for now.
  const mockRecommendations: Product[] = [
    {
      id: 13,
      name: "Premium Wireless Headphones",
      description: "High-quality sound with active noise cancellation",
      price: 19999,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      category: "tech",
      subcategory: null,
      inStock: true,
      isNew: true,
      isPopular: true,
      isSale: false,
      discountPercentage: null,
      createdAt: null
    },
    {
      id: 14,
      name: "Smart Home Assistant",
      description: "Voice-controlled assistant for your home",
      price: 9999,
      imageUrl: "https://images.unsplash.com/photo-1558089687-f282ffcbc0d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      category: "tech",
      subcategory: null,
      inStock: true,
      isNew: false,
      isPopular: true,
      isSale: true,
      discountPercentage: 10,
      createdAt: null
    },
    {
      id: 15,
      name: "Fitness Smartwatch",
      description: "Track your fitness goals and monitor your health",
      price: 14999,
      imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      category: "tech",
      subcategory: null,
      inStock: true,
      isNew: false,
      isPopular: true,
      isSale: false,
      discountPercentage: null,
      createdAt: null
    },
    {
      id: 16,
      name: "Minimalist Desk Clock",
      description: "Elegant desk clock with minimalist design",
      price: 4999,
      imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      category: "lifestyle",
      subcategory: null,
      inStock: true,
      isNew: false,
      isPopular: false,
      isSale: false,
      discountPercentage: null,
      createdAt: null
    }
  ];
  
  // Filter out current product if needed
  const recommendations = productId 
    ? mockRecommendations.filter(product => product.id !== productId)
    : mockRecommendations;
  
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-12 px-4 bg-background", className)}>
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-primary" />
          Personalized For You
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {recommendations.map((product) => (
            <AnimatedProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </div>
    </section>
  );
}