import AdminLayout from "@/components/admin/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Package,
  ShoppingCart,
  Users,
  CircleDollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function AdminDashboard() {
  // Sample data for demonstration purposes - will be replaced with API data
  const salesData = [
    { name: "Jan", total: 1500 },
    { name: "Feb", total: 2300 },
    { name: "Mar", total: 3200 },
    { name: "Apr", total: 2800 },
    { name: "May", total: 3700 },
    { name: "Jun", total: 4100 },
    { name: "Jul", total: 3800 },
  ];

  const categoryData = [
    { name: "Tech", value: 42 },
    { name: "Fashion", value: 28 },
    { name: "Beauty", value: 18 },
    { name: "Lifestyle", value: 12 },
  ];

  const weeklyData = [
    { name: "Mon", orders: 15, revenue: 1200 },
    { name: "Tue", orders: 22, revenue: 1800 },
    { name: "Wed", orders: 25, revenue: 2100 },
    { name: "Thu", orders: 18, revenue: 1450 },
    { name: "Fri", orders: 32, revenue: 2600 },
    { name: "Sat", orders: 35, revenue: 2800 },
    { name: "Sun", orders: 28, revenue: 2300 },
  ];

  const colors = ["#7000FF", "#8D33FF", "#AA66FF", "#C799FF"];

  const stats = [
    {
      title: "Total Products",
      value: "152",
      change: "+12.5%",
      trend: "up",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Total Orders",
      value: "847",
      change: "+18.2%",
      trend: "up",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Total Customers",
      value: "1,284",
      change: "+32.1%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Total Revenue",
      value: "$48,285",
      change: "-4.5%",
      trend: "down",
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="bg-primary/10 rounded-full p-2">
                  {stat.icon}
                </div>
                <span className={`flex items-center text-sm ${
                  stat.trend === "up" 
                    ? "text-green-500" 
                    : "text-red-500"
                }`}>
                  {stat.change}
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 ml-1" />
                  )}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="total"
                      fill="#7000FF"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#7000FF"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00BFFF"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pt-4 text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Advanced analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pt-4 text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-12 w-12 opacity-50" />
                <p className="mt-2">Reports functionality coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}