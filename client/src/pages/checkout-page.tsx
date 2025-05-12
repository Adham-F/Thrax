import { useState } from "react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CartSidebar from "@/components/cart-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { useLocation } from "wouter";
import { Loader2, CreditCard, Check, ShieldCheck, Package, ArrowLeft, ChevronsLeft } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form validation schemas
const shippingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid zip code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().min(10, "Valid phone number is required"),
});

const paymentSchema = z.object({
  cardName: z.string().min(2, "Cardholder name is required"),
  cardNumber: z.string().min(15, "Valid card number is required").max(19),
  expiryDate: z.string().min(5, "Valid expiry date is required (MM/YY)"),
  cvv: z.string().min(3, "Valid CVV is required").max(4),
});

type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

export default function CheckoutPage() {
  const [_, setLocation] = useLocation();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  
  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phone: "",
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  // Calculate shipping cost based on selected method
  const shippingCost = shippingMethod === "express" ? 1500 : 500; // $15 or $5
  // Free shipping for orders over $50
  const isFreeShipping = totalPrice >= 5000;
  const finalShippingCost = isFreeShipping ? 0 : shippingCost;
  const orderTotal = totalPrice + finalShippingCost;

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: { 
      orderDetails: any;
      orderItems: any[];
    }) => {
      const response = await apiRequest("POST", "/api/orders", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      setLocation("/"); // Redirect to home page
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setActiveTab("payment");
  };

  const onPaymentSubmit = (data: PaymentFormData) => {
    if (!shippingData) {
      toast({
        title: "Shipping information missing",
        description: "Please complete the shipping information first",
        variant: "destructive",
      });
      setActiveTab("shipping");
      return;
    }

    // Create order with shipping and payment details
    const orderData = {
      orderDetails: {
        totalAmount: orderTotal,
        status: "pending",
        shippingDetails: {
          ...shippingData,
          method: shippingMethod,
          cost: finalShippingCost,
        },
        paymentDetails: {
          method: paymentMethod,
          // Store only partial card info for receipts/invoices
          lastFour: data.cardNumber.slice(-4),
          cardName: data.cardName,
        },
      },
      orderItems: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  // Handle tab switching
  const handleTabChange = (value: string) => {
    if (value === "payment" && !shippingForm.formState.isValid) {
      shippingForm.trigger();
      if (!shippingForm.formState.isValid) {
        toast({
          title: "Please complete shipping information",
          description: "Fill in all required fields before proceeding",
          variant: "destructive",
        });
        return;
      }
    }
    setActiveTab(value);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        
        <main className="flex-1 py-10 px-4 bg-background">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-8 text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Your cart is empty</CardTitle>
                <CardDescription>Add some products to your cart to checkout</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button asChild>
                  <a href="/">Continue Shopping</a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | VIBE</title>
        <meta name="description" content="Complete your purchase securely" />
        <meta property="og:title" content="Checkout | VIBE" />
        <meta property="og:description" content="Complete your purchase securely" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        
        <main className="flex-1 py-10 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            {/* Back button */}
            <a href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
              <ChevronsLeft className="mr-1 h-4 w-4" />
              Continue Shopping
            </a>
            
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Tabs */}
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="shipping">Shipping</TabsTrigger>
                    <TabsTrigger value="payment">Payment</TabsTrigger>
                  </TabsList>
                  
                  {/* Shipping Information */}
                  <TabsContent value="shipping">
                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                        <CardDescription>Enter your shipping details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...shippingForm}>
                          <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-6">
                            <FormField
                              control={shippingForm.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={shippingForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Street address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={shippingForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={shippingForm.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Input placeholder="State/Province" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={shippingForm.control}
                                name="zipCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Zip/Postal code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={shippingForm.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Country" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={shippingForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="For delivery updates" type="tel" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Shipping Method</h3>
                              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                                <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-primary">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="standard" id="standard" />
                                    <Label htmlFor="standard" className="font-medium cursor-pointer">Standard Shipping</Label>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{isFreeShipping ? "Free" : formatPrice(500)}</p>
                                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-primary">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="express" id="express" />
                                    <Label htmlFor="express" className="font-medium cursor-pointer">Express Shipping</Label>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{isFreeShipping ? "Free" : formatPrice(1500)}</p>
                                    <p className="text-sm text-muted-foreground">1-2 business days</p>
                                  </div>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <Button type="submit" className="w-full">
                              Continue to Payment
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Payment Information */}
                  <TabsContent value="payment">
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Information</CardTitle>
                        <CardDescription>Enter your payment details</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...paymentForm}>
                          <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                            <div className="space-y-4">
                              <h3 className="text-lg font-medium">Payment Method</h3>
                              <RadioGroup 
                                value={paymentMethod} 
                                onValueChange={setPaymentMethod}
                                className="flex flex-col space-y-4"
                              >
                                <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:border-primary">
                                  <RadioGroupItem value="credit-card" id="credit-card" />
                                  <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                                    <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                                    <span>Credit Card</span>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            
                            <div className="space-y-4">
                              <FormField
                                control={paymentForm.control}
                                name="cardName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cardholder Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Name as it appears on card" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={paymentForm.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Card number" 
                                        {...field}
                                        maxLength={19}
                                        onChange={(e) => {
                                          // Format card number with spaces
                                          const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                          const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
                                          field.onChange(formattedValue);
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={paymentForm.control}
                                  name="expiryDate"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Expiry Date</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="MM/YY" 
                                          {...field}
                                          maxLength={5}
                                          onChange={(e) => {
                                            // Format expiry date
                                            let value = e.target.value.replace(/[^0-9]/g, '');
                                            if (value.length > 2) {
                                              value = `${value.slice(0, 2)}/${value.slice(2)}`;
                                            }
                                            field.onChange(value);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={paymentForm.control}
                                  name="cvv"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>CVV</FormLabel>
                                      <FormControl>
                                        <Input 
                                          placeholder="Security code" 
                                          type="password" 
                                          {...field} 
                                          maxLength={4}
                                          onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9]/g, '');
                                            field.onChange(value);
                                          }}
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2 mt-6">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                <span>Your payment information is secure and encrypted</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setActiveTab("shipping")}
                                className="flex-1"
                              >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Shipping
                              </Button>
                              
                              <Button 
                                type="submit" 
                                className="flex-1"
                                disabled={createOrderMutation.isPending}
                              >
                                {createOrderMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    Complete Order
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-12 h-12 rounded-md overflow-hidden bg-muted mr-3">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium line-clamp-1">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="font-medium">{formatPrice(item.product.price * item.quantity)}</div>
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      {/* Subtotal */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                        <span className="font-medium">{formatPrice(totalPrice)}</span>
                      </div>
                      
                      {/* Shipping */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium">
                          {isFreeShipping ? "Free" : formatPrice(finalShippingCost)}
                        </span>
                      </div>
                      
                      {/* Taxes */}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taxes</span>
                        <span className="font-medium">Calculated at checkout</span>
                      </div>
                      
                      <Separator />
                      
                      {/* Total */}
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(orderTotal)}</span>
                      </div>
                      
                      {/* Free shipping notice */}
                      {totalPrice < 5000 && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Add {formatPrice(5000 - totalPrice)} more to get free shipping!
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Secure info */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Package className="h-4 w-4 mr-2" />
                    <span>Free returns within 30 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}
