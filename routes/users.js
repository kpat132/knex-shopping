const express = require("express");
const router = express.Router();
const knex = require("../knex/knex.js");

router.get(`/:id`, (req, res) => {
  let id = req.params.id;
  return knex.raw(`SELECT * FROM users WHERE users.id = (?)`, [id])
    .then(result => {
      res.json(result.rows[0]);
    })
    .catch(err => {
      res.json("err");
    });
});
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
      } else {
        res.json({ message: "Incorrect password" });
      }
    })
    .catch(err => {
      res.json({ message: "error" });
    });
});

router.post(`/register`, (req, res) => {
  // let{email, password} = req.body;
  // if(!(email && password)){
  //  return res.status(400).json({message: 'missing email or password'});
  // }
  //email = email.toLowerCase();
  let email = req.body.email;
  let password = req.body.password;
  return knex.raw(`SELECT users.email FROM users WHERE users.email = ?`, [email])
    .then(result => {
      if (result.rows.length) {
        throw new Error("User already exists");
      } else {
        return result;
      }
    })
    .then(result => {
      return knex.raw(`insert into users(email, password) values(?,?) RETURNING *`,
        [email, password]
      );
    })
    .then(result => {
      return res.json(result.rows[0]);
    })
    .catch(err => {
      res.json({ message: "ERROR" });
    });
});
router.put("/:id/forgot-password", (req, res) => {
  let id = req.params.id;
  let newPass = req.body.password;
  return knex.raw(`UPDATE users SET password = ? WHERE id = ?`, [newPass, id])

    .then(result => {
      res.json({ message: "New password created!" });
    })
    .catch(err => {
      res.json("error");
    });
});
router.delete(`/:id`, (req, res) => {
  let id = req.params.id;
 // console.log(id);
  return knex.raw(`SELECT * FROM users WHERE id = ?`, [id])
  .then(result => {
    console.log(result.rows[0]);
    return knex.raw(`DELETE FROM users WHERE id = ?`, [result.rows[0].id])
  })
  .then(result => {
    res.json("Successfully Deleted!");
  })
  .catch(err => {
    res.json("Error, not deleted!");
  })

});

module.exports = router;
