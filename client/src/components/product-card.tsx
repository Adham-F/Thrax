import { useState } from "react";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShoppingBag, Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);

  const discountedPrice = product.isSale && product.discountPercentage
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : null;

  // Add to wishlist mutation
  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: number) => {
      if (!user) {
        throw new Error('You must be logged in to add items to wishlist');
      }
      const res = await apiRequest('POST', '/api/wishlist', {
        productId,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      setIsInWishlist(true);
      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add to wishlist",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }
    
    addToWishlistMutation.mutate(product.id);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Card className={cn("product-card group overflow-hidden transition-all duration-300", className)}>
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          {/* Product Image */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover transition-all duration-300"
          />
          
          {/* Wishlist button */}
          <div className="product-actions absolute top-0 right-0 m-3 opacity-0 transition-opacity duration-300">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 rounded-full bg-dark-lighter hover:bg-primary transition-colors"
                    onClick={handleAddToWishlist}
                  >
                    <Heart className={cn(
                      "h-5 w-5 text-white",
                      isInWishlist && "fill-accent text-accent"
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to wishlist</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Product badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
            {product.isPopular && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
            {product.isSale && product.discountPercentage && (
              <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">
                {product.discountPercentage}% Off
              </span>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Product Info */}
          <h3 className="font-medium text-foreground mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.subcategory || product.category}</p>
          
          {/* Price and Add to Cart */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="font-bold text-foreground">
                {discountedPrice ? formatPrice(discountedPrice) : formatPrice(product.price)}
              </span>
              
              {discountedPrice && (
                <span className="text-muted-foreground text-sm line-through ml-2">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-primary hover:bg-primary-dark text-white p-2 rounded-full transition-colors"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
