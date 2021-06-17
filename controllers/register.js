
const handleRegister = (req, res, db, bcrypt)=> {
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
					.then(user => {
						res.json(user[0]);
					})	
			})
			.then(trx.commit)
			.catch(trx.rollback) // in case anything fails, roll back the changes.
		}) 
		.catch(err => res.status(400).json("unable to register"))
		// .catch(err => res.status(400).json(err))
}


module.exports = {
	handleRegister: handleRegister
}