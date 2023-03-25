const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      console.log(hash)

      var sql = `INSERT INTO user (email, password) VALUES ('${req.body.email}' ,'${hash}')`;
      con.query(sql, function (err, result) {
        if (err) {
          console.log('Duplicate entry of email')
          res.status(404).json({message: 'Invalid authentication credentials!'})
        }
        else{console.log("User Created")};
      });

    })
})

router.post('/login', (req, res, next) => {
  var password= req.body.password

  var sql = `SELECT * FROM user WHERE email = '${req.body.email}'`
  con.query(sql,  function (err, result) {
    if(err){
      console.log(err)
      res.status(404).json({message: 'Invalid authentication credentials!'})
    }
    console.log(result[0].password)
    if(result.length >0) {
      bcrypt.compare(password, result[0].password,function(err,result){
        if(err){
          return res.status(404).json({msg:"error!!"}).redirect('/')

        }
        console.log(result)
        if(result){
          console.log('loggedIn')
          const token = jwt.sign({ email: req.body.email, userId: req.body.id},
            "secret_this_should_be_longer",
            { expiresIn: '1h' });
          console.log('This is token',token);
          res.status(200).send({
            token: token,
            expiresIn: 3600 //1hr
          });

        }
        else{
          console.log('Wrong password!!')

           //return res.status(404).json({msg:"inavlid credentials"})
           res.redirect('localhost:4200/signup')
         }


      })

    }

  })
})

module.exports = router
