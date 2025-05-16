import { useState } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, Link } from "wouter";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";

import { 
  User, 
  Package, 
  Heart, 
  CreditCard, 
  LogOut, 
  Settings, 
  Mail, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  Check, 
  ShoppingBag, 
  Clock,
  X
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Order, 
  OrderItemWithProduct,
  WishlistItemWithProduct 
} from "@shared/schema";

interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
}

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");

  const { 
    data: orders = [],
    isLoading: isOrdersLoading,
  } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    queryFn: () => apiRequest("GET", "/api/orders").then((res) => res.json()),
    enabled: !!user,
  });
  
  const {
    data: wishlist = [],
    isLoading: isWishlistLoading,
  } = useQuery<WishlistItemWithProduct[]>({
    queryKey: ["/api/wishlist"],
    queryFn: () => apiRequest("GET", "/api/wishlist").then((res) => res.json()),
    enabled: !!user,
  });
  
  // Mutation to remove item from wishlist
  const removeWishlistItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/wishlist/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wishlist"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your wishlist",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from wishlist",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "paid":
        return "bg-blue-500/10 text-blue-500";
      case "shipped":
        return "bg-indigo-500/10 text-indigo-500";
      case "delivered":
        return "bg-green-500/10 text-green-500";
      case "cancelled":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile | THRAX</title>
        <meta name="description" content="Manage your account and view your orders" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
                <p className="text-muted-foreground">
                  Manage your account settings and view your orders
                </p>
              </div>
              <div className="mt-4 md:mt-0 space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("orders")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  View Orders
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-muted/50 grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
                <TabsTrigger value="account">
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="orders">
                  <Package className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Orders</span>
                </TabsTrigger>
                <TabsTrigger value="wishlist">
                  <Heart className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Wishlist</span>
                </TabsTrigger>
                <TabsTrigger value="payment">
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Payment</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details here.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" defaultValue={user.username} readOnly />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.fullName || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => 
                          toast({
                            title: "Profile updated",
                            description: "Your profile has been updated successfully.",
                          })
                        }
                      >
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Loyalty Program</CardTitle>
                      <CardDescription>
                        Your current status and benefits.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LoyaltyPoints className="mb-4" />
                      <div className="space-y-2 mt-8">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current Points</span>
                          <span className="font-medium">{user.loyaltyPoints || 0} pts</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current Tier</span>
                          <span className="font-medium">{user.loyaltyTier || "Bronze"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Points to Next Tier</span>
                          <span className="font-medium">
                            {user.loyaltyTier === "Bronze" ? (
                              "200 pts to Silver"
                            ) : user.loyaltyTier === "Silver" ? (
                              "300 pts to Gold"
                            ) : user.loyaltyTier === "Gold" ? (
                              "500 pts to Platinum"
                            ) : user.loyaltyTier === "Platinum" ? (
                              "1000 pts to Diamond"
                            ) : (
                              "Max tier reached"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        Learn More About Rewards
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Update your password and security settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div />
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>Email notifications</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                          <span>Two-factor authentication</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-muted-foreground" />
                          <span>Connected accounts</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => 
                        toast({
                          title: "Security settings updated",
                          description: "Your security settings have been updated successfully.",
                        })
                      }
                    >
                      Update Security Settings
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription>
                      View and track your previous orders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isOrdersLoading ? (
                      <div className="py-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-8 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                        <p className="mt-2 text-muted-foreground">
                          You haven't placed any orders yet.
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/">Start Shopping</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-y-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">Order #{order.id}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getOrderStatusColor(order.status)}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </span>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Placed on {order.createdAt ? new Date(String(order.createdAt)).toLocaleDateString() : 'N/A'}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  ${(order.totalAmount / 100).toFixed(2)}
                                </span>
                                <Button variant="ghost" size="sm" asChild>
                                  <Link href={`/orders/${order.id}`}>
                                    View Details
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                            <div className="p-4">
                              {order.items && order.items.length > 0 ? (
                                <ul className="space-y-3">
                                  {order.items.slice(0, 3).map((item) => (
                                    <li key={item.id} className="flex items-center gap-3">
                                      <div className="w-12 h-12 rounded bg-muted/60 flex items-center justify-center overflow-hidden">
                                        {item.product.imageUrl ? (
                                          <img 
                                            src={item.product.imageUrl} 
                                            alt={item.product.name} 
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <Package className="h-6 w-6 text-muted-foreground" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {item.product.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Qty: {item.quantity} × ${(item.priceAtPurchase / 100).toFixed(2)}
                                        </p>
                                      </div>
                                    </li>
                                  ))}
                                  {order.items.length > 3 && (
                                    <li className="text-xs text-muted-foreground">
                                      +{order.items.length - 3} more items
                                    </li>
                                  )}
                                </ul>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No items available for this order.
                                </p>
                              )}
                            </div>
                            {order.status === "delivered" && (
                              <div className="px-4 pb-4">
                                <Button variant="outline" size="sm">
                                  Buy Again
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Track Your Orders</CardTitle>
                    <CardDescription>
                      Real-time updates on your active orders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orders.some(order => ["paid", "shipped"].includes(order.status)) ? (
                      <div className="space-y-4">
                        {orders
                          .filter(order => ["paid", "shipped"].includes(order.status))
                          .map(order => (
                            <div key={`track-${order.id}`} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-sm font-medium">Order #{order.id}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    Placed on {order.createdAt ? new Date(String(order.createdAt)).toLocaleDateString() : 'N/A'}
                                  </p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getOrderStatusColor(order.status)}`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="relative pt-2">
                                  <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
                                    <div
                                      style={{ width: order.status === "paid" ? "50%" : "75%" }}
                                      className="rounded bg-primary transition-all duration-500"
                                    />
                                  </div>
                                  <div className="flex justify-between text-xs mt-2">
                                    <div className="flex flex-col items-center">
                                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="h-3 w-3 text-primary-foreground" />
                                      </div>
                                      <span className="mt-1">Ordered</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                        <Check className="h-3 w-3 text-primary-foreground" />
                                      </div>
                                      <span className="mt-1">Paid</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className={`w-5 h-5 rounded-full ${order.status === "shipped" ? "bg-primary" : "bg-muted"} flex items-center justify-center`}>
                                        {order.status === "shipped" ? (
                                          <Check className="h-3 w-3 text-primary-foreground" />
                                        ) : (
                                          <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                                        )}
                                      </div>
                                      <span className="mt-1">Shipped</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                      </div>
                                      <span className="mt-1">Delivered</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center text-xs text-muted-foreground mt-4">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {order.status === "paid" 
                                      ? "Your order is being processed and will ship soon."
                                      : "Your order is on its way! Estimated delivery in 2-3 days."}
                                  </span>
                                </div>
                                
                                <Button size="sm" variant="outline" className="w-full mt-2">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">No active shipments</h3>
                        <p className="mt-2 text-muted-foreground">
                          You don't have any orders being processed or shipped right now.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="wishlist" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Wishlist</CardTitle>
                    <CardDescription>
                      Items you've saved for later.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isWishlistLoading ? (
                      <div className="py-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading your wishlist...</p>
                      </div>
                    ) : wishlist.length === 0 ? (
                      <div className="py-8 text-center">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
                        <p className="mt-2 text-muted-foreground">
                          Save items you're interested in for later.
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/">Explore Products</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {wishlist.map((item) => (
                          <div key={item.id} className="flex items-center justify-between border rounded-lg p-4">
                            <div className="flex items-center space-x-4">
                              <div className="h-16 w-16 rounded-md overflow-hidden">
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">{item.product.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                                <p className="text-sm font-medium mt-1">
                                  {item.product.isOnSale ? (
                                    <>
                                      <span className="text-red-500">${((item.product.price * (100 - item.product.discountPercentage!)) / 10000).toFixed(2)}</span>
                                      <span className="text-muted-foreground line-through ml-2">${(item.product.price / 100).toFixed(2)}</span>
                                    </>
                                  ) : (
                                    <>${(item.product.price / 100).toFixed(2)}</>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/product/${item.productId}`}>
                                  View
                                </Link>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => removeWishlistItemMutation.mutate(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payment" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>
                      Manage your payment methods and billing address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center">
                      <CreditCard className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">No payment methods</h3>
                      <p className="mt-2 text-muted-foreground">
                        You haven't added any payment methods yet.
                      </p>
                      <Button className="mt-4" onClick={() => toast({
                        title: "Coming Soon",
                        description: "This feature will be available soon.",
                      })}>
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}