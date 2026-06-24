import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import productsRoutes from './routes/products.route';
import { errorHandler } from './middlewares/error-handler';
import connectToDB from './utils/connect-to-database';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

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

app.use(errorHandler);
