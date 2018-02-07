//modules
const express = require('express');
const bodyParser = require('body-parser');
const knex = require('./knex/knex.js');
const app = express();
//Constants
const PORT = process.env.PORT || 3000;
//application
app.use(bodyParser.urlencoded({ extended: true }));
//Routes
const users = require(`./routes/users`);
const products = require(`./routes/products`);
const cart = require(`./routes/cart`);

app.use(`/users`, users);
app.use(`/products`, products);
app.use(`/cart`, cart);

app.listen(PORT, (err)=>{
  if(err){throw err}
  console.log(`Server is up on ${PORT}`)
});

