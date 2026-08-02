import { Route, Routes } from 'react-router';

import { AdminRoute } from '../features/admin';
import { AdminBlogPostCreatePage } from '../pages/admin-blog-post-create';
import { AdminBlogPostEditPage } from '../pages/admin-blog-post-edit';
import { AdminPage } from '../pages/admin';
import { AdminProductCreatePage } from '../pages/admin-product-create';
import { AdminProductEditPage } from '../pages/admin-product-edit';
import { AdminOrderPage } from '../pages/admin-orders';
import { AdminUserPage } from '../pages/admin-users';
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from '../pages/auth';
import { GuestRoute, ProtectedRoute } from '../features/auth';
import { CartPage } from '../pages/cart';
import { CheckoutPage } from '../pages/checkout';
import { FavoritesPage } from '../pages/favorites';
import { HomePage } from '../pages/home';
import { OrderPage } from '../pages/orders';
import { ProfilePage } from '../pages/profile';
import {
  CatalogPage,
  MenPage,
  NewPage,
  SalesPage,
  UnisexPage,
  WomenPage,
} from '../pages/products-list';
import { SingleProductPage } from '../pages/single-product';

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
        path="/admin/blog-posts/new"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminBlogPostCreatePage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blog-posts/:blogPostId/edit"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminBlogPostEditPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminProductCreatePage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:productId/edit"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminProductEditPage />
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
