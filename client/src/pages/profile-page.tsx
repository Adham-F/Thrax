import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { Link, useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatPrice, formatDate } from "@/lib/utils";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Package, 
  Clock, 
  Heart, 
  Settings, 
  LogOut, 
  Edit,
  ShoppingBag,
  Truck, 
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface OrderWithItems {
  order: {
    id: number;
    userId: number;
    total: number;
    subtotal: number;
    tax: number;
    shipping: number;
    shippingAddress: string;
    shippingMethod: string;
    paymentMethod: string;
    status: OrderStatus;
    notes: string;
    createdAt: string;
  };
  items: {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    name: string;
    imageUrl: string;
  }[];
}

export default function ProfilePage() {
  const [match, params] = useRoute("/profile");
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
  });

  // Fetch orders
  const { 
    data: orders = [], 
    isLoading: isLoadingOrders,
    error: ordersError
  } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  // Mock wishlist data (would be fetched from API)
  const { 
    data: wishlistItems = [], 
    isLoading: isLoadingWishlist 
  } = useQuery<any[]>({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  // Handle profile update
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: typeof profileForm) => {
      const res = await apiRequest("PUT", "/api/user", profileData);
      if (!res.ok) {
        throw new Error("Failed to update profile");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      setIsEditProfileOpen(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
  };

  // Helper function to determine order status badge color
  const getOrderStatusBadge = (status: OrderStatus) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Processing</Badge>;
      case "shipped":
        return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20">Shipped</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Helper function to get order status icon
  const getOrderStatusIcon = (status: OrderStatus) => {
    switch(status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "processing":
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-indigo-500" />;
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>My Profile | THRAX</title>
        <meta name="description" content="Manage your profile, orders, and wishlist on THRAX." />
      </Helmet>
      
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1 py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                          {user.fullName ? user.fullName.slice(0, 2).toUpperCase() : user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold">{user.fullName || user.username}</h2>
                      <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
                      
                      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                              Update your personal information
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="fullName">Full Name</Label>
                              <Input
                                id="fullName"
                                name="fullName"
                                value={profileForm.fullName}
                                onChange={handleProfileFormChange}
                                placeholder="Enter your full name"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={profileForm.email}
                                onChange={handleProfileFormChange}
                                placeholder="Enter your email"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                name="phone"
                                value={profileForm.phone}
                                onChange={handleProfileFormChange}
                                placeholder="Enter your phone number"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                name="address"
                                value={profileForm.address}
                                onChange={handleProfileFormChange}
                                placeholder="Enter your address"
                              />
                            </div>
                            
                            <DialogFooter>
                              <Button
                                type="submit"
                                disabled={updateProfileMutation.isPending}
                              >
                                {updateProfileMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                  </>
                                ) : (
                                  "Update Profile"
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-2">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="mr-2 h-5 w-5" />
                    Profile
                  </Button>
                  
                  <Button
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package className="mr-2 h-5 w-5" />
                    Orders
                    {orders.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {orders.length}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button
                    variant={activeTab === "wishlist" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("wishlist")}
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Wishlist
                    {wishlistItems.length > 0 && (
                      <Badge variant="secondary" className="ml-auto">
                        {wishlistItems.length}
                      </Badge>
                    )}
                  </Button>
                  
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Settings
                  </Button>
                  
                  <Separator className="my-4" />
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                  </Button>
                </div>
              </div>
              
              {/* Main Content */}
              <div>
                {activeTab === "profile" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        View and manage your personal details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                          <p>{user.fullName || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Username</h3>
                          <p>{user.username}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                          <p>{user.email || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                          <p>{user.phone || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-3">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Member Since</h4>
                            <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Account Type</h4>
                            <p>{user.isAdmin ? "Administrator" : "Customer"}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" onClick={() => setIsEditProfileOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                {activeTab === "orders" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>My Orders</CardTitle>
                      <CardDescription>
                        View and track your order history
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingOrders ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <Card key={order.order.id} className="overflow-hidden">
                              <CardHeader className="bg-muted/50 py-4">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-medium">Order #{order.order.id}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Placed on {new Date(order.order.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <p className="text-sm font-bold">
                                      {formatPrice(order.order.total)}
                                    </p>
                                    {getOrderStatusBadge(order.order.status)}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4">
                                <div className="space-y-4">
                                  {/* Order Items */}
                                  <div className="space-y-2">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-center space-x-4">
                                        <div className="h-16 w-16 rounded bg-muted overflow-hidden flex-shrink-0">
                                          <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className="font-medium text-sm truncate">{item.name}</p>
                                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-sm font-medium">
                                          {formatPrice(item.price * item.quantity)}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  
                                  {/* Order Tracking (for non-delivered orders) */}
                                  {order.order.status !== "delivered" && order.order.status !== "cancelled" && (
                                    <div className="pt-4">
                                      <h4 className="text-sm font-medium mb-4">Order Status</h4>
                                      <div className="relative">
                                        <div className="absolute top-0 left-6 -ml-px h-full w-0.5 bg-muted-foreground/30"></div>
                                        
                                        <div className="space-y-6">
                                          <div className="relative flex items-start">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted z-10">
                                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                                            </div>
                                            <div className="ml-4 min-w-0">
                                              <p className="text-sm font-medium">Order Placed</p>
                                              <p className="text-xs text-muted-foreground">
                                                {new Date(order.order.createdAt).toLocaleDateString()}
                                              </p>
                                            </div>
                                          </div>
                                          
                                          <div className="relative flex items-start">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full z-10 ${
                                              ["processing", "shipped", "delivered"].includes(order.order.status) 
                                                ? "bg-primary" 
                                                : "bg-muted"
                                            }`}>
                                              <ShoppingBag className={`h-6 w-6 ${
                                                ["processing", "shipped", "delivered"].includes(order.order.status) 
                                                  ? "text-primary-foreground" 
                                                  : "text-muted-foreground"
                                              }`} />
                                            </div>
                                            <div className="ml-4 min-w-0">
                                              <p className={`text-sm font-medium ${
                                                ["processing", "shipped", "delivered"].includes(order.order.status) 
                                                  ? "" 
                                                  : "text-muted-foreground"
                                              }`}>Processing</p>
                                              <p className="text-xs text-muted-foreground">
                                                {["processing", "shipped", "delivered"].includes(order.order.status) 
                                                  ? "Your order is being processed"
                                                  : "Waiting for processing"}
                                              </p>
                                            </div>
                                          </div>
                                          
                                          <div className="relative flex items-start">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full z-10 ${
                                              ["shipped", "delivered"].includes(order.order.status) 
                                                ? "bg-primary" 
                                                : "bg-muted"
                                            }`}>
                                              <Truck className={`h-6 w-6 ${
                                                ["shipped", "delivered"].includes(order.order.status) 
                                                  ? "text-primary-foreground" 
                                                  : "text-muted-foreground"
                                              }`} />
                                            </div>
                                            <div className="ml-4 min-w-0">
                                              <p className={`text-sm font-medium ${
                                                ["shipped", "delivered"].includes(order.order.status) 
                                                  ? "" 
                                                  : "text-muted-foreground"
                                              }`}>Shipped</p>
                                              <p className="text-xs text-muted-foreground">
                                                {["shipped", "delivered"].includes(order.order.status) 
                                                  ? "Your order is on the way"
                                                  : "Waiting to be shipped"}
                                              </p>
                                            </div>
                                          </div>
                                          
                                          <div className="relative flex items-start">
                                            <div className={`flex h-12 w-12 items-center justify-center rounded-full z-10 ${
                                              order.order.status === "delivered" 
                                                ? "bg-primary" 
                                                : "bg-muted"
                                            }`}>
                                              <CheckCircle2 className={`h-6 w-6 ${
                                                order.order.status === "delivered" 
                                                  ? "text-primary-foreground" 
                                                  : "text-muted-foreground"
                                              }`} />
                                            </div>
                                            <div className="ml-4 min-w-0">
                                              <p className={`text-sm font-medium ${
                                                order.order.status === "delivered" 
                                                  ? "" 
                                                  : "text-muted-foreground"
                                              }`}>Delivered</p>
                                              <p className="text-xs text-muted-foreground">
                                                {order.order.status === "delivered" 
                                                  ? "Your order has been delivered"
                                                  : "Waiting to be delivered"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Shipping Address */}
                                  <div className="pt-4">
                                    <h4 className="text-sm font-medium">Shipping Address</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {order.order.shippingAddress}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="bg-muted/30 py-3 px-4 flex justify-between">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                                {order.order.status === "delivered" && (
                                  <Button variant="outline" size="sm">
                                    Buy Again
                                  </Button>
                                )}
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            When you place an order, it will appear here.
                          </p>
                          <Button className="mt-6" asChild>
                            <Link href="/">
                              Start Shopping
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === "wishlist" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>My Wishlist</CardTitle>
                      <CardDescription>
                        Products you've saved for later
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isLoadingWishlist ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : wishlistItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {wishlistItems.map((item) => (
                            <Card key={item.id} className="overflow-hidden">
                              <div className="aspect-square relative overflow-hidden">
                                <img 
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover transition-transform hover:scale-105"
                                />
                                {item.product.isSale && (
                                  <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                                    Sale
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.product.category}
                                </p>
                                <div className="mt-2 flex items-center justify-between">
                                  <div>
                                    {item.product.discountPercentage ? (
                                      <div className="flex items-center">
                                        <p className="text-sm font-bold">
                                          {formatPrice(item.product.price * (1 - item.product.discountPercentage / 100))}
                                        </p>
                                        <p className="text-xs text-muted-foreground line-through ml-2">
                                          {formatPrice(item.product.price)}
                                        </p>
                                      </div>
                                    ) : (
                                      <p className="text-sm font-bold">
                                        {formatPrice(item.product.price)}
                                      </p>
                                    )}
                                  </div>
                                  <Button variant="outline" size="sm">
                                    Add to Cart
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Add items to your wishlist to save them for later.
                          </p>
                          <Button className="mt-6" asChild>
                            <Link href="/">
                              Browse Products
                            </Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {activeTab === "settings" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Email Preferences */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Order Confirmations</p>
                              <p className="text-sm text-muted-foreground">Receive emails for order confirmations</p>
                            </div>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Promotions and Deals</p>
                              <p className="text-sm text-muted-foreground">Receive emails about promotions and deals</p>
                            </div>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Product Updates</p>
                              <p className="text-sm text-muted-foreground">Receive emails about product updates</p>
                            </div>
                            <Select defaultValue="yes">
                              <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="yes">Yes</SelectItem>
                                <SelectItem value="no">No</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Change Password */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Password</h3>
                        <Button variant="outline">
                          Change Password
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      {/* Delete Account */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Delete Account</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                        <Button variant="destructive">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}