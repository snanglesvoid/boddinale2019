const keystone = require('keystone')


exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    const locals = res.locals

    locals.section = 'archive'
    locals.qStrForPage = function (i) {
		let res = [];
		if (req.query.y) res.push(`y=${req.query.y}`);
		if (req.query.d) res.push(`d=${req.query.d}`);
		if (req.query.q) res.push(`q=${req.query.q}`);
		if (req.query.a) res.push(`a=${req.query.a}`);
		if (req.query.c) res.push(`c=${req.query.c}`);
		res.push(`page=${i}`);
		return '?' + res.join('&');
	};
    locals.data = {
        query: req.query
    }
    const year = (new Date()).getFullYear()
    const years = []
    for (let y = 2013; y <= year; ++y) {
        years.push(y)
    }
    locals.data.years = years

  

    let query = keystone.list('Movie').paginate({
        page: req.query.page || 1,
        perPage: 12,
        maxPages: 10,
    }).sort({
        'screenTime.year': 1,
        'screenTime.day': 1,
        'screenTime.position': 1,
    })

    if (req.query.y) {
        query.where({'screenTime.year': +req.query.y })
    }
    if (req.query.d) {
        query.where({'screenTime.day': +req.query.d })
    }
    // if (req.query.a) {
    //     query.where({ 'award': req.query.a })
    // }
    // if (req.query.c) {
    //     query.where({ 'category': req.query.c })
    // }

    
    view.on('init', next => {
        keystone.list('Award').model.find()
        .exec((err, awards) => {
            if (err) return next(err)
            locals.data.awards = awards
        keystone.list('MovieCategory').model.find()
        .exec((err, categories) => {
            if (err) return next(err)
            locals.data.categories = categories

        if (req.query.a) {
            let a = _.find(locals.data.awards, a => a.title == req.query.a)
            query.where('award', a._id)
        }
        if (req.query.c) {
            let c = _.find(locals.data.categories, c => c.name == req.query.c)
            query.where('category', c._id)
        }
        query.populate('category award')
        query.exec((err, docs) => {
            if (docs && docs.length > 0) {
                docs.results.forEach(d => d.format())
            }
            locals.data.movies = docs
            next(err)
        })
        })    
        })
    })

    view.render('archive')
}