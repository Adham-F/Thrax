import { useState } from "react";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { InfoIcon, Truck, RotateCcw, MapPin, PackageCheck, Clock } from "lucide-react";

export default function ShippingPage() {
  // Fetch the shipping page content
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["/api/help-pages/shipping"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/help-pages/shipping");
        return await res.json();
      } catch (error) {
        // Return default if API fails
        return { content: "# Shipping & Returns\n\nInformation about our shipping and return policies." };
      }
    }
  });
  
  return (
    <>
      <Helmet>
        <title>Shipping & Returns | THRAX</title>
        <meta name="description" content="Learn about our shipping methods, delivery times, and return policy." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Shipping & Returns</h1>
              <p className="text-muted-foreground mt-2">
                Everything you need to know about our shipping methods and return policies.
              </p>
            </div>
            
            <Tabs defaultValue="shipping" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="shipping" className="flex items-center">
                  <Truck className="mr-2 h-4 w-4" />
                  <span>Shipping Information</span>
                </TabsTrigger>
                <TabsTrigger value="returns" className="flex items-center">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  <span>Returns & Refunds</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="shipping" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Methods & Delivery Times</CardTitle>
                    <CardDescription>
                      Delivery times may vary based on your location and product availability.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Shipping Method</TableHead>
                          <TableHead>Delivery Time</TableHead>
                          <TableHead>Cost</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Standard Shipping</TableCell>
                          <TableCell>3-5 business days</TableCell>
                          <TableCell>$5.99 (Free on orders over $75)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Express Shipping</TableCell>
                          <TableCell>1-2 business days</TableCell>
                          <TableCell>$12.99</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Next Day Delivery</TableCell>
                          <TableCell>Next business day (order by 2pm)</TableCell>
                          <TableCell>$19.99</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">International Shipping</TableCell>
                          <TableCell>7-14 business days</TableCell>
                          <TableCell>Starting at $15.99 (varies by location)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    <Alert className="mt-6">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Order Processing</AlertTitle>
                      <AlertDescription>
                        All orders are processed within 1-2 business days after payment confirmation. Delivery times are in addition to processing times.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Order Tracking</CardTitle>
                    <CardDescription>
                      Stay updated on your order status.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      Once your order ships, you'll receive a tracking number via email. You can track your package by:
                    </p>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Clicking the tracking link in your shipping confirmation email</li>
                      <li>Visiting your Account dashboard and checking "Order History"</li>
                      <li>Using our "Track Order" page in the Help section</li>
                    </ul>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Shipping Locations</h3>
                          <p className="text-sm text-muted-foreground">
                            We ship to most countries worldwide. Some restrictions may apply.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <PackageCheck className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h3 className="font-medium">Shipping Confirmation</h3>
                          <p className="text-sm text-muted-foreground">
                            You'll receive an email when your order ships with tracking information.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="returns" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Return Policy</CardTitle>
                    <CardDescription>
                      We want you to be completely satisfied with your purchase.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      If you're not completely satisfied with your purchase, we accept returns within 30 days of delivery for a full refund or exchange.
                    </p>
                    
                    <h3 className="font-semibold text-lg mt-4">Return Eligibility Requirements:</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Items must be unworn, unwashed, and in original condition</li>
                      <li>All original tags and packaging must be attached/included</li>
                      <li>You must have proof of purchase (order confirmation or receipt)</li>
                      <li>Returns must be initiated within 30 days of delivery</li>
                    </ul>
                    
                    <h3 className="font-semibold text-lg mt-4">Non-Returnable Items:</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      <li>Earphones and earbuds (for hygiene reasons)</li>
                      <li>Underwear and swimwear (if seal is broken or tags removed)</li>
                      <li>Gift cards</li>
                      <li>Items marked as "Final Sale"</li>
                      <li>Items that show signs of wear or have been altered</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>How to Return an Item</CardTitle>
                    <CardDescription>
                      Follow these simple steps to return your item.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-4 list-decimal pl-5">
                      <li>
                        <span className="font-medium">Initiate your return</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Log into your account, go to "Order History," select the order with the item you wish to return, and click "Return Items."
                        </p>
                      </li>
                      <li>
                        <span className="font-medium">Print your return label</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          We'll email you a prepaid return shipping label. Print this label and attach it to your package.
                        </p>
                      </li>
                      <li>
                        <span className="font-medium">Package your return</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Place the item(s) in their original packaging if possible, or use a secure box or envelope.
                        </p>
                      </li>
                      <li>
                        <span className="font-medium">Ship your return</span>
                        <p className="text-sm text-muted-foreground mt-1">
                          Drop off your package at any authorized shipping location. We recommend keeping your receipt until the return is processed.
                        </p>
                      </li>
                    </ol>
                    
                    <Alert className="mt-6">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Return Shipping Fees</AlertTitle>
                      <AlertDescription>
                        Return shipping is free for exchanges or if the item arrived damaged or defective. For all other returns, a flat fee of $5.99 will be deducted from your refund.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Refund Process</CardTitle>
                    <CardDescription>
                      What to expect after you return an item.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h3 className="font-medium">Refund Timeline</h3>
                        <p className="text-sm text-muted-foreground">
                          Once we receive your return (typically 3-5 business days after shipping), we'll inspect the item and process your refund. The refund will be issued to your original payment method and may take an additional 5-10 business days to appear in your account, depending on your payment provider.
                        </p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <p className="text-sm">
                      If you have any questions about your return or refund, please contact our customer service team at support@thrax.com or call us at (555) 123-4567.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
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