//import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

const app = express(); // This initializes the Express application

app.use(express.json())
app.use(express.urlencoded({extended: false}))
// Define a route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//Routes file

import routes from "./routes/index.js"

app.use(routes);

// To Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
