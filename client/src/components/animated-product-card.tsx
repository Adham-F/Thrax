import { useState, useRef } from "react";
import { Link } from "wouter";
import { cn, formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";
import WishlistButton from "@/components/wishlist-button";
import { useToast } from "@/hooks/use-toast";

interface AnimatedProductCardProps {
  product: Product;
  className?: string;
}

export default function AnimatedProductCard({ 
  product, 
  className 
}: AnimatedProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [animatingOut, setAnimatingOut] = useState(false);

  // Calculate discount percentage if applicable
  const discountPercentage = product.discountPercentage || 0;
  const originalPrice = product.price;
  const discountedPrice = discountPercentage > 0 
    ? Math.round(originalPrice * (1 - discountPercentage / 100)) 
    : originalPrice;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setAnimatingOut(false);
  };

  const handleMouseLeave = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setIsHovered(false);
      setRotation({ x: 0, y: 0 });
      setAnimatingOut(false);
    }, 300);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <Card 
      ref={cardRef}
      className={cn(
        "group overflow-hidden transition-all duration-300 h-full",
        isHovered ? "shadow-lg" : "shadow-sm",
        className
      )}
      style={{
        transform: isHovered && !animatingOut
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.05, 1.05, 1.05)`
          : animatingOut
            ? "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
            : "perspective(1000px)",
        transition: "transform 0.3s ease"
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <a className="block">
            <div className="relative aspect-square overflow-hidden">
              <img 
                src={product.imageUrl}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  isHovered ? "scale-110" : "scale-100"
                )}
              />
              {product.isSale && (
                <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                  Sale
                </Badge>
              )}
              {product.isNew && (
                <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
                  New
                </Badge>
              )}
              
              <div 
                className={cn(
                  "absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 transition-opacity",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              >
                <Button variant="secondary" size="sm" className="mr-2">
                  <Eye className="mr-1 h-4 w-4" />
                  Quick view
                </Button>
              </div>
            </div>
          </a>
        </Link>
        
        {/* Wishlist button */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton product={product} />
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
          {product.category}
        </p>
        <div className="mt-2">
          {discountPercentage > 0 ? (
            <div className="flex items-center">
              <p className="text-sm font-bold text-primary">
                {formatPrice(discountedPrice)}
              </p>
              <p className="text-xs text-muted-foreground line-through ml-2">
                {formatPrice(originalPrice)}
              </p>
              <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-[10px] px-1 py-0">
                {discountPercentage}% OFF
              </Badge>
            </div>
          ) : (
            <p className="text-sm font-bold text-primary">
              {formatPrice(originalPrice)}
            </p>
          )}
        </div>
      </CardContent>
      
      <CardFooter 
        className={cn(
          "p-4 pt-0 opacity-0 translate-y-4 transition-all duration-300",
          isHovered && "opacity-100 translate-y-0"
        )}
      >
        <Button 
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}