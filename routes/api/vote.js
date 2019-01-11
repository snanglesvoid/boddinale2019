const keystone = require('keystone');
const Movie = keystone.list('Movie');

exports = module.exports = function (req, res) {
	Movie.model.findOneAndUpdate({
		_id: req.query.movie,
	}, {
		$inc: { votes: 1 },
	})
	.exec(function (err, doc) {
		if (err) {
			console.error(err);
			return res.status(500).send(err);
		}
		res.json(doc);
	});
};
