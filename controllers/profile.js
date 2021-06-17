
const handleProfileGet = (req, res)=>{
	const { id } = req.params;
	// if property == value (id: id), you can write just once. (ES6 feature)
	db.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting user'))
}

// ES6 : when key = valuew, write it once.
module.exports = {
	handleProfileGet
}