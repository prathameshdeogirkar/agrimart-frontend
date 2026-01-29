# AgriMart Frontend

A modern React + Vite + Tailwind CSS frontend for the AgriMart e-commerce platform.

## Features

- 🔐 User Authentication (Login/Register)
- 🛍️ Product Browsing with Categories
- 🛒 Shopping Cart Management
- 💳 Checkout Process
- 📦 Order History
- 🎨 Beautiful, Responsive UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/       # Reusable components (Navbar, ProtectedRoute)
├── context/          # React Context (Auth, Cart)
├── pages/           # Page components (Home, Login, Cart, etc.)
├── services/        # API service functions
├── App.jsx          # Main app component with routing
└── main.jsx         # Entry point
```

## API Configuration

The frontend is configured to connect to the backend at `http://localhost:8080`. 
Make sure your backend server is running before starting the frontend.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- User registration
- User login with JWT tokens
- Protected routes for authenticated users

### Products
- Browse all products
- Filter by category
- Search products
- View product details

### Shopping Cart
- Add products to cart
- View cart items
- Update quantities
- Remove items from cart

### Checkout
- Shipping information form
- Payment method selection
- Order placement

### Orders
- View order history
- Order status tracking
- Order details

## Technologies Used

- React 19
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Context API
