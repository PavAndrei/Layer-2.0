import { Footer } from '../features/footer';
import { AppHeader } from './app-header';
import { AppRoutes } from './app-routes';

function App() {
  return (
    <div className="flex flex-col gap-8">
      <AppHeader />
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
