import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn("relative", className)}>
      {/* Hero background with overlay */}
      <div className="h-[500px] md:h-[600px] bg-dark-lighter relative overflow-hidden">
        <img 
          src="https://pixabay.com/get/gc2fbc048b38d8f41730850ccaa81e7a30a95e6b43d9d9cd0d583d75454fa9d9a47adee9a12bb7c217a08d6e7b09e3284_1280.jpg" 
          alt="Trendy fashion model in stylish outfit" 
          className="w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent opacity-80"></div>
        
        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 animate-fade-in">
          <div className="container mx-auto">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                The Future of <span className="text-secondary">Trend</span> Is Here
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Discover the latest in tech, fashion, and lifestyle products curated for the next generation.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-full transition-all hover:-translate-y-1"
                  asChild
                >
                  <Link href="/category/tech">Shop Now</Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent hover:bg-muted text-white font-medium px-8 py-3 rounded-full transition-all hover:-translate-y-1 border border-muted"
                  asChild
                >
                  <Link href="/category/fashion">New Arrivals</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
