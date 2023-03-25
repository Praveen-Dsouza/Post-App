const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const multer = require('multer')
const checkAuth = require('../middleware/check-auth')

// const MIME_TYPE_MAP = {
//   'image/png': 'png',
//   'image/jpeg': 'jpg',
//   'image/jpg': 'jpg'
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const isValid = MIME_TYPE_MAP[file.mimetype]
//     let error = new Error('Invalid mime type')
//     if (isValid) {
//       error = null
//     }
//     cb(error, 'backend/images')
//   },
//   filename: (req, file, cb) => {
//     const name = file.originalname.toLowerCase().split(' ').join('-')
//     const ext = MIME_TYPE_MAP[file.mimetype]
//     cb(null, name + '-' + Date.now() + '.' + ext)
//   }
// })

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

// multer({storage: storage}).single('image'),
router.post('', checkAuth, (req, res, next ) => {
  console.log(req.body.id,req.body.title,req.body.content);
  // const url = req.protocol + '://' + req.get('host') + '/backend/images/'
  var sql = `INSERT INTO data (id,title,body) VALUES ('${req.body.id}' ,'${req.body.title}', '${req.body.content}')` //, '${req.body.image}'
  con.query(sql, function (err, result) {
    console.log(result)
    if (err) {
      res.status(500).json({
        message: 'Creating a post failed!'
      })
    }
    console.log("1 record inserted");
  });
})

router.get('' ,(req, res, next) => {

  const postQuery = "SELECT * FROM data"

  con.query(postQuery, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    return res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: result
    })
  })

})

//Update
router.put('',checkAuth, (req, res, next) => {

var sql = `UPDATE data SET title = '${req.query.title}', body = '${req.query.content}' WHERE id = '${req.query.id}'`;
con.query(sql, function (err, result) {
  if (err) {
    res.status(401).json({
      message: 'Not Authorized'
    })
  } else {
    res.status(500).json({
      message: `Couldn't update post!`
    })
  }
  console.log(result.affectedRows + " record(s) updated");
  console.log(req.params.id)

});
})

router.get('/:id', (req, res, next) => {
  var sql = `SELECT * FROM data WHERE id = ${req.params.id}`
  con.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  }).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post not found'})
    }
  })
})

router.delete('',checkAuth, (req, res, next) => {
// console.log(req.query.id)

  var sql = `DELETE FROM data WHERE id = '${req.query.id}'`;

  con.query(sql, function (err, result) {
    if (err) {
      res.status(401).json({ message: 'Not authorized!' })
    };
    console.log("Number of records deleted: " + result.affectedRows);
    // console.log(req.params.id)
    res.status(200).json({ message: 'Post deleted!' })
  });

})


module.exports = router;
