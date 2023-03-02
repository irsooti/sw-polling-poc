import express from 'express';

const app = express();

app.use(express.static('src/public'));

app.get('/api', (req, res) => {
  const date = new Date();

  console.log(date.toLocaleTimeString());

  res.send(date.toLocaleTimeString());
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
