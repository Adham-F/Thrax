import { ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Receipt, 
  Tag, 
  Settings, 
  ChevronDown, 
  BarChart3, 
  LogOut, 
  Home, 
  ShoppingCart,
  Search,
  Bell
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  
  if (!user || !user.isAdmin) {
    navigate("/");
    return null;
  }
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];
  
  const isActive = (href: string) => {
    if (href === "/admin/dashboard" && location === "/admin") {
      return true;
    }
    return location === href;
  };
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | THRAX</title>
      </Helmet>
      
      <div className="flex min-h-screen bg-muted/30">
        {/* Sidebar */}
        <aside className="hidden lg:flex fixed inset-y-0 z-30 flex-col w-64 bg-card border-r">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">THRAX</span>
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
            </Link>
          </div>
          
          <div className="flex-1 overflow-auto py-4 px-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.href) ? "bg-primary text-primary-foreground" : ""
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.title}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(user.fullName || user.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium line-clamp-1">{user.fullName || user.username}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    <Home className="mr-2 h-4 w-4" />
                    Return to Shop
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>
        
        {/* Mobile header */}
        <div className="lg:hidden fixed inset-x-0 top-0 z-30 bg-card h-16 border-b flex items-center px-4">
          <div className="flex-1 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-primary">THRAX</span>
              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Admin</span>
            </Link>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.fullName || user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                  {navItems.map((item) => (
                    <DropdownMenuItem key={item.href} onClick={() => navigate(item.href)}>
                      <span className="mr-2">{item.icon}</span>
                      {item.title}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/")}>
                    <Home className="mr-2 h-4 w-4" />
                    Return to Shop
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          <main className="lg:p-8 p-4 max-w-7xl mx-auto mt-16 lg:mt-0">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}