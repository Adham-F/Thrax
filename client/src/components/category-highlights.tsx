import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface CategoryProps {
  className?: string;
}

export default function CategoryHighlights({ className }: CategoryProps) {
  const categories = [
    {
      name: "All Products",
      description: "Complete collection",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      link: "/category/all"
    },
    {
      name: "Tech",
      description: "Latest gadgets",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      link: "/category/tech"
    },
    {
      name: "Clothes",
      description: "Trendy styles",
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      link: "/category/clothes"
    },
    {
      name: "Beauty",
      description: "Self care",
      image: "https://pixabay.com/get/g353c9a515e2244c61dbfbe18ef7dd29e4ecd87cb797f35f7ca214a08ac8d1c846822bd984a81fed05aa70eeb707d55489a39cca3536f0461d2a1e543ad6366e0_1280.jpg",
      link: "/category/beauty"
    },
    {
      name: "Lifestyle",
      description: "Elevate living",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      link: "/category/lifestyle"
    },
    {
      name: "Shoes",
      description: "Footwear collection",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      link: "/category/shoes"
    },
    {
      name: "New Arrivals",
      description: "Just dropped",
      image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      link: "/category/new"
    },
    {
      name: "Sale",
      description: "Special discounts",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
      link: "/category/sale"
    }
  ];

  return (
    <section className={cn("py-12 px-4 bg-background", className)}>
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Shop by Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 flex-wrap">
          {categories.slice(0, 8).map((category, index) => (
            <Link 
              key={index} 
              href={category.link}
              className="group relative overflow-hidden rounded-xl aspect-square"
            >
              <img 
                src={category.image}
                alt={`${category.name} category`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
