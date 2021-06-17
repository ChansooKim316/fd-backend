
const handleSignin = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body; // email, password are from req.body
	if (!email || !password) { // if one of these is empty
		return res.status(400).json('incorrect form submission'); // once it returns from this function, next part won't get run.
	}
	// doesn't need to be a transaction, just checking, not modifying the database items
	db.select('email', 'hash').from('login')
		.where('email', '=', email) 
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);  // compare typed p.w and hash
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
	handleSignin: handleSignin
}  

