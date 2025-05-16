/**
 * Database Storage Implementation
 * 
 * This file implements the storage layer for the THRAX e-commerce platform,
 * connecting to a PostgreSQL database for persistent data storage.
 */

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
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPgSimple(session);

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
  sessionStore: any;
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

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any to bypass type issues with session stores

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });

    // Initialize products in the database if none exist
    this.initializeProductsIfEmpty();
  }
  
  // Function to initialize products if there are none in the database
  private async initializeProductsIfEmpty() {
    const existingProducts = await db.select({ count: sql`count(*)` }).from(products);
    if (Number(existingProducts[0].count) === 0) {
      // Tech products
      const techProducts = [
        {
          name: "Pro Wireless Earbuds",
          description: "Premium Sound Quality with active noise cancellation and long battery life.",
          price: 12999, // $129.99
          imageUrl: "https://images.unsplash.com/photo-1606220838315-056192d5e927?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "tech",
          subcategory: "audio",
          inventory: 100,
          inStock: true,
          isNew: true,
          isPopular: false,
          isSale: false,
          isFeatured: false,
          isOnSale: false,
        },
        {
          name: "NextGen Smartwatch",
          description: "Health & Fitness Tracking with heart rate monitor, sleep tracker, and GPS.",
          price: 19999, // $199.99
          imageUrl: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "tech",
          subcategory: "wearables",
          inventory: 75,
          inStock: true,
          isNew: false,
          isPopular: true,
          isSale: false,
          isFeatured: true,
          isOnSale: false,
        },
        {
          name: "Ultra Phone Pro Max",
          description: "128GB, Midnight Black with 108MP camera and edge-to-edge display.",
          price: 89999, // $899.99
          imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "tech",
          subcategory: "smartphones",
          inventory: 50,
          inStock: true,
          isNew: false,
          isPopular: true,
          isSale: false,
          isFeatured: true,
          isOnSale: false,
        },
        {
          name: "UltraBook Pro X15",
          description: "The ultimate portable powerhouse with 4K display and all-day battery life.",
          price: 149999, // $1,499.99
          imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80",
          category: "tech",
          subcategory: "computers",
          inventory: 35,
          inStock: true,
          isNew: true,
          isPopular: true,
          isSale: false,
          isFeatured: true,
          isOnSale: false,
        }
      ];
      
      // Fashion products
      const fashionProducts = [
        {
          name: "Oversized Comfort Hoodie",
          description: "Soft Cotton Blend with a relaxed fit for ultimate comfort.",
          price: 5999, // $59.99
          imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "fashion",
          subcategory: "hoodies",
          inventory: 120,
          inStock: true,
          isNew: false,
          isPopular: false,
          isSale: false,
          isFeatured: false,
          isOnSale: false,
        },
        {
          name: "Premium Leather Jacket",
          description: "Handcrafted from premium leather with a classic design for timeless style.",
          price: 29999, // $299.99
          imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "fashion",
          subcategory: "outerwear",
          inventory: 45,
          inStock: true,
          isNew: true,
          isPopular: true,
          isSale: false,
          isFeatured: true,
          isOnSale: false,
        }
      ];
      
      // Beauty products
      const beautyProducts = [
        {
          name: "Hydrating Face Serum",
          description: "Advanced formula with hyaluronic acid for deep hydration and rejuvenation.",
          price: 3999, // $39.99
          imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "beauty",
          subcategory: "skincare",
          inventory: 85,
          inStock: true,
          isNew: true,
          isPopular: false,
          isSale: false,
          isFeatured: false,
          isOnSale: false,
        },
        {
          name: "Signature Perfume",
          description: "Elegant fragrance with notes of jasmine, vanilla, and sandalwood.",
          price: 8499, // $84.99
          imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "beauty",
          subcategory: "fragrances",
          inventory: 60,
          inStock: true,
          isNew: false,
          isPopular: true,
          isSale: true,
          isFeatured: true,
          isOnSale: true,
          discountPercentage: 15,
        }
      ];
      
      // Lifestyle products
      const lifestyleProducts = [
        {
          name: "Minimalist Desk Lamp",
          description: "Modern design with adjustable brightness and color temperature.",
          price: 4999, // $49.99
          imageUrl: "https://images.unsplash.com/photo-1573297627366-08a519ad413d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "lifestyle",
          subcategory: "home",
          inventory: 70,
          inStock: true,
          isNew: false,
          isPopular: false,
          isSale: false,
          isFeatured: false,
          isOnSale: false,
        },
        {
          name: "Premium Yoga Mat",
          description: "Non-slip surface, eco-friendly materials, perfect for all types of yoga.",
          price: 7499, // $74.99
          imageUrl: "https://images.unsplash.com/photo-1607346704512-221c6f1d6f22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80",
          category: "lifestyle",
          subcategory: "fitness",
          inventory: 90,
          inStock: true,
          isNew: true,
          isPopular: true,
          isSale: false,
          isFeatured: true,
          isOnSale: false,
        }
      ];
      
      // Insert all products
      const allProducts = [
        ...techProducts,
        ...fashionProducts,
        ...beautyProducts,
        ...lifestyleProducts
      ];
      
      for (const product of allProducts) {
        await db.insert(products).values(product);
      }
      
      console.log('Database initialized with sample products');
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query) return this.getProducts();

    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(products).where(
      sql`lower(${products.name}) like ${lowercaseQuery} OR 
          lower(${products.description}) like ${lowercaseQuery} OR 
          lower(${products.category}) like ${lowercaseQuery} OR 
          lower(${products.subcategory}) like ${lowercaseQuery}`
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isNew, true))
      .orderBy(desc(products.createdAt))
      .limit(8);
  }

  async getPopularProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isPopular, true))
      .limit(8);
  }

  async getSaleProducts(): Promise<Product[]> {
    return await db.select().from(products)
      .where(eq(products.isSale, true))
      .limit(8);
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItemWithProduct[]> {
    const items = await db.select({
      id: cartItems.id,
      userId: cartItems.userId,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      createdAt: cartItems.createdAt,
      product: products
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));

    return items as unknown as CartItemWithProduct[];
  }

  async getCartItem(userId: number, productId: number): Promise<CartItem | undefined> {
    const [item] = await db.select()
      .from(cartItems)
      .where(and(
        eq(cartItems.userId, userId),
        eq(cartItems.productId, productId)
      ));
    
    return item;
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
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
    const [cartItem] = await db.insert(cartItems)
      .values(insertCartItem)
      .returning();
    
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    
    if (!updatedItem) {
      throw new Error(`Cart item with ID ${id} not found`);
    }
    
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<WishlistItemWithProduct[]> {
    const items = await db.select({
      id: wishlistItems.id,
      userId: wishlistItems.userId,
      productId: wishlistItems.productId,
      createdAt: wishlistItems.createdAt,
      product: products
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId));

    return items as unknown as WishlistItemWithProduct[];
  }

  async getWishlistItem(userId: number, productId: number): Promise<WishlistItem | undefined> {
    const [item] = await db.select()
      .from(wishlistItems)
      .where(and(
        eq(wishlistItems.userId, userId),
        eq(wishlistItems.productId, productId)
      ));
    
    return item;
  }

  async addToWishlist(insertWishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists
    const existingItem = await this.getWishlistItem(
      insertWishlistItem.userId,
      insertWishlistItem.productId
    );

    if (existingItem) {
      return existingItem;
    }

    // Create new wishlist item
    const [wishlistItem] = await db.insert(wishlistItems)
      .values(insertWishlistItem)
      .returning();
    
    return wishlistItem;
  }

  async removeFromWishlist(id: number): Promise<void> {
    await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return await db.select()
      .from(orders)
      .where(eq(orders.userId, userId))
      .orderBy(desc(orders.createdAt));
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db.select()
      .from(orders)
      .where(eq(orders.id, id));
    
    return order;
  }

  async getOrderItems(orderId: number): Promise<OrderItemWithProduct[]> {
    const items = await db.select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      priceAtPurchase: orderItems.priceAtPurchase,
      createdAt: orderItems.createdAt,
      product: products
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

    return items as unknown as OrderItemWithProduct[];
  }

  async createOrder(insertOrder: InsertOrder, insertOrderItems: InsertOrderItem[]): Promise<Order> {
    // Create order
    const [order] = await db.insert(orders)
      .values(insertOrder)
      .returning();

    // Create order items
    for (const item of insertOrderItems) {
      await db.insert(orderItems)
        .values({
          ...item,
          orderId: order.id,
        });
    }

    return order;
  }
}

// Initialize database storage
export const storage = new DatabaseStorage();
