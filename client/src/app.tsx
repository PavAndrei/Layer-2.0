import { Route, Routes } from 'react-router';
import { SingleProductPage } from './pages/single-product-page';
import { HomePage } from './pages/home-page';
import { Header } from './components/header';
import { Footer } from './components/footer';
import { MenPage } from './pages/men-page';
import { WomenPage } from './pages/women-page';
import { SalesPage } from './pages/sales-page';
import { CatalogPage } from './pages/catalog-page';
import { UnisexPage } from './pages/unisex-page';
import { NewPage } from './pages/new-page';

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
