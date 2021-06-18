const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

const app = express();

app.use(morgan('combined'))
app.use(bodyParser.json());  // don't forget parsing data we get !!
app.use(cors())


app.get('/', (req, res) => { res.send('it is working!') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // dependency injection. passing 'db,bcrypt,req,res' to register.js
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) })
app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

// app.listen(process.env.PORT || 3000, ()=>{
// 	console.log(`app is running on port ${process.env.PORT}`);
// })

app.listen(80, ()=>{
	console.log(`the server is running on port 80`);
})
// arrow function will run right after the 'listen' happens on port 3000.


