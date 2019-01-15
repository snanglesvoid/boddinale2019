const keystone = require('keystone');

exports = module.exports = function (req, res) {
	const query = keystone.list('Movie').paginate({
		page: req.query.page || 1,
		perPage: 12,
		// maxPages: 10,
	})
	.sort({
		'screenTime.year': -1,
		'screenTime.day': 1,
		'screenTime.position': 1,
	});

	if (req.query.y) {
		query.where({ 'screenTime.year': +req.query.y });
	}
	if (req.query.d) {
		query.where({ 'screenTime.day': +req.query.d });
	}
	if (req.query.q) {
		let regex = new RegExp(req.query.q, 'i');
		query.or([{ title: regex }, { 'director.name': regex }]);
	}
	if (req.query.a) {
		query.where({ award: req.query.a });
	}
	if (req.query.c) {
		query.where({ category: req.query.c });
	}

	query.exec(function (err, docs) {
		if (err) {
			console.error(err);
			res.status(500).json(err);
		}
		docs.results.forEach(d => d.format());
		res.json(docs);
	});
};
