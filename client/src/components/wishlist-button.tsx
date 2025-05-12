import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Product } from "@shared/schema";

interface WishlistButtonProps {
  product: Product;
  variant?: "icon" | "full";
  className?: string;
}

export default function WishlistButton({ 
  product,
  variant = "icon",
  className
}: WishlistButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add to wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsAdding(true);
    
    try {
      // Toggle wishlist state
      const newState = !isInWishlist;
      
      // In a real app, we would call the API to add/remove from wishlist
      // if (newState) {
      //   await apiRequest("POST", "/api/wishlist", { productId: product.id });
      // } else {
      //   await apiRequest("DELETE", `/api/wishlist/${product.id}`);
      // }
      
      // Mock response with timeout
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsInWishlist(newState);
      setIsAdding(false);
      
      // Show toast notification
      toast({
        title: newState ? "Added to wishlist" : "Removed from wishlist",
        description: newState 
          ? `${product.name} has been added to your wishlist` 
          : `${product.name} has been removed from your wishlist`,
      });
      
      // Invalidate wishlist query to update the count in header
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      
    } catch (error) {
      setIsAdding(false);
      toast({
        title: "Error",
        description: "There was an error updating your wishlist",
        variant: "destructive",
      });
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-9 w-9 rounded-full transition-all",
          isInWishlist && "text-red-500 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-800/30",
          className
        )}
        disabled={isAdding}
        onClick={handleAddToWishlist}
      >
        <Heart 
          className={cn(
            "h-5 w-5", 
            isInWishlist ? "fill-current" : "fill-none"
          )} 
        />
        <span className="sr-only">
          {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "transition-all space-x-1",
        isInWishlist && "text-red-500 border-red-200 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/20",
        className
      )}
      disabled={isAdding}
      onClick={handleAddToWishlist}
    >
      <Heart 
        className={cn(
          "h-4 w-4 mr-1", 
          isInWishlist ? "fill-current" : "fill-none"
        )} 
      />
      <span>
        {isInWishlist ? "Saved" : "Save"}
      </span>
    </Button>
  );
}