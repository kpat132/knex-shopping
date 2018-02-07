const express = require('express');
const router = express.Router();
const knex = require('../knex/knex.js');

router.get(`/:id`, (req, res) => {
  let id = req.params.id;
  return knex.raw(`SELECT * FROM users WHERE users.id = (?)`, [id])
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => {
      res.json("err");
    })
})
router.post(`/login`, (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  return knex.raw(`SELECT * FROM users WHERE users.email = ?`, [email])
    .then(result => {
      return result.rows[0];
    })
    .then(result => {
      console.log(result);
      if (result.password === password) {
        res.json(result);
      }
      else {
        res.json({ "message": "Incorrect password" });
      }
    })
    .catch(err => {
      res.json({ "message": "error" });
    })
});

router.post(`/register`, (req, res) => {
  // let{email, password} = req.body;
  // if(!(email && password)){
  //  return res.status(400).json({message: 'missing email or password'});
  // }
  //email = email.toLowerCase();
  let email = req.body.email;
  let password = req.body.password;
  //Select all from users where the users.email is equal to the requested email
  //If it exists then throw err
  return knex.raw(`SELECT users.email FROM users WHERE users.email = ?`, [email])
    .then(result => {
      if (result.rows.length) {
        throw new Error("User already exists");
      }
      else {
        return result;
      }
    })
    .then(result => {
      return knex.raw(`insert into users(email, password) values(?,?) RETURNING *`, [email, password]);
    })
    .then(result => {
      return res.json(result.rows[0]);
    })
    .catch(err => {
      res.json({ 'message': 'ERROR' });
    })
})
router.put('/:id/forgot-password', (req, res) => {
let id = req.params.id;
let newPass = req.body.password;

return knex.raw(`SELECT * FROM users WHERE id = ?`, [id])
.then(result => {
  console.log(newPass);

  return knex.raw(`UPDATE users SET password = ?`, [newPass])
})
.then(result => {
//console.log(result);


})
.catch(err => {
  res.json("error")
})
});







module.exports = router;