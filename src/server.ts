import * as express from 'express';

const app: any = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
