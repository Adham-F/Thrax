import {
  users,
  products,
  cartItems,
  wishlistItems,
  orders,
  orderItems,
  type User,
  type Product,
  type InsertUser,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type WishlistItem,
  type InsertWishlistItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type CartItemWithProduct,
  type WishlistItemWithProduct,
  type OrderItemWithProduct,
} from "@shared/schema";
import session from "express-session";
import { db } from "./db";
import { eq, like, and, desc, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Product methods
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  getPopularProducts(): Promise<Product[]>;
  getSaleProducts(): Promise<Product[]>;

  // Cart methods
  getCartItems(userId: number): Promise<CartItemWithProduct[]>;
  getCartItem(userId: number, productId: number): Promise<CartItem | undefined>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Wishlist methods
  getWishlistItems(userId: number): Promise<WishlistItemWithProduct[]>;
  getWishlistItem(userId: number, productId: number): Promise<WishlistItem | undefined>;
  addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(id: number): Promise<void>;

  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderItems(orderId: number): Promise<OrderItemWithProduct[]>;
  createOrder(order: InsertOrder, orderItems: InsertOrderItem[]): Promise<Order>;

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private wishlistItems: Map<number, WishlistItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  currentUserId: number;
  currentProductId: number;
  currentCartItemId: number;
  currentWishlistItemId: number;
  currentOrderId: number;
  currentOrderItemId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.wishlistItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();

    this.currentUserId = 1;
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.currentWishlistItemId = 1;
    this.currentOrderId = 1;
    this.currentOrderItemId = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours in milliseconds
    });

    // Initialize with sample products data
    this.initializeProducts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const now = new Date();
    const product: Product = { ...insertProduct, id, createdAt: now };
    this.products.set(id, product);
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query) return this.getProducts();

    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter((product) => product.isNew)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 8);
  }

  async getPopularProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter((product) => product.isPopular)
      .slice(0, 8);
  }

  async getSaleProducts(): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter((product) => product.isSale)
      .slice(0, 8);
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );

    return items.map((item) => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async getCartItem(
    userId: number,
    productId: number
  ): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if the item already exists in the cart
    const existingItem = await this.getCartItem(
      insertCartItem.userId,
      insertCartItem.productId
    );

    if (existingItem) {
      // Update quantity if item exists
      return this.updateCartItem(
        existingItem.id,
        existingItem.quantity + insertCartItem.quantity
      );
    }

    // Create new cart item
    const id = this.currentCartItemId++;
    const now = new Date();
    const cartItem: CartItem = { ...insertCartItem, id, createdAt: now };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      throw new Error(`Cart item with ID ${id} not found`);
    }

    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.values())
      .filter((item) => item.userId === userId)
      .map((item) => item.id);

    itemsToDelete.forEach((id) => this.cartItems.delete(id));
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<WishlistItemWithProduct[]> {
    const items = Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId
    );

    return items.map((item) => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async getWishlistItem(
    userId: number,
    productId: number
  ): Promise<WishlistItem | undefined> {
    return Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
  }

  async addToWishlist(insertWishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists in wishlist
    const existingItem = await this.getWishlistItem(
      insertWishlistItem.userId,
      insertWishlistItem.productId
    );

    if (existingItem) {
      return existingItem;
    }

    // Create new wishlist item
    const id = this.currentWishlistItemId++;
    const now = new Date();
    const wishlistItem: WishlistItem = { ...insertWishlistItem, id, createdAt: now };
    this.wishlistItems.set(id, wishlistItem);
    return wishlistItem;
  }

  async removeFromWishlist(id: number): Promise<void> {
    this.wishlistItems.delete(id);
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderItems(orderId: number): Promise<OrderItemWithProduct[]> {
    const items = Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );

    return items.map((item) => {
      const product = this.products.get(item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      return { ...item, product };
    });
  }

  async createOrder(
    insertOrder: InsertOrder,
    insertOrderItems: InsertOrderItem[]
  ): Promise<Order> {
    // Create order
    const id = this.currentOrderId++;
    const now = new Date();
    const order: Order = { ...insertOrder, id, createdAt: now };
    this.orders.set(id, order);

    // Create order items
    for (const item of insertOrderItems) {
      const orderItemId = this.currentOrderItemId++;
      const orderItem: OrderItem = {
        ...item,
        orderId: id,
        id: orderItemId,
        createdAt: now,
      };
      this.orderItems.set(orderItemId, orderItem);
    }

    return order;
  }

  // Initialize product data
  private initializeProducts(): void {
    // Tech products
    const techProducts: InsertProduct[] = [
      {
        name: "Pro Wireless Earbuds",
        description: "Premium Sound Quality with active noise cancellation and long battery life.",
        price: 12999, // $129.99
        imageUrl: "https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "tech",
        subcategory: "audio",
        inStock: true,
        isNew: true,
        isPopular: false,
        isSale: false,
      },
      {
        name: "NextGen Smartwatch",
        description: "Health & Fitness Tracking with heart rate monitor, sleep tracker, and GPS.",
        price: 19999, // $199.99
        imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "tech",
        subcategory: "wearables",
        inStock: true,
        isNew: false,
        isPopular: true,
        isSale: false,
      },
      {
        name: "Ultra Phone Pro Max",
        description: "128GB, Midnight Black with 108MP camera and edge-to-edge display.",
        price: 89999, // $899.99
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "tech",
        subcategory: "smartphones",
        inStock: true,
        isNew: false,
        isPopular: true,
        isSale: false,
      },
      {
        name: "UltraBook Pro X15",
        description: "The ultimate portable powerhouse with 4K display and all-day battery life.",
        price: 149999, // $1,499.99
        imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
        category: "tech",
        subcategory: "computers",
        inStock: true,
        isNew: true,
        isPopular: true,
        isSale: false,
      },
      {
        name: "Echo Smart Speaker",
        description: "Voice-controlled with premium sound quality and smart home features.",
        price: 14999, // $149.99
        imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
        category: "tech",
        subcategory: "speakers",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: false,
      },
      {
        name: "Pro Gaming Controller",
        description: "Precision controls with customizable buttons for maximum gaming performance.",
        price: 7999, // $79.99
        imageUrl: "https://pixabay.com/get/g88ca21d1a75a793a771dd5798b7fe52dd72fa2d20d4013061cdc510046f461393184534ffa02d6eebf45a57daca9e8df32fc808b6fbd16d57b6f1e27ccf1c4f4_1280.jpg",
        category: "tech",
        subcategory: "gaming",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: false,
      },
    ];

    // Fashion products
    const fashionProducts: InsertProduct[] = [
      {
        name: "Oversized Comfort Hoodie",
        description: "Soft Cotton Blend with a relaxed fit for ultimate comfort.",
        price: 5999, // $59.99
        imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "fashion",
        subcategory: "hoodies",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: false,
      },
      {
        name: "Platform Bounce Sneakers",
        description: "All-day Comfort with trendy design and cushioned soles.",
        price: 8999, // $89.99
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "fashion",
        subcategory: "footwear",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: false,
      },
      {
        name: "Urban Explorer Backpack",
        description: "Water-resistant, USB Port with multiple compartments for organization.",
        price: 6999, // $69.99
        imageUrl: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "fashion",
        subcategory: "bags",
        inStock: true,
        isNew: true,
        isPopular: true,
        isSale: false,
      },
      {
        name: "Vintage Denim Jacket",
        description: "Classic style with modern details for a timeless look.",
        price: 7499, // $74.99
        imageUrl: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "fashion",
        subcategory: "outerwear",
        inStock: true,
        isNew: false,
        isPopular: true,
        isSale: true,
        discountPercentage: 20,
      },
      {
        name: "Minimalist Watch",
        description: "Sleek design with Japanese movement and genuine leather strap.",
        price: 11999, // $119.99
        imageUrl: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "fashion",
        subcategory: "accessories",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: false,
      },
      {
        name: "High-Waisted Cargo Pants",
        description: "Trendy and comfortable with multiple pockets and adjustable waist.",
        price: 6499, // $64.99
        imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "fashion",
        subcategory: "bottoms",
        inStock: true,
        isNew: true,
        isPopular: false,
        isSale: true,
        discountPercentage: 15,
      },
    ];

    // Beauty products
    const beautyProducts: InsertProduct[] = [
      {
        name: "Glow Serum Collection",
        description: "Hydrating Formula for all skin types with vitamin C and hyaluronic acid.",
        price: 7999, // $79.99
        imageUrl: "https://pixabay.com/get/g9c8b2ffd2ed5d64821ca1eb839aafaebdcaab0cc1d87f2dabad5db3c5b32bfde83c9726275a6fffbc502ad100e2db4433963d542b102d66233b94eabc7083351_1280.jpg",
        category: "beauty",
        subcategory: "skincare",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: true,
        discountPercentage: 20,
      },
      {
        name: "Midnight Essence Perfume",
        description: "Unisex, Long-lasting fragrance with notes of vanilla, sandalwood, and citrus.",
        price: 11999, // $119.99
        imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "beauty",
        subcategory: "fragrance",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: false,
      },
      {
        name: "Hydrating Face Mask Set",
        description: "Pack of 5 sheet masks for intense hydration and brightening.",
        price: 2999, // $29.99
        imageUrl: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf15?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "beauty",
        subcategory: "skincare",
        inStock: true,
        isNew: true,
        isPopular: true,
        isSale: false,
      },
      {
        name: "Natural Hair Oil Treatment",
        description: "Nourishing formula with argan oil and shea butter for all hair types.",
        price: 3499, // $34.99
        imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "beauty",
        subcategory: "haircare",
        inStock: true,
        isNew: false,
        isPopular: true,
        isSale: true,
        discountPercentage: 10,
      },
    ];

    // Lifestyle products
    const lifestyleProducts: InsertProduct[] = [
      {
        name: "Minimalist Desk Lamp",
        description: "Adjustable LED with multiple brightness settings and wireless charging base.",
        price: 4999, // $49.99
        imageUrl: "https://images.unsplash.com/photo-1534279258630-db3005e84a88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "lifestyle",
        subcategory: "home",
        inStock: true,
        isNew: false,
        isPopular: false,
        isSale: false,
      },
      {
        name: "Wellness Yoga Mat",
        description: "Eco-friendly, non-slip surface with alignment markers and carrying strap.",
        price: 3999, // $39.99
        imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f7d292f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "lifestyle",
        subcategory: "fitness",
        inStock: true,
        isNew: true,
        isPopular: false,
        isSale: false,
      },
      {
        name: "Ceramic Pour-Over Coffee Set",
        description: "Hand-crafted set including dripper, server, and two mugs.",
        price: 5999, // $59.99
        imageUrl: "https://images.unsplash.com/photo-1526170803162-4a8fb87a00a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "lifestyle",
        subcategory: "kitchen",
        inStock: true,
        isNew: false,
        isPopular: true,
        isSale: false,
      },
      {
        name: "Reusable Glass Water Bottle",
        description: "Leak-proof with silicone sleeve and time markers for hydration tracking.",
        price: 2499, // $24.99
        imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
        category: "lifestyle",
        subcategory: "accessories",
        inStock: true,
        isNew: false,
        isPopular: true,
        isSale: true,
        discountPercentage: 15,
      },
    ];

    // Combine all product categories
    const allProducts = [
      ...techProducts,
      ...fashionProducts,
      ...beautyProducts,
      ...lifestyleProducts,
    ];

    // Add products to storage
    for (const product of allProducts) {
      this.createProduct(product);
    }
  }
}

export const storage = new MemStorage();
