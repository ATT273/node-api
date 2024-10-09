import express from 'express';
import { CONNECT_DB, GET_DB } from '@/config/mongodb.js';


const START_SERVER = async () => {
  // await CONNECT_DB();
  const app = express();

  const host = 'localhost';
  const port = 5000;
  app.get('/', async function (req, res) {
    const collection = await GET_DB().listCollections().toArray();
    console.log(collection)
    res.send('Hello World')
  })

  app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

CONNECT_DB()
.then(() => console.log('Connected to Mongo database'))
.then(() => START_SERVER())
.catch(error => {
  console.error('Error connecting to Mongo database', error)
  process.exit(0)
});