import { Footer } from '../features/footer';
import { useAuthBootstrap } from '../features/auth';
import { AppHeader } from './app-header';
import { AppRoutes } from './app-routes';

function App() {
  useAuthBootstrap();

  return (
    <div className="flex flex-col gap-8">
      <AppHeader />
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
