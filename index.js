import express from 'express';
import { CONNECT_DB, GET_DB } from './src/config/mongodb.js';
import exitHook from 'async-exit-hook'
import userRouter from './src/routes/users.js';
import authRouter from './src/routes/auth.js';
import productRouter from './src/routes/product.js';
import roleRouter from './src/routes/role.js';
import cors from 'cors';

const START_SERVER = async () => {
  // await CONNECT_DB();
  const app = express();

  const host = 'localhost';
  const port = 5000;
  app.use(cors({
    origin: 'http://localhost:3000', // Allow only your frontend's origin
  }));

  // middleware
  app.use(express.json());


  app.use('/api/users', userRouter);
  app.use('/api/products', productRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/roles', roleRouter);

  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  exitHook((signal) => {
    console.log('Server is shutting down...')
  })
}

// CONNECT TO DATABASE
CONNECT_DB()
.then(() => console.log('Connected to Mongo database'))
.then(() => START_SERVER())
.catch(error => {
  console.error('Error connecting to Mongo database', error)
  process.exit(0)
});