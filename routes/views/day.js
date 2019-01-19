const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)

    let locals = res.locals
    locals.section = 'home'

    if (!req.params.day || !(+req.params.day >= 1 && +req.params.day <= 11)) {
		return res.status(404).send();
	}

    locals.data = {
        day: +req.params.day,
        movies: []
    }

	view.query('data.awards', keystone.list('Award').model.find())
	view.query('day', keystone.list('Day').model.findOne({index: req.params.day}).sort({index: -1}))

    view.on('init', function (next) {
		if (locals.data.day < 11) {
			keystone.list('Movie').model
				.find()
				.where({ 'screenTime.year': new Date().getFullYear() })
				.where({ 'screenTime.day': req.params.day })
				.populate('award category')
				.sort({
					'screenTime.year': 1,
					'screenTime.day': 1,
					'screenTime.position': 1,
				})
				.exec(function (err, docs) {
					locals.data.movies = docs;
					docs.forEach(d => d.format());
					console.log('executed query for day ' + req.params.day);
					console.log('found ' + docs.length + ' documents');
					next(err);
				});
		}
		else {
			keystone.list('Content').model
				.findOne()
				.where({ title: 'LastDay' })
				.exec(function (err, doc) {
					if (doc) locals.data.content = doc.content;
					else locals.data.content = 'No Content named \'Last Day\' found';
					keystone.list('Movie').model.find()
						.where({
							'screenTime.year' : (new Date().getFullYear()),
							award : { $ne: null },
						})
						.populate('award category')
						.exec((err, movies) => {
							if (err) return res.status(500).send(err)
							if (!movies) movies = []
							movies.forEach(m => m.format())
							// locals.data.movies = movies.sort((a,b) => {
							// 	let i = awards.indexOf(a.award)
							// 	let j = awards.indexOf(b.award)
							// 	return i < j ? -1 : i == j ? 0 : 1
							// })
							locals.data.movies = movies
							next(err);
						})
				});
		}
	});


    view.render('day')
}