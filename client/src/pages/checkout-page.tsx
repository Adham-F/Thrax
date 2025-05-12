import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn, formatPrice } from "@/lib/utils";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, ChevronLeft, CreditCard, Building } from "lucide-react";
import StripePaymentForm from "@/components/stripe-payment-form";
import { apiRequest } from "@/lib/queryClient";

export default function CheckoutPage() {
  const [match, params] = useRoute("/checkout");
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Shipping information state
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  });
  
  // Order notes
  const [orderNotes, setOrderNotes] = useState("");
  
  // Calculate order summary
  const subtotal = totalPrice;
  const shipping = subtotal > 10000 ? 0 : 999; // Free shipping for orders over $100
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const total = subtotal + shipping + tax;
  
  useEffect(() => {
    // Redirect if cart is empty
    if (cartItems.length === 0 && !orderCompleted) {
      navigate("/");
      toast({
        title: "Your cart is empty",
        description: "Add some items to your cart before checking out.",
      });
    }
    
    // Set shipping info if user is logged in
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [cartItems.length, navigate, toast, user]);
  
  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // In a real app, we would submit the order to the server here
      const response = await apiRequest("POST", "/api/orders", {
        orderDetails: {
          total,
          subtotal,
          tax,
          shipping,
          shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
          shippingMethod: "Standard",
          paymentMethod,
          status: "paid",
          notes: orderNotes,
        },
        orderItems: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        })),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      
      const orderData = await response.json();
      
      // Clear cart and set order as completed
      clearCart();
      setOrderCompleted(true);
      setOrderId(orderData.id);
      
      // Show success toast
      toast({
        title: "Order completed!",
        description: "Thank you for your purchase.",
      });
      
    } catch (error) {
      console.error("Error creating order:", error);
      setProcessingError("There was an error processing your order. Please try again.");
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handlePaymentError = (message: string) => {
    setProcessingError(message);
    toast({
      title: "Payment failed",
      description: message,
      variant: "destructive",
    });
  };
  
  if (orderCompleted) {
    return (
      <>
        <Helmet>
          <title>Order Confirmation | THRAX</title>
          <meta name="description" content="Your order has been confirmed. Thank you for shopping with THRAX." />
        </Helmet>
        
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          
          <main className="flex-1 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
              <Card className="overflow-hidden">
                <CardHeader className="bg-primary text-primary-foreground text-center py-8">
                  <div className="mx-auto w-12 h-12 bg-primary-foreground rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold">Order Confirmed!</CardTitle>
                  <CardDescription className="text-primary-foreground/80 text-lg">
                    Thank you for your purchase.
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-8 space-y-6">
                  <div className="text-center">
                    <p>
                      Order #{orderId || "00000000"}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      A confirmation email has been sent to {shippingInfo.email}
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pb-8">
                  <Button onClick={() => navigate("/")} className="flex items-center">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </main>
          
          <SiteFooter />
        </div>
      </>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout | THRAX</title>
        <meta name="description" content="Complete your purchase securely on THRAX." />
      </Helmet>
      
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Checkout</h1>
              <Button variant="outline" onClick={() => navigate("/cart")} className="flex items-center">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Cart
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Customer Info */}
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingInfoChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleShippingInfoChange}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingInfoChange}
                        placeholder="Enter your street address"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleShippingInfoChange}
                          placeholder="Enter your city"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleShippingInfoChange}
                          placeholder="Enter your state/province"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={shippingInfo.postalCode}
                          onChange={handleShippingInfoChange}
                          placeholder="Enter your postal code"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={shippingInfo.phone}
                          onChange={handleShippingInfoChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="Add any special instructions or notes about your order"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as "card" | "bank")}>
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="card" className="flex items-center justify-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Credit Card
                        </TabsTrigger>
                        <TabsTrigger value="bank" className="flex items-center justify-center">
                          <Building className="mr-2 h-4 w-4" />
                          Bank Transfer
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="card" className="pt-4">
                        <StripePaymentForm
                          amount={total}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                        />
                      </TabsContent>
                      <TabsContent value="bank" className="pt-4">
                        <Card>
                          <CardContent className="pt-6 space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Please make a bank transfer to the following account. Your order will be processed once we receive the payment.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="font-medium">Bank Name:</div>
                              <div>First National Bank</div>
                              
                              <div className="font-medium">Account Name:</div>
                              <div>THRAX Inc.</div>
                              
                              <div className="font-medium">Account Number:</div>
                              <div>1234567890</div>
                              
                              <div className="font-medium">Routing Number:</div>
                              <div>987654321</div>
                              
                              <div className="font-medium">Reference:</div>
                              <div>Your email address</div>
                            </div>
                            
                            <Button 
                              onClick={handlePaymentSuccess} 
                              className="w-full"
                              disabled={isProcessing}
                            >
                              {isProcessing ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Complete Order"
                              )}
                            </Button>
                            
                            {processingError && (
                              <div className="text-sm text-red-500 p-2 bg-red-50 rounded">
                                {processingError}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="h-16 w-16 rounded bg-muted overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}