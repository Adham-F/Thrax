import { useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartSidebar() {
  const { 
    isCartOpen, 
    closeCart, 
    cartItems, 
    totalItems, 
    totalPrice,
    isLoading,
    removeFromCart,
    updateQuantity
  } = useCart();
  const { user } = useAuth();

  // Prevent scrolling of the background when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Close cart when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const sidebar = document.getElementById('cartSidebar');
      if (sidebar && !sidebar.contains(event.target as Node) && isCartOpen) {
        closeCart();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeCart, isCartOpen]);

  // Close cart with ESC key
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    }

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [closeCart, isCartOpen]);

  return (
    <>
      {/* Background overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity duration-300",
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      
      {/* Cart sidebar */}
      <aside 
        id="cartSidebar"
        className={cn(
          "fixed top-0 right-0 h-full w-full md:w-96 bg-muted z-50 shadow-2xl transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Cart Header */}
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Your Cart {totalItems > 0 && `(${totalItems})`}
            </h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={closeCart}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Cart Content */}
          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sign in to view your cart</h3>
              <p className="text-muted-foreground mb-6">Sign in to see your cart items and checkout</p>
              <Button asChild>
                <Link href="/auth" onClick={closeCart}>Sign In</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex-1 p-4 space-y-4">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex p-3 border rounded-lg">
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <div className="ml-4 flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex justify-between items-center mt-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any products to your cart yet</p>
              <Button asChild onClick={closeCart}>
                <Link href="/category/tech">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollArea className="flex-1 p-4 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-card rounded-lg p-3 flex">
                    <div className="w-20 h-20 rounded-md overflow-hidden">
                      <Link href={`/product/${item.productId}`} onClick={closeCart}>
                        <a>
                          <img 
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </a>
                      </Link>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <Link href={`/product/${item.productId}`} onClick={closeCart}>
                          <a className="font-medium text-foreground hover:text-primary transition-colors">
                            {item.product.name}
                          </a>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-muted-foreground hover:text-destructive transition-colors"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.product.subcategory || item.product.category}
                      </p>
                      <div className="flex justify-between mt-2 items-center">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-foreground">{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-6 w-6 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-bold text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              
              {/* Cart Summary */}
              <div className="p-4 border-t border-border">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-foreground">
                      {totalPrice >= 5000 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/checkout" onClick={closeCart}>
                    Checkout
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full mt-3" 
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
