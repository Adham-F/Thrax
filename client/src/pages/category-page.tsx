import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Product } from '@shared/schema';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import CartSidebar from '@/components/cart-sidebar';
import ProductCard from '@/components/product-card';
import { Loader2, Filter, ArrowUpDown, ChevronDown } from 'lucide-react';
import { 
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Slider
} from '@/components/ui';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from '@/components/ui/separator';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export default function CategoryPage() {
  const [_, params] = useRoute('/category/:category');
  const category = params?.category || '';
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]); // cents: $0 - $1000
  const [filterNew, setFilterNew] = useState(false);
  const [filterPopular, setFilterPopular] = useState(false);
  const [filterSale, setFilterSale] = useState(false);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  // Fetch products by category
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: [`/api/products/category/${category}`],
    enabled: !!category,
  });

  // Filter and sort products
  const filteredProducts = products
    ? products
        .filter(product => 
          (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
          (!filterNew || product.isNew) &&
          (!filterPopular || product.isPopular) &&
          (!filterSale || product.isSale)
        )
        .sort((a, b) => {
          switch (sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'price-asc':
              return a.price - b.price;
            case 'price-desc':
              return b.price - a.price;
            case 'name-asc':
              return a.name.localeCompare(b.name);
            case 'name-desc':
              return b.name.localeCompare(a.name);
            default:
              return 0;
          }
        })
    : [];

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleReset = () => {
    setPriceRange([0, 100000]);
    setFilterNew(false);
    setFilterPopular(false);
    setFilterSale(false);
    setSortBy('newest');
  };

  return (
    <>
      <Helmet>
        <title>{categoryTitle} Products | THRAX</title>
        <meta name="description" content={`Shop our trending ${category} products. Find the latest styles and innovations for Gen Z.`} />
        <meta property="og:title" content={`${categoryTitle} Products | THRAX`} />
        <meta property="og:description" content={`Shop our trending ${category} products. Find the latest styles and innovations.`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        
        <main className="flex-1 py-10 px-4 bg-background">
          <div className="container mx-auto">
            {/* Category Header */}
            <div className="mb-10 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{categoryTitle}</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our trending {category} collection, featuring the latest styles and innovations designed for the next generation.
              </p>
            </div>
            
            {/* Filters and Sorting */}
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down your product search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <div className="space-y-6">
                      {/* Price Range */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Price Range</h3>
                        <div className="px-2">
                          <Slider 
                            defaultValue={[0, 100000]} 
                            max={100000} 
                            step={500}
                            value={priceRange}
                            onValueChange={handlePriceChange}
                          />
                          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                            <span>${(priceRange[0] / 100).toFixed(2)}</span>
                            <span>${(priceRange[1] / 100).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Product Status */}
                      <div>
                        <h3 className="text-sm font-medium mb-3">Product Status</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Checkbox 
                              id="mobile-filter-new" 
                              checked={filterNew} 
                              onCheckedChange={(checked) => setFilterNew(!!checked)} 
                            />
                            <label htmlFor="mobile-filter-new" className="ml-2 text-sm">New Arrivals</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox 
                              id="mobile-filter-popular" 
                              checked={filterPopular} 
                              onCheckedChange={(checked) => setFilterPopular(!!checked)} 
                            />
                            <label htmlFor="mobile-filter-popular" className="ml-2 text-sm">Popular Items</label>
                          </div>
                          <div className="flex items-center">
                            <Checkbox 
                              id="mobile-filter-sale" 
                              checked={filterSale} 
                              onCheckedChange={(checked) => setFilterSale(!!checked)} 
                            />
                            <label htmlFor="mobile-filter-sale" className="ml-2 text-sm">On Sale</label>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <Button onClick={handleReset} variant="outline" className="w-full">
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                  <SheetClose asChild>
                    <Button className="mt-4 w-full">Apply Filters</Button>
                  </SheetClose>
                </SheetContent>
              </Sheet>
              
              {/* Desktop Filters */}
              <div className="hidden md:flex items-center space-x-6">
                <div className="space-x-2">
                  <Button 
                    variant={filterNew ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterNew(!filterNew)}
                  >
                    New
                  </Button>
                  <Button 
                    variant={filterPopular ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterPopular(!filterPopular)}
                  >
                    Popular
                  </Button>
                  <Button 
                    variant={filterSale ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilterSale(!filterSale)}
                  >
                    On Sale
                  </Button>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">Price:</span>
                  <div className="w-48 px-2">
                    <Slider 
                      defaultValue={[0, 100000]} 
                      max={100000} 
                      step={500}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground ml-2">
                    ${(priceRange[0] / 100).toFixed(2)} - ${(priceRange[1] / 100).toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* Sort Dropdown */}
              <div className="flex items-center">
                <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or check back later for new products.
                </p>
                <Button onClick={handleReset} variant="outline" className="mt-4">
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </main>
        
        <SiteFooter />
        <CartSidebar />
      </div>
    </>
  );
}
