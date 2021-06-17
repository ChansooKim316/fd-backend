const Clarifai = require('clarifai');  

/* most useful APIs require a set up like this */
const app = new Clarifai.App({
 apiKey: '47d153b68bd84170a7e65946b4c1d17f'
});

const handleApiCall = (req, res) => {
	app.models.predict(
	    // Clarifai.DEMOGRAPHICS_MODEL, // age + prob. key : 'c0c0ac362b03416da06ab3fa36fb58e3'
	    Clarifai.FACE_DETECT_MODEL,  // face detect only.
	    // Clarifai.GENERAL_MODEL,
	    req.body.input)
	  .then(data => {
	  	res.json(data);
	  })
	  .catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id } = req.body;
  db('users').where('id', '=', id) // =(single equal), it's SQL. --> same as : WHERE 'id'=id
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
  	res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
	handleImage,
	handleApiCall
}
