import { Route, Routes } from 'react-router';

import { LoginPage, RegisterPage } from '../features/auth';
import { CartPage } from '../features/cart';
import { HomePage } from '../features/home';
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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/products/:id" element={<SingleProductPage />} />
    </Routes>
  );
};
