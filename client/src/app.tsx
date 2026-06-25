import { Route, Routes } from 'react-router';
import { ProductsPage } from './pages/products-page';
import { SingleProductPage } from './pages/single-product-page';
import { HomePage } from './pages/home-page';
import { Header } from './components/header';
import { Footer } from './components/footer';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/men" element={<ProductsPage />} />
        <Route path="/women" element={<ProductsPage />} />
        <Route path="/sales" element={<ProductsPage />} />
        <Route path="/new" element={<ProductsPage />} />
        <Route path="/catalog" element={<ProductsPage />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
