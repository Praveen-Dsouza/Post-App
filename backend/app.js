const path = require('path')
const express = require('express')
const bodyparser = require('body-parser')
const app = express();

const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')



app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: false }))
app.use("/images", express.static(path.join('backend/images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  next();
})

app.use('/api/posts', postRoutes)
app.use('/api/user', userRoutes)

module.exports = app


/*
app.post('/api/posts', (req, res, next ) => {

  var sql = `INSERT INTO data (id,title,body) VALUES ('${req.body.id}' ,'${req.body.title}', '${req.body.content}')`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });

})

app.get('/api/posts' ,(req, res, next) => {

con.query("SELECT * FROM data", function (err, result, fields) {
  if (err) throw err;
  console.log(result);
  return res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: result
  })
})

})

//Update
app.put('/api/posts', (req, res, next) => {
console.log(req.query.id)

var sql = `UPDATE data SET title = '${req.query.title}', body = '${req.query.content}' WHERE id = '${req.query.id}'`;
con.query(sql, function (err, result) {
  if (err) throw err;
  console.log(result.affectedRows + " record(s) updated");
  console.log(req.params.id)

});
})

app.get('/api/posts/:id', (req, res, next) => {
var sql = `SELECT * FROM data WHERE id = ${req.params.id}`
con.query(sql, function (err, result, fields) {
  if (err) throw err;
  console.log(result);
}).then(post => {
  if (post) {
    res.status(200).json(post)
  } else {
    res.status(404).json({message: 'POst not found'})
  }
})
})

app.delete('/api/posts', (req, res, next) => {
// console.log(req.query.id)

var sql = `DELETE FROM data WHERE id = '${req.query.id}'`;

con.query(sql, function (err, result) {
  if (err) throw err;
  console.log("Number of records deleted: " + result.affectedRows);
  // console.log(req.params.id)
  res.status(200).json({ message: 'Post deleted!' })
});

})
*/
