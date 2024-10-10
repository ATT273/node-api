import express from 'express';
import { CONNECT_DB, GET_DB } from './src/config/mongodb.js';
import exitHook from 'async-exit-hook'
import userRouter from './src/routes/users.js';
import authRouter from './src/routes/auth.js';

const START_SERVER = async () => {
  // await CONNECT_DB();
  const app = express();

  const host = 'localhost';
  const port = 5000;

  // middleware
  app.use(express.json());

  app.get('/', async function (req, res) {
    const collection = await GET_DB().listCollections().toArray();
    console.log(collection)
    res.send('Hello World')
  })
  app.use('/api/users', userRouter);
  app.use('/api/auth', authRouter);
  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });

  exitHook((signal) => {
    console.log('Server is shutting down...', signal)
  })
}

CONNECT_DB()
.then(() => console.log('Connected to Mongo database'))
.then(() => START_SERVER())
.catch(error => {
  console.error('Error connecting to Mongo database', error)
  process.exit(0)
});