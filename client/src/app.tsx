import { Route, Routes } from 'react-router';
import { ProductsPage } from './pages/products-page';
import { SingleProductPage } from './pages/single-product-page';
import { HomePage } from './pages/home-page';

function App() {
  return (
    <>
      <div>header</div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<SingleProductPage />} />
      </Routes>
      <div>footer</div>
    </>
  );
}

export default App;
