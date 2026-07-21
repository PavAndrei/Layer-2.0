import { Route, Routes } from 'react-router';

import { AdminPage, AdminRoute } from '../features/admin';
import { AdminOrderPage } from '../features/admin-orders';
import { AdminUserPage } from '../features/admin-users';
import {
  ForgotPasswordPage,
  GuestRoute,
  LoginPage,
  ProtectedRoute,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '../features/auth';
import { CartPage } from '../features/cart';
import { CheckoutPage } from '../features/checkout';
import { FavoritesPage } from '../features/favorites';
import { HomePage } from '../features/home';
import { OrderPage } from '../features/orders';
import { ProfilePage } from '../features/profile';
import {
  CatalogPage,
  MenPage,
  NewPage,
  SalesPage,
  UnisexPage,
  WomenPage,
} from '../features/products-list';
import { SingleProductPage } from '../features/single-product';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/men" element={<MenPage />} />
      <Route path="/women" element={<WomenPage />} />
      <Route path="/unisex" element={<UnisexPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/new" element={<NewPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPasswordPage />
          </GuestRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
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
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:orderId"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminOrderPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:userId"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminUserPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        }
      />
      <Route path="/products/:identifier" element={<SingleProductPage />} />
    </Routes>
  );
};
