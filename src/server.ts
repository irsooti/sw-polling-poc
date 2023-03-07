import express from 'express';

const app = express();

app.use(express.static('src/public'));

app.get('/api', (req, res) => {
  const date = new Date();
  console.log(date.toLocaleTimeString());

  res.send(date.toLocaleTimeString());
});

app.get('/lazy-api', (req, res) => {
  const date = new Date();

  const randomNumberBetween3And6seconds =
    Math.floor(Math.random() * 2000) + 5000;

  console.log(randomNumberBetween3And6seconds);

  setTimeout(() => {
    console.log(date.toLocaleTimeString());

    res.send(date.toLocaleTimeString());
  }, randomNumberBetween3And6seconds);
});

app.listen(process.env.PORT || 80, () => {
  console.log(`Server is running on port ${process.env.PORT || 80}`);
});
