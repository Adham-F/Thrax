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