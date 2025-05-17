# THRAX - Modern E-commerce Platform

THRAX is a full-stack e-commerce application targeting youth (ages 13-25) with a modern, engaging shopping experience built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Features

- **Modern UI Design**: Dark theme with interactive animations tailored for younger audiences
- **Full E-commerce Functionality**: Product browsing, cart management, wishlist, checkout
- **Stripe Payment Integration**: Secure payment processing
- **Admin Dashboard**: Complete product and order management
- **User Profiles**: Order history, tracking, and account management
- **Mobile Responsive**: Progressive Web App (PWA) capabilities
- **Authentication System**: Secure user account management
- **Loyalty Program**: Points-based rewards system

## 📝 GitHub Editing Guide

This guide will help you easily identify which files to edit when making changes to the THRAX platform.

### Key Files for Common Changes

#### Website Appearance
- **Site Colors/Theme**: `tailwind.config.ts` and `client/src/index.css`
- **Header/Navigation**: `client/src/components/site-header.tsx`
- **Footer**: `client/src/components/site-footer.tsx`
- **Homepage Layout**: `client/src/pages/home-page.tsx`
- **Product Card Design**: `client/src/components/product-card.tsx`

#### Product Management
- **Product Data Schema**: `shared/schema.ts` (look for `products` table)
- **Category Definitions**: `shared/schema.ts` (look for `CATEGORIES` constant)
- **Product API Endpoints**: `server/routes.ts` (search for "/api/products")
- **Product Database Operations**: `server/storage.ts` (methods with "Product" in name)

#### User Management
- **User Data Schema**: `shared/schema.ts` (look for `users` table)
- **Authentication Logic**: `server/auth.ts`
- **User API Endpoints**: `server/routes.ts` (search for "/api/user")
- **User Database Operations**: `server/storage.ts` (methods with "User" in name)

#### Shopping Experience
- **Cart Logic**: `client/src/contexts/cart-context.tsx`
- **Cart Sidebar**: `client/src/components/cart-sidebar.tsx`
- **Checkout Process**: `client/src/pages/checkout-page.tsx`
- **Payment Integration**: `server/stripe.ts`

#### Admin Features
- **Admin Dashboard**: `client/src/pages/admin/dashboard.tsx`
- **Product Management**: `client/src/pages/admin/products.tsx`
- **Content Management**: `client/src/pages/admin/help-pages.tsx`
- **Newsletter Management**: `client/src/pages/admin/newsletters.tsx`

### Adding New Features

#### Adding a New Page
1. Create a new file in `client/src/pages/` (e.g., `new-feature-page.tsx`)
2. Add the route in `client/src/App.tsx` in the Router component:
   ```tsx
   <Route path="/new-feature" component={NewFeaturePage} />
   ```
3. Add navigation links in the header or footer

#### Adding a New API Endpoint
1. Add the endpoint to `server/routes.ts`:
   ```typescript
   app.get("/api/new-feature", async (req, res) => {
     // Your endpoint logic here
     res.json({ success: true, data: result });
   });
   ```
2. Add corresponding storage methods in `server/storage.ts` if needed

#### Adding a New Product Category
1. Update the CATEGORIES array in `shared/schema.ts`:
   ```typescript
   export const CATEGORIES = ["tech", "fashion", "beauty", "lifestyle", "your-new-category"] as const;
   ```
2. Add products with the new category
3. Update category filters in `client/src/pages/category-page.tsx`

### Common Customization Tasks

#### Modifying the Theme/Brand Colors
1. Edit the theme colors in `tailwind.config.ts`:
   ```typescript
   // Change primary and other brand colors
   colors: {
     primary: {
       DEFAULT: "#7000ff",
       foreground: "#ffffff",
       // ...other shades
     },
     // ...other color definitions
   }
   ```
2. Update global CSS variables in `client/src/index.css` if needed for specific components

#### Adding New Products
1. Use the Admin Dashboard at `/admin/products` to add products through the UI
2. Or, add products directly to the database using `server/storage.ts`:
   ```typescript
   await storage.createProduct({
     name: "New Product",
     description: "Product description",
     price: 9999, // in cents (99.99)
     imageUrl: "/images/products/new-product.jpg",
     category: "tech", // must be a valid category
     isNew: true,
     // ...other product properties
   });
   ```

#### Modifying Help/Legal Pages
1. The content for help pages is in `client/src/pages/help/`
2. Legal pages are in `client/src/pages/legal/`
3. Each page is a separate file that you can edit directly

#### Customizing Email Templates
1. Email templates are located in `server/templates/`
2. Each email type has its own template file (order confirmation, password reset, etc.)

## 🔧 Development Best Practices

### Code Organization
- Keep components small and focused on a single responsibility
- Use the existing folder structure to organize your code
- Shared types and interfaces should be defined in `shared/schema.ts`

### Testing Changes
1. Make your changes locally
2. Test thoroughly in development mode
3. Ensure mobile responsiveness
4. Check for TypeScript errors
5. Verify database operations work correctly

### Version Control
1. Create meaningful commit messages describing your changes
2. Group related changes into single commits
3. Test before pushing to the main branch

### Database Migrations
1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes to the database
3. Never directly modify the database structure manually

## 💻 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **State Management**: React Query, Context API
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js
- **Payment Processing**: Stripe
- **Charts & Visualizations**: Recharts

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/thrax-ecommerce.git
   cd thrax-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   # Database
   DATABASE_URL=postgresql://...
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   
   # Session
   SESSION_SECRET=your-secret-key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 PWA Support

THRAX includes Progressive Web App capabilities, allowing users to install it on their mobile devices and use it offline.

## 🔐 Admin Access

The admin dashboard is available at `/admin` and provides:
- Product management (add, edit, delete)
- Order management and analytics
- Customer management
- Sales analytics

## 📊 Project Structure

```
/
├── client/              # Frontend React application
│   ├── public/          # Static assets
│   └── src/             # React source files
│       ├── components/  # UI components
│       ├── contexts/    # React context providers
│       ├── hooks/       # Custom React hooks
│       ├── lib/         # Utility functions
│       └── pages/       # Page components
├── server/              # Backend Express application
│   ├── middleware/      # Express middleware
│   └── routes/          # API routes
└── shared/              # Shared code between frontend and backend
    └── schema.ts        # Database schema
```

## 📝 License

MIT

## 🙏 Acknowledgments

- [Replit](https://replit.com) - Development platform
- [Shadcn UI](https://ui.shadcn.com/) - UI component library
- [React](https://reactjs.org/) - Frontend library
- [Express](https://expressjs.com/) - Backend framework
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Stripe](https://stripe.com/) - Payment processing