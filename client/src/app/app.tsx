import { Route, Routes } from 'react-router';
import { SingleProductPage } from '../features/single-product/single-product-page';
import { HomePage } from '../features/home/home-page';
import { Header } from '../features/header/header';
import { Footer } from '../features/footer/footer';
import { MenPage } from '../features/products-list/men-page';
import { WomenPage } from '../features/products-list/women-page';
import { SalesPage } from '../features/products-list/sales-page';
import { CatalogPage } from '../features/products-list/catalog-page';
import { UnisexPage } from '../features/products-list/unisex-page';
import { NewPage } from '../features/products-list/new-page';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/unisex" element={<UnisexPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/products" element={<CatalogPage />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
