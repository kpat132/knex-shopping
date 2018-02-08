const express = require("express");
const router = express.Router();
const knex = require("../knex/knex.js");

router.get("/", (req, res) => { 
  return knex.raw(`SELECT * FROM products`)
  .then(result =>{
    res.json(result.rows);
  })
  .catch(err => {
    res.json('ERROR');
  })
});

router.get("/:id", (req, res) => {
  let id = req.params.id;
  return knex.raw(`SELECT * FROM products WHERE id = ?`, [id])
    .then(result => {
      res.json(result.rows[0]);
    });
});

router.post('/new', (req, res) => {
  let title = req.body.title;

  return knex.raw(`SELECT products.title FROM products WHERE products.title = ?`, [title])
    .then(result => {
      if(result.rows.length){
        res.status(404).json({ message: "ERROR" });
      }else{
        return result;
      }
    })
    .then(result => {
     //console.log(result);
     if(title && req.body.description && req.body.inventory && req.body.price){
      return knex.raw(`INSERT INTO products(title,description,inventory,price) VALUES (?,?,?,?) RETURNING *`, [title, req.body.description,req.body.inventory,req.body.price]);
     }else{
      throw new Error({ "message": "Must POST all product fields" });
     }
    })
    .then(result =>{
      return res.json(result.rows[0]);
    })
    .catch(err => {
      throw new Error('Error: Check data types');
    })
})
router.put(`/:id`,(req, res) => {
  let id = req.params.id;
  let title = req.body.title;

  return knex.raw('SELECT * FROM products WHERE id = ?',[id])
  .then(result => {
    console.log(result.rows.length);
    if(result.rows.length === 0){
      throw new Error('ERROR');
    }else{
      return result.rows[0];
    }
  })
  .then(result => {
    return knex.raw('UPDATE products SET title = ?, description = ?, inventory = ?, price = ? WHERE id = ?',[title, req.body.description,req.body.inventory,req.body.price, id] )
  })
  .then(result => {
    //console.log(result);
    return res.json(`{ message: Product: ${id} has been updated }`);
  })
  .catch(result => {
    res.json("error");
  })
})
router.delete('/:id', (req,res)=>{
  let id = req.params.id;
  return knex.raw(`SELECT * FROM products WHERE id = ?`, [id])
  .then(result=>{
    return knex.raw(`DELETE FROM products WHERE id = ?` ,[result.rows[0].id])
  })
  .then(result=>{
    res.json({ message: `Product id: ${id} successfully deleted `});
  })
  .catch(err=>{
    res.json({ message: `Product id: ${id} not found `});
  })
})




module.exports = router;
