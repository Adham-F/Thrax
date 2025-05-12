import { Product } from "@shared/schema";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface TrendingProductsProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  viewAllLink?: string;
  className?: string;
}

export default function TrendingProducts({
  title,
  products,
  isLoading = false,
  viewAllLink = "/category/all",
  className
}: TrendingProductsProps) {
  // Create skeleton loader array
  const skeletons = Array(8).fill(0).map((_, i) => i);

  return (
    <section className={cn("py-12 px-4 bg-muted", className)}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <Link href={viewAllLink}>
            <a className="text-primary hover:text-secondary transition-colors text-sm font-medium">
              View All
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            // Skeleton loaders while data is loading
            skeletons.map((index) => (
              <div key={index} className="bg-card rounded-xl overflow-hidden">
                <Skeleton className="w-full aspect-square" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Actual product cards
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
