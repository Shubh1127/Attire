import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import supabase from './Auth/SupabaseClient';
// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { getCookie } from './utils/cookies';
// Pages
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SignIn from './Auth/SignIn';
import OrdersPage from './pages/OrdersPage';

// Route Guard for Protected Routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means "loading"

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check both cookie token and Supabase session
        const token = getCookie('token');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        // Authenticated if either exists
        setIsAuthenticated(!!(token || session?.user));
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading state while checking
  if (isAuthenticated === null) {
    return <div>Loading authentication status...</div>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
};



function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
          },
          success: {
            style: {
              background: '#047857',
            },
          },
          error: {
            style: {
              background: '#b91c1c',
            },
          },
        }}
      />

      <Header />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/signup" element={<SignIn />} />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;