
const handleProfileGet = (req, res, db) => {
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

const handleProfileUpdate = (req, res, db) => {
	const { id } = req.params;
	const { name, age, pet} = req.body.formInput;
	db('users')
		.where({ id }) // the id that matches to 'const id = req.params'
		.update({ name: name })
		.then(resp => {
			if (resp) {
				res.json('Success')
			} else {
				res.status(400).json('Unable to update')
			}
		})
		.catch(err => res.status(400).json('Error updating user'))
}


// ES6 : when key = valuew, write it once.
module.exports = {
	handleProfileGet,
	handleProfileUpdate
}