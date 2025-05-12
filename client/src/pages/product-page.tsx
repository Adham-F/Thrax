import { useState } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Product } from '@shared/schema';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import CartSidebar from '@/components/cart-sidebar';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/hooks/use-auth';
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrendingProducts from '@/components/trending-products';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Heart, 
  Package, 
  Truck, 
  CreditCard, 
  ArrowLeft, 
  Loader2,
  Star,
  CheckCircle
} from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';

export default function ProductPage() {
  const [_, params] = useRoute('/product/:id');
  const productId = params?.id ? parseInt(params.id) : 0;
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch product details
  const { data: product, isLoading: isProductLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  // Fetch related products
  const { data: relatedProducts, isLoading: isRelatedLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/popular'],
    enabled: !!product,
  });

  // Wishlist mutation
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
      toast({
        title: 'Added to wishlist',
        description: 'Item has been added to your wishlist',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to add to wishlist',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleAddToWishlist = () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to add items to your wishlist',
        variant: 'destructive',
      });
      return;
    }
    
    if (product) {
      addToWishlistMutation.mutate(product.id);
    }
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="mb-4">Sorry, the product you are looking for does not exist or has been removed.</p>
            <Button asChild>
              <a href="/">Back to Home</a>
            </Button>
          </Card>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const discountedPrice = product.isSale && product.discountPercentage
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : null;

  return (
    <>
      <Helmet>
        <title>{product.name} | VIBE</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={`${product.name} | VIBE`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.imageUrl} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        
        <main className="flex-1 py-10 px-4 bg-background">
          <div className="container mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <a href="/" className="text-muted-foreground hover:text-primary flex items-center text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to shopping
              </a>
            </div>
            
            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Product Image */}
              <div className="rounded-xl overflow-hidden bg-muted">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-auto object-cover aspect-square"
                />
              </div>
              
              {/* Product Info */}
              <div>
                {/* Badge and Title */}
                <div className="space-y-3 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.isNew && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                        New
                      </span>
                    )}
                    {product.isPopular && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        Popular
                      </span>
                    )}
                    {product.isSale && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {product.discountPercentage}% Off
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                  
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-4 w-4 fill-primary text-primary" 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      (24 reviews)
                    </span>
                  </div>
                </div>
                
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-foreground">
                      {discountedPrice 
                        ? formatPrice(discountedPrice) 
                        : formatPrice(product.price)}
                    </span>
                    
                    {discountedPrice && (
                      <span className="ml-2 text-lg text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  {product.inStock ? (
                    <p className="text-sm text-green-500 flex items-center mt-1">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      In Stock
                    </p>
                  ) : (
                    <p className="text-sm text-destructive flex items-center mt-1">
                      Out of Stock
                    </p>
                  )}
                </div>
                
                {/* Description */}
                <div className="mb-6">
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
                
                {/* Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-input rounded-md">
                      <button
                        className="px-3 py-2 text-foreground hover:text-primary transition-colors"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-12 text-center border-0 bg-transparent focus:outline-none focus:ring-0"
                      />
                      <button
                        className="px-3 py-2 text-foreground hover:text-primary transition-colors"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <Button 
                      className="flex-1"
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleAddToWishlist}
                    >
                      <Heart className="h-5 w-5 text-accent" />
                    </Button>
                  </div>
                </div>
                
                {/* Shipping Info */}
                <div className="mt-8 space-y-3">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="text-sm">Free shipping on orders over $50</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="text-sm">30-day returns</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-muted-foreground" />
                    <span className="text-sm">Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="mt-16">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="specifications">Specifications</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </TabsContent>
                <TabsContent value="specifications" className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-b pb-2">
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium capitalize">{product.category}</p>
                    </div>
                    {product.subcategory && (
                      <div className="border-b pb-2">
                        <p className="text-sm text-muted-foreground">Subcategory</p>
                        <p className="font-medium capitalize">{product.subcategory}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="p-6 border rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-5 w-5 fill-primary text-primary" 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-muted-foreground">Based on 24 reviews</span>
                  </div>
                  <p className="text-muted-foreground italic">Reviews will be displayed here in a production environment.</p>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Related Products */}
            {relatedProducts && (
              <div className="mt-16">
                <TrendingProducts 
                  title="You May Also Like" 
                  products={relatedProducts.filter(p => p.id !== product.id).slice(0, 4)}
                  isLoading={isRelatedLoading}
                />
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
