const keystone = require('keystone');
// const html2txt = require('html-to-text');

exports = module.exports = (req, res) => {

	let query = keystone.list('Movie').model.find().populate('award category');
	console.log(req.query);
	if (req.query) {
		query.where(req.query);
	}

	query.exec((err, docs) => {
		if (err) {
			return res.sendStatus(500);
		}
		docs.forEach(d => {
			d.format();
			d.description = html2txt.fromString(d.description, { wordwrap: false });
			if (d.display.image) {
				d.display.image.url = d._.display.image.crop(800, 450);
			}
		});
		return res.status(200).json(docs);
	});
};
