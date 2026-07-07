import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route';
import cartRoutes from './routes/cart.route';
import checkoutRoutes from './routes/checkout.route';
import favoritesRoutes from './routes/favorites.route';
import ordersRoutes from './routes/orders.route';
import productsRoutes from './routes/products.route';
import { errorHandler } from './middlewares/error-handler';
import connectToDB from './utils/connect-to-database';
import { CLIENT_ORIGIN, PORT } from './constants/env';

dotenv.config();

export const app = express();

app.use(
  cors({
    credentials: true,
    origin: CLIENT_ORIGIN,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  await connectToDB();
});

app.get('/', (_, res) => {
  res.json({
    success: true,
    message: 'API is working',
    data: null,
  });
});

app.use('/products', productsRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/favorites', favoritesRoutes);
app.use('/orders', ordersRoutes);

app.use(errorHandler);
