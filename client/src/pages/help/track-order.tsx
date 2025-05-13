import { useState } from "react";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InfoIcon, SearchIcon, Package, Truck, TruckIcon, ShoppingBag, CheckCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const trackingFormSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  email: z.string().email("Please enter a valid email address")
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

// Dummy tracking data for demo purposes
const DEMO_TRACKING_DATA = {
  orderNumber: "THRX1234567",
  status: "In Transit",
  estimatedDelivery: "May 15, 2023",
  carrier: "FedEx",
  trackingNumber: "FX123456789",
  items: [
    { name: "Wireless Earbuds Pro", quantity: 1, status: "Shipped" },
    { name: "Premium Phone Case", quantity: 2, status: "Shipped" }
  ],
  events: [
    { date: "May 10, 2023", time: "9:30 AM", location: "Distribution Center", description: "Package departed facility" },
    { date: "May 9, 2023", time: "4:15 PM", location: "Regional Sorting Center", description: "Package arrived at carrier facility" },
    { date: "May 9, 2023", time: "10:20 AM", location: "Local Warehouse", description: "Package processed for shipping" },
    { date: "May 8, 2023", time: "3:45 PM", location: "THRAX Fulfillment Center", description: "Order packed and ready for pickup" },
    { date: "May 8, 2023", time: "11:30 AM", location: "THRAX Fulfillment Center", description: "Order processing started" },
    { date: "May 7, 2023", time: "2:10 PM", location: "Online", description: "Order confirmed" }
  ]
};

export default function TrackOrderPage() {
  const { toast } = useToast();
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Fetch the tracking page content
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["/api/help-pages/trackOrder"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/help-pages/trackOrder");
        return await res.json();
      } catch (error) {
        // Return default if API fails
        return { content: "# Track Your Order\n\nEnter your order details to check your order status." };
      }
    }
  });
  
  const form = useForm<TrackingFormValues>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: {
      orderNumber: "",
      email: ""
    }
  });
  
  const onSubmit = (data: TrackingFormValues) => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, always return the demo data
      setTrackingResult(DEMO_TRACKING_DATA);
      setIsSearching(false);
    }, 1500);
  };
  
  const trackingStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "delivered":
        return "text-green-500";
      case "in transit":
        return "text-blue-500";
      case "processing":
        return "text-yellow-500";
      case "on hold":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Track Your Order | THRAX</title>
        <meta name="description" content="Track the status and location of your THRAX order with your order number and email." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Track Your Order</h1>
              <p className="text-muted-foreground mt-2">
                Check the status of your order with your order number and email address.
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Order Details</CardTitle>
                <CardDescription>
                  You can find your order number in your order confirmation email.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="orderNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Order Number</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. THRX1234567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Email used for your order" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full sm:w-auto" disabled={isSearching}>
                      {isSearching ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <SearchIcon className="mr-2 h-4 w-4" />
                          Track Order
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {trackingResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Order #{trackingResult.orderNumber}</span>
                    <span className={`text-sm font-medium ${trackingStatusColor(trackingResult.status)}`}>
                      {trackingResult.status}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Estimated delivery: {trackingResult.estimatedDelivery}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-muted rounded-md">
                    <div className="flex items-start space-x-3">
                      <TruckIcon className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Shipping Details</h3>
                        <p className="text-sm">
                          {trackingResult.carrier}: {trackingResult.trackingNumber}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <ShoppingBag className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Items</h3>
                        <p className="text-sm">
                          {trackingResult.items.length} items in your order
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Items in Your Order</h3>
                    <div className="space-y-2">
                      {trackingResult.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between border-b pb-2">
                          <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {item.name} x{item.quantity}
                            </span>
                          </div>
                          <span className={item.status === "Shipped" ? "text-green-500" : "text-yellow-500"}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Tracking History</h3>
                    <div className="relative">
                      <div className="absolute top-0 bottom-0 left-[21px] w-px bg-border"></div>
                      <ul className="space-y-6 relative">
                        {trackingResult.events.map((event: any, index: number) => (
                          <li key={index} className="relative pl-12">
                            <div className={`absolute left-0 top-0.5 h-5 w-5 rounded-full border-2 border-background ${index === 0 ? "bg-primary" : "bg-muted"}`}></div>
                            <div className="mb-0.5 flex items-center text-sm">
                              <span className="font-semibold">{event.date}</span>
                              <span className="mx-2 text-muted-foreground">•</span>
                              <span className="text-muted-foreground">{event.time}</span>
                            </div>
                            <h4 className="font-medium">{event.description}</h4>
                            <span className="text-sm text-muted-foreground">{event.location}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2">
                  <Alert variant="default">
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Need Help?</AlertTitle>
                    <AlertDescription>
                      If you have questions about your delivery, please contact our customer service at support@thrax.com or call us at (555) 123-4567.
                    </AlertDescription>
                  </Alert>
                </CardFooter>
              </Card>
            )}
            
            {!trackingResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Check Your Order Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Where to Find Your Order Number</AlertTitle>
                    <AlertDescription>
                      Your order number can be found in the order confirmation email that was sent after your purchase. It starts with "THRX" followed by 7 digits.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                      <div>
                        <h4 className="font-medium">Check Your Email</h4>
                        <p className="text-sm text-muted-foreground">
                          Look for an email with the subject "Your THRAX Order Confirmation"
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                      <div>
                        <h4 className="font-medium">Log Into Your Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Your order details are also available in the "Order History" section of your account
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!isLoading && pageContent && (
              <Card>
                <CardContent className="prose dark:prose-invert max-w-none py-6">
                  {/* In a real app, use a markdown renderer here */}
                  <pre className="whitespace-pre-wrap">{pageContent.content}</pre>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}