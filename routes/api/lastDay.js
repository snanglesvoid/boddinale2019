const keystone = require('keystone');

exports = module.exports = function (req, res) {
	keystone.list('Content').model.findOne()
		.where({ title: 'LastDay' })
		.exec(function (err, doc) {
			if (doc) {
				return res.json(doc.content);
			}
			else {
				return res.status(404).send('not found');
			}
		});
};
