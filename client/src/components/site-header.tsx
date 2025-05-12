import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, debounce } from "@/lib/utils";
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  LogOut,
  Settings,
  FileText,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

export default function SiteHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleCart, totalItems } = useCart();
  const { user, logoutMutation } = useAuth();
  const [location, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch wishlist count
  const { data: wishlistItems = [] } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: !!user,
  });

  const wishlistCount = wishlistItems.length;

  // Search products query
  const { data: searchResults, isLoading: isSearching } = useQuery<Product[]>({
    queryKey: ["/api/products/search", { q: searchQuery }],
    enabled: !!searchQuery && searchQuery.length > 2,
  });

  // Handle search
  const handleSearchChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, 300);

  // Handle category navigation and close mobile menu
  const handleCategoryClick = (category: string) => {
    navigate(`/category/${category}`);
  };

  // Check if a category is active
  const isCategoryActive = (category: string) => {
    return location === `/category/${category}`;
  };

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-200",
      isScrolled ? "bg-muted/95 backdrop-blur-sm shadow-md" : "bg-muted"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <a className="text-2xl font-bold">
              <span className="text-primary">THRAX</span>
            </a>
          </Link>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center bg-card rounded-full px-4 py-2 w-full max-w-md mx-6 relative">
            <Search className="text-muted-foreground mr-2 h-4 w-4" />
            <Input 
              type="text" 
              placeholder="Search for products, brands, and more..." 
              className="bg-transparent border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground w-full"
              onChange={handleSearchChange}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
            
            {/* Search Results Dropdown */}
            {isSearchOpen && searchQuery.length > 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-lg overflow-hidden z-50 max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                ) : searchResults && searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.slice(0, 5).map((product) => (
                      <Link key={product.id} href={`/product/${product.id}`}>
                        <a className="flex items-center p-2 hover:bg-muted rounded-md transition-colors">
                          <div className="h-10 w-10 rounded bg-muted overflow-hidden mr-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                        </a>
                      </Link>
                    ))}
                    {searchResults.length > 5 && (
                      <Link href={`/category/all?search=${encodeURIComponent(searchQuery)}`}>
                        <a className="block text-center text-sm text-primary py-2 hover:underline">
                          See all {searchResults.length} results
                        </a>
                      </Link>
                    )}
                  </div>
                ) : searchQuery.length > 2 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No products found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Navigation Icons */}
          <div className="flex items-center space-x-1 md:space-x-4">
            {/* Mobile Search Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden relative p-2 text-foreground"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="pt-16">
                <div className="flex items-center bg-card rounded-full px-4 py-2 w-full">
                  <Search className="text-muted-foreground mr-2 h-4 w-4" />
                  <Input 
                    type="text" 
                    placeholder="Search for products..." 
                    className="bg-transparent border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground w-full"
                    onChange={handleSearchChange}
                  />
                </div>
                {searchQuery.length > 2 && (
                  <div className="mt-4">
                    {isSearching ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Searching...
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.slice(0, 5).map((product) => (
                          <Link key={product.id} href={`/product/${product.id}`}>
                            <a className="flex items-center p-2 hover:bg-muted rounded-md transition-colors">
                              <div className="h-10 w-10 rounded bg-muted overflow-hidden mr-3">
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                              </div>
                            </a>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No products found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </SheetContent>
            </Sheet>
            
            {/* User Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative p-2 text-foreground"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.fullName || user.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName || user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <a className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">
                      <a className="flex items-center cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 text-foreground hover:text-primary transition-colors"
                asChild
              >
                <Link href="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
            
            {/* Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              asChild
            >
              <Link href={user ? "/wishlist" : "/auth"}>
                <div>
                  <Heart className="h-5 w-5" />
                  {user && wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
              </Link>
            </Button>
            
            {/* Shopping Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              onClick={toggleCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden relative p-2 text-foreground"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="py-4 space-y-4">
                  <h2 className="text-lg font-bold">Categories</h2>
                  <nav className="space-y-2">
                    <Button
                      variant={location === "/category/all" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryClick("all")}
                    >
                      All Products
                    </Button>
                    <Button
                      variant={isCategoryActive("tech") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryClick("tech")}
                    >
                      Tech
                    </Button>
                    <Button
                      variant={isCategoryActive("fashion") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryClick("fashion")}
                    >
                      Fashion
                    </Button>
                    <Button
                      variant={isCategoryActive("beauty") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryClick("beauty")}
                    >
                      Beauty
                    </Button>
                    <Button
                      variant={isCategoryActive("lifestyle") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleCategoryClick("lifestyle")}
                    >
                      Lifestyle
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Categories Navigation */}
        <nav className="hidden md:block py-3 border-t border-border overflow-x-auto no-scrollbar">
          <ul className="flex space-x-8 whitespace-nowrap">
            <li>
              <Link href="/category/all">
                <a className={cn(
                  "transition-colors",
                  location === "/category/all" ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}>
                  All Products
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/tech">
                <a className={cn(
                  "transition-colors",
                  isCategoryActive("tech") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}>
                  Tech
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/fashion">
                <a className={cn(
                  "transition-colors",
                  isCategoryActive("fashion") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}>
                  Fashion
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/beauty">
                <a className={cn(
                  "transition-colors",
                  isCategoryActive("beauty") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}>
                  Beauty
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/lifestyle">
                <a className={cn(
                  "transition-colors",
                  isCategoryActive("lifestyle") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}>
                  Lifestyle
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/new">
                <a className={cn(
                  "transition-colors",
                  isCategoryActive("new") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}>
                  New Arrivals
                </a>
              </Link>
            </li>
            <li>
              <Link href="/category/sale">
                <a className={cn(
                  "transition-colors",
                  isCategoryActive("sale") ? "text-primary font-medium" : "text-foreground hover:text-primary"
                )}>
                  Sale
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
