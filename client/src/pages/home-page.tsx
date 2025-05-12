import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import HeroSection from "@/components/hero-section";
import CategoryHighlights from "@/components/category-highlights";
import TrendingProducts from "@/components/trending-products";
import FeaturedCollection from "@/components/featured-collection";
import Newsletter from "@/components/newsletter";
import CartSidebar from "@/components/cart-sidebar";
import { Helmet } from 'react-helmet';

export default function HomePage() {
  const { data: trendingProducts, isLoading: isTrendingLoading } = useQuery<
    Product[]
  >({
    queryKey: ["/api/products/popular"],
  });

  const { data: newArrivals, isLoading: isNewArrivalsLoading } = useQuery<
    Product[]
  >({
    queryKey: ["/api/products/new-arrivals"],
  });

  const { data: techProducts, isLoading: isTechLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/category/tech"],
  });

  return (
    <>
      <Helmet>
        <title>THRAX - Trendy Products for Gen Z</title>
        <meta name="description" content="Discover the latest in tech, fashion, and lifestyle products curated for the next generation. Shop trendy clothes, tech gadgets, beauty products and more." />
        <meta property="og:title" content="THRAX - Trendy Products for Gen Z" />
        <meta property="og:description" content="Discover the latest in tech, fashion, and lifestyle products curated for the next generation." />
        <meta property="og:type" content="website" />
      </Helmet>
    
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1">
          <HeroSection />
          
          <CategoryHighlights />
          
          {trendingProducts && (
            <TrendingProducts 
              title="Trending Now" 
              products={trendingProducts}
              isLoading={isTrendingLoading}
            />
          )}
          
          {techProducts && (
            <FeaturedCollection 
              title="New Tech Arrivals" 
              products={techProducts?.slice(0, 4) || []}
              isLoading={isTechLoading}
            />
          )}
          
          <Newsletter />
        </main>
        
        <SiteFooter />
        
        <CartSidebar />
      </div>
    </>
  );
}
