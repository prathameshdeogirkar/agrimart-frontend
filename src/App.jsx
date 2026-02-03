import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Blog from './pages/Blog';
import Feedback from './pages/Feedback';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import AdminProducts from './pages/AdminProducts';
import ProductEditPage from './pages/ProductEditPage';
import Profile from './pages/Profile';
import AdminOrders from './pages/AdminOrders';
import OAuth2Callback from './components/OAuth2Callback';
import ChatWidget from './components/ChatWidget';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  color: '#0f172a',
                  padding: '16px 24px',
                  borderRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '14px',
                  fontWeight: '800',
                  letterSpacing: '0.02em',
                  boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
                  maxWidth: '450px',
                  textTransform: 'uppercase'
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                  style: {
                    borderBottom: '4px solid #10b981',
                  }
                },
                error: {
                  iconTheme: {
                    primary: '#f43f5e',
                    secondary: '#fff',
                  },
                  style: {
                    borderBottom: '4px solid #f43f5e',
                  }
                },
              }}
            />
            <Navbar />
            <div className="pt-0">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:blogId" element={<Blog />} />
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/sign" element={<Register />} />
                <Route path="/oauth/callback" element={<OAuth2Callback />} />

                {/* User Routes (Authenticated) */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes (ADMIN Role Only) */}
                <Route
                  path="/admin/products"
                  element={<AdminProducts />}
                />
                <Route
                  path="/admin/orders"
                  element={
                    <RoleBasedRoute requiredRole="ADMIN">
                      <AdminOrders />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/admin/products/create"
                  element={<ProductEditPage />}
                />
                <Route
                  path="/admin/products/:productId/edit"
                  element={<ProductEditPage />}
                />

                {/* Category routes */}
                <Route path="/services/essentials" element={<Services />} />
                <Route path="/services/dairy" element={<Services />} />
                <Route path="/services/fruits" element={<Services />} />
                <Route path="/services/exotics" element={<Services />} />
                <Route path="/services/vegetables" element={<Services />} />

                {/* Legacy routes for backward compatibility */}
                <Route path="/Essentials" element={<Services />} />
                <Route path="/Dairy" element={<Services />} />
                <Route path="/Fruits" element={<Services />} />
                <Route path="/Exotics" element={<Services />} />
                <Route path="/Vegetables" element={<Services />} />
                <Route path="/exotics" element={<Services />} />
                <Route path="/vegetables" element={<Services />} />
                <Route path="/fruits" element={<Services />} />
                <Route path="/essentials" element={<Services />} />
                <Route path="/dairy" element={<Services />} />
              </Routes>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
      <ChatWidget />
    </Router >
  );
}

export default App;
