import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import HeroSection from "@/components/hero-section";
import CategoryHighlights from "@/components/category-highlights";
import TrendingProducts from "@/components/trending-products";
import FeaturedCollection from "@/components/featured-collection";
import KeepShoppingSection from "@/components/keep-shopping-section";
import RecommendationsSection from "@/components/recommendations-section";
import BuyAgainSection from "@/components/buy-again-section";
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
        <title>THRAX </title>
        <meta name="description" content="The latest tech, fashion, and lifestyle products curated in one place; shop in luxury!" />
        <meta property="og:title" content="THRAX" />
        <meta property="og:description" content="The latest tech, fashion, and lifestyle products curated in one place; shop in luxury" />
        <meta property="og:type" content="website" />
      </Helmet>
    
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1">
          <HeroSection />
          
          {/* User-specific sections */}
          <KeepShoppingSection />
          <RecommendationsSection />
          <BuyAgainSection />
          
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
