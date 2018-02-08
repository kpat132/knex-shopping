const express = require('express');
const router = express.Router();
const knex = require('../knex/knex.js');

router.get(`/:user`, (req, res) => {
  let userId = req.params.user;

  return knex.raw(`SELECT products.* FROM cart INNER JOIN products ON 
  cart.products_id = products.id WHERE cart.users_id = ?`, [userId])
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      res.status(404).json('ERROR FINDING USER');
    })

})
router.post(`/:user/:product`, (req, res) => {
  let userId = req.params.user;
  let productId = req.params.product;

  return knex.raw('SELECT * FROM users WHERE id = ?', [userId])
    .then(result => {
      //console.log(result.rows[0]);
      if (result.rows.length) {
        return knex.raw('SELECT * FROM products WHERE id = ?', [productId])
      } else {
        throw new Error(`User does not exist`);
      }
    })
    .then(result => {
      //console.log(result.rows[0]);
      if (result.rows.length) {
        return knex.raw(`INSERT INTO cart(users_id, products_id) values(?,?) RETURNING *`, [userId, productId]);
      }
      else {
        throw new Error(`User does not exist`);
      }
    })
    .then(result => {
      console.log(result.rows);
      res.json(result.rows);
    })
    .catch(err => {
      res.status(404).json('Error between user and product');
    })

})

router.delete(`/:user/:product`,(req, res) => {
  let userId = req.params.user;
  let productId = req.params.product;

  return knex.raw('SELECT * FROM cart WHERE users_id = ? AND products_id = ?', [userId, productId])
  .then(result =>{
   
    return knex.raw('DELETE FROM cart WHERE id = ?', [result.rows[0].id])
  })
  .then(result => {
    res.json( { "success": true });
  })
  .catch(err =>{
    res.status(404).json('ITEM WAS NOT DELETED');
  })
})



module.exports = router;