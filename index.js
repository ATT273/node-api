import express from 'express';
const app = express();

const host = 'localhost';
const port = 5000;
app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});