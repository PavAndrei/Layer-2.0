import { Route, Routes } from 'react-router';
import { Footer } from '../features/footer';
import { Header } from '../features/header';
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
        <Route path="/products/:id" element={<SingleProductPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
