import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLocation, Link } from "wouter";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ShoppingBag,
  Users,
  Package,
  BarChart,
  Settings,
  PlusCircle,
  Edit,
  Trash
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const [_, navigate] = useLocation();

  // Redirect if user is not admin
  if (user && !user.isAdmin) {
    navigate("/");
    return null;
  }

  // Redirect if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | THRAX</title>
        <meta name="description" content="Manage your THRAX e-commerce store." />
        <meta property="og:title" content="Admin Dashboard | THRAX" />
        <meta property="og:description" content="Manage your THRAX e-commerce store." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1 py-8 px-4 bg-background">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Logged in as:</span>
                <span className="text-sm font-medium">{user?.username}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Sidebar */}
              <div className="md:col-span-3">
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-1">
                      <TabsList className="flex flex-col w-full h-auto bg-transparent gap-1">
                        <TabsTrigger
                          value="overview"
                          onClick={() => setActiveTab("overview")}
                          className={`justify-start px-3 py-2 h-9 w-full ${
                            activeTab === "overview" ? "bg-muted" : ""
                          }`}
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          Overview
                        </TabsTrigger>
                        <TabsTrigger
                          value="products"
                          onClick={() => setActiveTab("products")}
                          className={`justify-start px-3 py-2 h-9 w-full ${
                            activeTab === "products" ? "bg-muted" : ""
                          }`}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Products
                        </TabsTrigger>
                        <TabsTrigger
                          value="orders"
                          onClick={() => setActiveTab("orders")}
                          className={`justify-start px-3 py-2 h-9 w-full ${
                            activeTab === "orders" ? "bg-muted" : ""
                          }`}
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Orders
                        </TabsTrigger>
                        <TabsTrigger
                          value="users"
                          onClick={() => setActiveTab("users")}
                          className={`justify-start px-3 py-2 h-9 w-full ${
                            activeTab === "users" ? "bg-muted" : ""
                          }`}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Users
                        </TabsTrigger>
                        <TabsTrigger
                          value="settings"
                          onClick={() => setActiveTab("settings")}
                          className={`justify-start px-3 py-2 h-9 w-full ${
                            activeTab === "settings" ? "bg-muted" : ""
                          }`}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </TabsTrigger>
                      </TabsList>
                    </nav>
                  </CardContent>
                </Card>
              </div>
              
              {/* Main Content */}
              <div className="md:col-span-9">
                <Tabs value={activeTab} className="w-full">
                  <TabsContent value="overview" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dashboard Overview</CardTitle>
                        <CardDescription>
                          Get a quick snapshot of your store's performance.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-6 flex flex-col items-center justify-center">
                              <Package className="h-8 w-8 text-primary mb-2" />
                              <p className="text-3xl font-bold">24</p>
                              <p className="text-sm text-muted-foreground">Products</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-6 flex flex-col items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-primary mb-2" />
                              <p className="text-3xl font-bold">12</p>
                              <p className="text-sm text-muted-foreground">Orders</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-6 flex flex-col items-center justify-center">
                              <Users className="h-8 w-8 text-primary mb-2" />
                              <p className="text-3xl font-bold">5</p>
                              <p className="text-sm text-muted-foreground">Users</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="products" className="mt-0">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Products</CardTitle>
                          <CardDescription>
                            Manage your products inventory.
                          </CardDescription>
                        </div>
                        <Button className="flex items-center gap-1">
                          <PlusCircle className="h-4 w-4" />
                          Add Product
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                              <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">1</td>
                                  <td className="p-4 align-middle">Pro Wireless Earbuds</td>
                                  <td className="p-4 align-middle">Tech</td>
                                  <td className="p-4 align-middle">$129.99</td>
                                  <td className="p-4 align-middle">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900">
                                      In Stock
                                    </span>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">2</td>
                                  <td className="p-4 align-middle">Ultra HD Smart Watch</td>
                                  <td className="p-4 align-middle">Tech</td>
                                  <td className="p-4 align-middle">$249.99</td>
                                  <td className="p-4 align-middle">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900">
                                      In Stock
                                    </span>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Orders</CardTitle>
                        <CardDescription>
                          View and manage customer orders.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                              <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">#1001</td>
                                  <td className="p-4 align-middle">John Doe</td>
                                  <td className="p-4 align-middle">May 10, 2023</td>
                                  <td className="p-4 align-middle">$379.98</td>
                                  <td className="p-4 align-middle">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900">
                                      Shipped
                                    </span>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Button variant="outline" size="sm">
                                      View
                                    </Button>
                                  </td>
                                </tr>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">#1002</td>
                                  <td className="p-4 align-middle">Jane Smith</td>
                                  <td className="p-4 align-middle">May 9, 2023</td>
                                  <td className="p-4 align-middle">$129.99</td>
                                  <td className="p-4 align-middle">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900">
                                      Delivered
                                    </span>
                                  </td>
                                  <td className="p-4 align-middle">
                                    <Button variant="outline" size="sm">
                                      View
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="users" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>
                          Manage user accounts and permissions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                              <thead>
                                <tr className="border-b bg-muted/50 transition-colors">
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Username</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">1</td>
                                  <td className="p-4 align-middle">admin</td>
                                  <td className="p-4 align-middle">admin@thrax.com</td>
                                  <td className="p-4 align-middle">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-200 dark:text-purple-900">
                                      Admin
                                    </span>
                                  </td>
                                  <td className="p-4 align-middle">Jan 1, 2023</td>
                                  <td className="p-4 align-middle">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                  </td>
                                </tr>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                  <td className="p-4 align-middle">2</td>
                                  <td className="p-4 align-middle">user1</td>
                                  <td className="p-4 align-middle">user1@example.com</td>
                                  <td className="p-4 align-middle">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900">
                                      User
                                    </span>
                                  </td>
                                  <td className="p-4 align-middle">Feb 15, 2023</td>
                                  <td className="p-4 align-middle">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Store Settings</CardTitle>
                        <CardDescription>
                          Configure your store settings.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-medium">General Settings</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Configure general store settings.
                            </p>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Store Name</label>
                                  <input
                                    type="text"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value="THRAX"
                                    readOnly
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">Contact Email</label>
                                  <input
                                    type="email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value="contact@thrax.com"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <Button>Save Changes</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}