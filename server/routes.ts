/**
 * Server API Routes Registration
 * 
 * This file handles all API endpoint registrations for the THRAX e-commerce platform.
 * Routes are organized by functionality:
 * - Authentication (login, register, logout)
 * - Products (listing, details, search)
 * - Shopping Cart (add, remove, update)
 * - Wishlist (add, remove)
 * - Orders (create, list, details)
 * - Admin (product management, user management)
 * - Payment (Stripe integration)
 */

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { z } from "zod";
import { 
  insertCartItemSchema, 
  insertWishlistItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertProductSchema
} from "@shared/schema";
import { isAdmin } from "./middleware/admin";
import { createPaymentIntent } from "./stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Admin account registration endpoint
  app.post("/api/register-admin", async (req, res) => {
    try {
      const { username, password, email, fullName } = req.body;
      
      if (!username || !password || !email) {
        return res.status(400).json({ message: "Username, password, and email are required" });
      }

      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(username) || 
                           await storage.getUserByEmail(email);
                           
      if (existingUser) {
        return res.status(400).json({ 
          message: "Username or email already exists" 
        });
      }

      // Create the user with admin privileges
      const user = await storage.createUser({
        username,
        password: await hashPassword(password), // Hash the password
        email,
        fullName
      });
      
      // Update admin status
      if (user) {
        await storage.updateUserAdminStatus(user.id, true);
      }

      res.status(201).json({ 
        message: "Admin account created successfully",
        username,
        email
      });
    } catch (error) {
      console.error("Error creating admin account:", error);
      res.status(500).json({ 
        message: "Failed to create admin account" 
      });
    }
  });
  
  // Admin test route to verify admin access
  app.get("/api/admin/test", isAdmin, (req, res) => {
    res.status(200).json({ 
      message: "Admin access verified",
      user: {
        id: req.user?.id,
        username: req.user?.username,
        email: req.user?.email,
        isAdmin: req.user?.isAdmin
      }
    });
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string || "";
      const products = await storage.searchProducts(query);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const products = await storage.getProductsByCategory(category);
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.get("/api/products/new-arrivals", async (req, res) => {
    try {
      const products = await storage.getNewArrivals();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch new arrivals" });
    }
  });

  app.get("/api/products/popular", async (req, res) => {
    try {
      const products = await storage.getPopularProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular products" });
    }
  });

  app.get("/api/products/sale", async (req, res) => {
    try {
      const products = await storage.getSaleProducts();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sale products" });
    }
  });
  
  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart API - Protected routes
  app.get("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const cartItems = await storage.getCartItems(req.user.id);
      res.status(200).json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const cartItemInput = insertCartItemSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const cartItem = await storage.addToCart(cartItemInput);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const quantity = parseInt(req.body.quantity);
      if (isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const cartItem = await storage.updateCartItem(id, quantity);
      res.status(200).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      await storage.removeFromCart(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      await storage.clearCart(req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Wishlist API - Protected routes
  app.get("/api/wishlist", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const wishlistItems = await storage.getWishlistItems(req.user.id);
      res.status(200).json(wishlistItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist items" });
    }
  });

  app.post("/api/wishlist", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const wishlistItemInput = insertWishlistItemSchema.parse({
        ...req.body,
        userId: req.user.id,
      });

      const wishlistItem = await storage.addToWishlist(wishlistItemInput);
      res.status(201).json(wishlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wishlist item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to wishlist" });
    }
  });

  app.delete("/api/wishlist/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid wishlist item ID" });
      }

      await storage.removeFromWishlist(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from wishlist" });
    }
  });

  // Orders API - Protected routes
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const orders = await storage.getOrders(req.user.id);
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const order = await storage.getOrderById(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Check if the order belongs to the authenticated user
      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access to order" });
      }

      const orderItems = await storage.getOrderItems(id);
      res.status(200).json({ order, items: orderItems });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { orderDetails, orderItems } = req.body;

      // Validate order details
      const orderInput = insertOrderSchema.parse({
        ...orderDetails,
        userId: req.user.id,
      });

      // Validate order items
      const orderItemsInput = orderItems.map((item: any) => 
        insertOrderItemSchema.parse(item)
      );

      // Create order
      const order = await storage.createOrder(orderInput, orderItemsInput);

      // Clear the cart after successful order creation
      await storage.clearCart(req.user.id);

      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/subscribe", async (req, res) => {
    try {
      const email = req.body.email;
      
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        return res.status(400).json({ message: "Valid email is required" });
      }
      
      // In a real application, the email would be stored in a database
      // For this demo, we'll just return a success response
      res.status(200).json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });
  
  // Stripe payment intent creation
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd", metadata = {} } = req.body;
      
      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ message: "Valid amount is required" });
      }
      
      const paymentIntent = await createPaymentIntent(amount, currency, metadata);
      
      res.status(200).json({ 
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        message: "Failed to create payment intent", 
        error: error.message 
      });
    }
  });

  // Admin API Routes - Protected with isAdmin middleware
  app.post("/api/admin/products", isAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Validate product data
      const productData = req.body;
      
      // Verify product exists
      const existingProduct = await storage.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Update the product
      const updatedProduct = await storage.updateProduct(id, productData);
      
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Failed to update product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      // Verify product exists
      const existingProduct = await storage.getProductById(id);
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Delete the product
      await storage.deleteProduct(id);
      
      res.status(200).json({ message: "Product deleted successfully", id });
    } catch (error) {
      console.error("Failed to delete product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      // In a real implementation, we'd fetch all users here
      // For this prototype, we'll just return success
      res.status(200).json({ message: "Users fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/orders", isAdmin, async (req, res) => {
    try {
      // In a real implementation, we'd fetch all orders here
      // For this prototype, we'll just return success
      res.status(200).json({ message: "Orders fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Serve the make-admin page directly
  app.get("/make-admin", (req, res) => {
    res.sendFile("make-admin.html", { root: "./client/public" });
  });

  // Help Pages API
  app.get("/api/help-pages/:page", async (req, res) => {
    try {
      const page = req.params.page;
      // In a real app, fetch from database
      // For now, return mock data
      const contentMap: Record<string, string> = {
        contactUs: "# Contact Us\n\nWe're here to help with any questions or concerns.",
        faqs: "# Frequently Asked Questions\n\nFind answers to common questions about our products and services.",
        shipping: "# Shipping & Returns\n\nLearn about our shipping policies and return process.",
        trackOrder: "# Track Your Order\n\nCheck the status of your order.",
        sizeGuide: "# Size Guide\n\nFind the perfect fit with our size charts."
      };
      
      if (!contentMap[page]) {
        return res.status(404).json({ message: "Page not found" });
      }
      
      res.status(200).json({ content: contentMap[page] });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch help page content" });
    }
  });
  
  // Admin Help Pages API
  app.get("/api/admin/help-pages", isAdmin, async (req, res) => {
    try {
      // In a real app, fetch from database
      // For now, return mock data
      const content = {
        contactUs: "# Contact Us\n\nWe're here to help with any questions or concerns.",
        faqs: "# Frequently Asked Questions\n\nFind answers to common questions about our products and services.",
        shipping: "# Shipping & Returns\n\nLearn about our shipping policies and return process.",
        trackOrder: "# Track Your Order\n\nCheck the status of your order.",
        sizeGuide: "# Size Guide\n\nFind the perfect fit with our size charts."
      };
      
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch help pages" });
    }
  });
  
  app.post("/api/admin/help-pages", isAdmin, async (req, res) => {
    try {
      // In a real app, save to database
      // For now, just return success
      res.status(200).json({ message: "Help pages updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update help pages" });
    }
  });
  
  // Newsletter Subscribers API
  app.get("/api/admin/subscribers", isAdmin, async (req, res) => {
    try {
      // In a real app, fetch from database
      // For now, return mock data
      const subscribers = [
        { id: 1, email: "john@example.com", createdAt: "2023-05-01T00:00:00Z", active: true },
        { id: 2, email: "sarah@example.com", createdAt: "2023-05-15T00:00:00Z", active: true },
        { id: 3, email: "michael@example.com", createdAt: "2023-06-02T00:00:00Z", active: false }
      ];
      
      res.status(200).json(subscribers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscribers" });
    }
  });
  
  app.post("/api/admin/subscribers", isAdmin, async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // In a real app, save to database
      // For now, just return success
      res.status(201).json({ 
        id: Math.floor(Math.random() * 1000), 
        email, 
        createdAt: new Date().toISOString(),
        active: true
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to add subscriber" });
    }
  });
  
  // Newsletter Campaigns API
  app.get("/api/admin/campaigns", isAdmin, async (req, res) => {
    try {
      // In a real app, fetch from database
      // For now, return mock data
      const campaigns = [
        { 
          id: 1, 
          subject: "Summer Collection Launch", 
          content: "Check out our new summer collection...", 
          sentAt: "2023-06-15T00:00:00Z", 
          status: "sent",
          recipients: 245
        },
        { 
          id: 2, 
          subject: "Flash Sale - 48 Hours Only", 
          content: "Don't miss our flash sale with up to 50% off...", 
          sentAt: null, 
          status: "draft",
          recipients: 0
        }
      ];
      
      res.status(200).json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });
  
  app.post("/api/admin/campaigns", isAdmin, async (req, res) => {
    try {
      const { subject, content } = req.body;
      
      if (!subject || !content) {
        return res.status(400).json({ message: "Subject and content are required" });
      }
      
      // In a real app, save to database
      // For now, just return success
      res.status(201).json({ 
        id: Math.floor(Math.random() * 1000), 
        subject,
        content,
        sentAt: null,
        status: "draft",
        recipients: 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  // Special route to make a user admin by email (specific for the owner's account or admin@thrax.com)
  app.post("/api/make-admin", async (req, res) => {
    try {
      const { email } = req.body;
      // Allow both the owner's email and the admin@thrax.com
      const allowedEmails = ["fultonadham@gmail.com", "admin@thrax.com"];
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if the email is in the allowed list
      const isAllowed = allowedEmails.some(e => 
        e.toLowerCase() === email.toLowerCase()
      );
      
      if (!isAllowed) {
        return res.status(403).json({ 
          message: "Unauthorized: Only the owner or admin@thrax.com can be made an admin" 
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ 
          message: "Account not found. Please register first with this email." 
        });
      }
      
      // Update the user's admin status
      await storage.updateUserAdminStatus(user.id, true);
      
      res.status(200).json({ 
        message: `User with email ${email} is now an admin`,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to make user admin" });
    }
  });

  // Create HTTP server
  // Admin content editing API
  app.post("/api/admin/update-content", isAdmin, async (req, res) => {
    try {
      const { id, path: contentPath, content } = req.body;
      
      if (!id || !contentPath || content === undefined) {
        return res.status(400).json({ message: "Missing required fields: id, path, or content" });
      }
      
      // Here you would update the content in the appropriate location
      // For demonstration, we'll just return success
      console.log(`Admin updating content ${id} at path ${contentPath}`);
      
      res.status(200).json({ 
        success: true, 
        message: "Content updated successfully" 
      });
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ 
        message: "Failed to update content",
        error: (error as Error).message
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
