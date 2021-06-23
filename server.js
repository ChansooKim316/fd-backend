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
const auth = require('./controllers/authorization');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB
  }
});

const app = express();

app.use(morgan('combined'))
app.use(bodyParser.json());  // don't forget parsing data we get !!
app.use(cors())


app.get('/', (req, res) => { res.send('it is working!') })
// app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/signin', signin.signinAuthentication(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) }) // dependency injection. passing 'db,bcrypt,req,res' to register.js
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) })
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db)})
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) })

// app.listen(process.env.PORT || 3000, ()=>{
// 	console.log(`app is running on port ${process.env.PORT}`);
// })

app.listen(80, ()=>{
	console.log(`the server is running on port 80`);
})
// arrow function will run right after the 'listen' happens on port 3000.


