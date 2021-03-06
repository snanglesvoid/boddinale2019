var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	view.query('days', keystone.list('Day').model.find().sort({index: 1}))
	// Render the view
	view.on('init', next => {
		keystone.list('Content').model.findOne({ makeHomepage: true}).exec((err, c) => {
			if (c) {
				return res.redirect('/content/' + c.slug)
			}
			next(err)
		})
	})

	view.render('index');
};
