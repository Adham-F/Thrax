import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, calculateDiscountedPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useCart } from "@/contexts/cart-context";

interface FeaturedCollectionProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  viewAllLink?: string;
  className?: string;
}

export default function FeaturedCollection({
  title,
  products,
  isLoading = false,
  viewAllLink = "/category/tech",
  className
}: FeaturedCollectionProps) {
  const { addToCart } = useCart();

  // Make sure we have at least 4 products
  const featuredProduct = products?.[0];
  const smallProducts = products?.slice(1, 4);

  // Handle add to cart
  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  return (
    <section className={cn("py-12 px-4 bg-background", className)}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <Link href={viewAllLink}>
            <a className="text-primary hover:text-secondary transition-colors text-sm font-medium">
              View Collection
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured Large Product */}
          {isLoading || !featuredProduct ? (
            <div className="bg-card rounded-xl overflow-hidden">
              <Skeleton className="w-full aspect-video" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between pt-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl overflow-hidden shadow-lg">
              <Link href={`/product/${featuredProduct.id}`}>
                <a>
                  <img 
                    src={featuredProduct.imageUrl}
                    alt={featuredProduct.name}
                    className="w-full aspect-video object-cover"
                  />
                </a>
              </Link>
              <div className="p-6">
                <Link href={`/product/${featuredProduct.id}`}>
                  <a>
                    <h3 className="text-xl font-bold text-foreground mb-2">{featuredProduct.name}</h3>
                    <p className="text-muted-foreground mb-4">{featuredProduct.description}</p>
                  </a>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">
                    {featuredProduct.isSale && featuredProduct.discountPercentage
                      ? formatPrice(calculateDiscountedPrice(featuredProduct.price, featuredProduct.discountPercentage))
                      : formatPrice(featuredProduct.price)}
                  </span>
                  <Button 
                    onClick={() => handleAddToCart(featuredProduct)}
                    className="bg-primary hover:bg-primary/90 text-white flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                      <path d="M3 6h18"></path>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Small Products Grid */}
          <div className="grid grid-cols-1 gap-6">
            {isLoading || !smallProducts ? (
              // Skeleton loaders for small products
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="bg-card rounded-xl overflow-hidden flex">
                  <Skeleton className="w-1/3 h-full" />
                  <div className="w-2/3 p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center justify-between pt-2">
                      <Skeleton className="h-5 w-1/4" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Actual small products
              smallProducts.map((product) => (
                <div key={product.id} className="bg-card rounded-xl overflow-hidden shadow-lg flex">
                  <div className="w-1/3">
                    <Link href={`/product/${product.id}`}>
                      <a>
                        <img 
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    </Link>
                  </div>
                  <div className="w-2/3 p-4">
                    <Link href={`/product/${product.id}`}>
                      <a>
                        <h3 className="font-bold text-foreground mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
                      </a>
                    </Link>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-foreground">
                        {product.isSale && product.discountPercentage
                          ? formatPrice(calculateDiscountedPrice(product.price, product.discountPercentage))
                          : formatPrice(product.price)}
                      </span>
                      <Button 
                        size="icon"
                        onClick={() => handleAddToCart(product)}
                        className="bg-primary hover:bg-primary/90 text-white p-2 rounded-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                          <path d="M3 6h18"></path>
                          <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
