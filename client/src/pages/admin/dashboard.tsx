import React from 'react';
import { Helmet } from 'react-helmet';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DollarSign, ShoppingBag, Truck, Users, Layers, ArrowUpRight, BarChart2, ChevronDown } from 'lucide-react';
import { Link } from 'wouter';

// Mock data for dashboard
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 7000 },
];

const productData = [
  { category: 'Tech', sales: 40 },
  { category: 'Fashion', sales: 30 },
  { category: 'Beauty', sales: 20 },
  { category: 'Lifestyle', sales: 10 },
];

const AdminDashboard = () => {
  const { user } = useAuth();

  // Redirect if not admin
  if (!user) {
    return <Redirect to="/auth" />;
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | THRAX</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <main className="flex-1 container max-w-7xl py-10 px-4 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard 
              title="Total Revenue" 
              value="$24,532" 
              change="+12.5%" 
              icon={<DollarSign className="h-5 w-5" />} 
            />
            <StatCard 
              title="Orders" 
              value="432" 
              change="+8.2%" 
              icon={<ShoppingBag className="h-5 w-5" />} 
            />
            <StatCard 
              title="Customers" 
              value="1,245" 
              change="+18.3%" 
              icon={<Users className="h-5 w-5" />} 
            />
            <StatCard 
              title="Products" 
              value="64" 
              change="+4.5%" 
              icon={<Layers className="h-5 w-5" />} 
            />
          </div>

          {/* Charts */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#7000ff" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sales" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Month</CardTitle>
                  <CardDescription>Detailed monthly sales breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#7000ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="products" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Product category performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="category" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#7000ff" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <QuickLinkCard 
              title="Manage Products" 
              description="Add, edit, or remove products"
              icon={<Layers className="h-6 w-6" />}
              link="/admin/products"
            />
            <QuickLinkCard 
              title="Manage Orders" 
              description="View and process customer orders"
              icon={<Truck className="h-6 w-6" />}
              link="/admin/orders"
            />
            <QuickLinkCard 
              title="Help Pages" 
              description="Edit site content and help pages"
              icon={<BarChart2 className="h-6 w-6" />}
              link="/admin/help-pages"
            />
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
};

// Stat card component
const StatCard = ({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) => {
  const isPositive = change.startsWith('+');
  
  return (
    <Card>
      <CardContent className="flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-muted-foreground">{title}</span>
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <div className={`text-sm flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {change}
            {isPositive ? 
              <ArrowUpRight className="h-3 w-3 ml-1" /> : 
              <ChevronDown className="h-3 w-3 ml-1" />
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick link card component
const QuickLinkCard = ({ title, description, icon, link }: { title: string, description: string, icon: React.ReactNode, link: string }) => {
  return (
    <Card className="hover:border-primary transition-colors duration-300">
      <Link href={link}>
        <CardContent className="flex items-center p-6 cursor-pointer">
          <div className="bg-primary/10 p-4 rounded-full mr-4 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default AdminDashboard;