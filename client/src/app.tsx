import { Route, Routes } from 'react-router';
import { ProductsPage } from './pages/products-page';
import { SingleProductPage } from './pages/single-product-page';
import { HomePage } from './pages/home-page';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { MenPage } from './pages/men-page';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/men" element={<MenPage />} />
        <Route
          path="/women"
          element={<ProductsPage key="women" collection="women" />}
        />
        <Route
          path="/unisex"
          element={<ProductsPage key="unisex" collection="unisex" />}
        />
        <Route
          path="/sales"
          element={<ProductsPage key="sales" collection="sales" />}
        />
        <Route
          path="/new"
          element={<ProductsPage key="new" collection="new" />}
        />
        <Route
          path="/catalog"
          element={<ProductsPage key="catalog" collection="catalog" />}
        />
        <Route
          path="/products"
          element={<ProductsPage key="products" collection="catalog" />}
        />
        <Route path="/product/:id" element={<SingleProductPage />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
