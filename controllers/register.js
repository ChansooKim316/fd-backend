const jwt = require('jsonwebtoken');
const redis = require('redis')


// setup Redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days'});
}

const setToken = (key, value) => {
	return Promise.resolve(redisClient.set(key, value), err => console.log(err))
}

const createSessions = (user) => {
	// JWT Token, return user data
	const { email, id } = user;
	const token = signToken(email)
	setToken(token, id)
	return { success: 'true', userId: id, token } // token: token
}

// const createSessions = (user) => {
// 	// JWT Token, return user data
// 	const { email, id } = user;
// 	const token = signToken(email)
// 	console.log('got token')
// 	const session = setToken(token, id)
// 	console.log('setToken returns :', session)
// 	return setToken(token, id)
// 		.then(() => {
// 			console.log('returning token :\n', { success: 'true', userId: id, token }) // finishes after response
// 			return { success: 'true', userId: id, token } // token: token
// 		})
// 		.catch(console.log)
// }

const handleRegister = (req, res, db, bcrypt) => {
	const { email, name, password } = req.body; // email, name, password from a user
	if (!email || !name || !password) { // if one of these is empty
		return res.status(400).json('incorrect form submission'); // once it returns from this function, next part won't get run.
	}
	
	const hash = bcrypt.hashSync(password);

		// knex transaction method
		db.transaction(trx => {
			trx.insert({
				hash: hash, // hashed password
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*') // returns all columns of a new user
					.insert({
						email: loginEmail[0], // need [0], because it retruns array
						name: name,
						joined: new Date()
					})
					.then(userInfo => {
						res.json({user: userInfo[0], session: createSessions(userInfo[0])});
					})
			})
			.then(trx.commit)
			.catch(trx.rollback) // in case anything fails, roll back the changes.
		}) 
		.catch(err => res.status(400).json("unable to register"))
}



module.exports = {
	handleRegister: handleRegister
}