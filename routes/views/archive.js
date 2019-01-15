const keystone = require('keystone')
const _  = require('lodash')
const async = require('async')

exports = module.exports = (req, res) => {
    // return res.json('ok')
    const view = new keystone.View(req, res)
    const locals = res.locals

    console.log('archive')

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

  

    let query = keystone.list('Movie').model.find().sort({
        'screenTime.year': -1,
        'screenTime.day': 1,
        'screenTime.position': 1,
    })

    // if (req.query.a) {
    //     query.where({ 'award': req.query.a })
    // }
    // if (req.query.c) {
    //     query.where({ 'category': req.query.c })
    // }

    function buildQuery(cb) {
        console.log('build query')
        if (req.query.y) {
            query.where({'screenTime.year': +req.query.y })
        }
        if (req.query.d) {
            query.where({'screenTime.day': +req.query.d })
        }
        if (req.query.q) {
            let regex = new RegExp(req.query.q, 'i');
            query.or([{ title: regex }, { 'director.name': regex }]);
        }
        query.populate('category award')
        cb()

        // async.each(['Award', 'MovieCategory'],
        //     (listname, next) => {
        //         keystone.list(listname).model.find()
        //             .exec((err, docs) => {
        //                 if (err) return next(err)
        //                 if (listname == 'Award') {
        //                     locals.data.awards = docs
        //                 }
        //                 else if (listname == 'MovieCategory') {
        //                     locals.data.categories = docs
        //                 }
        //                 next(null)
        //             })
        //     }
        //     ,
        //     err => {
        //         if (err) return cb(err)
        //         if (req.query.a) {
        //             let a = _.find(locals.data.awards, a => a.title == req.query.a)
        //             query.where('award', a._id)
        //         }
        //         if (req.query.c) {
        //             let c = _.find(locals.data.categories, c => c.name == req.query.c)
        //             query.where('category', c._id)
        //         }
        //         // query.skip(req.query.page * 10).limit(10)
        //         query.populate('category award')
        //         cb()
        //     }
        // )
    }

    
    view.on('init', next => {
        next()
        // console.log('init')
        // buildQuery(function(err) {
        //     console.log('built')
        //     if (err) return next(err)
        //     query.exec((err, docs) => {
        //         if (docs && docs.length > 0) {
        //             docs.forEach(d => d.format())
        //         }
        //         let total  = docs.length
        //         let nPages = Math.ceil(total / 10)
        //         locals.data.movies = {
        //             results: docs || [],
        //             total : total,
        //             totalPage : nPages,
        //             previous : req.query.page == 1 ? false : req.query.page - 1,
        //             next : req.query.page >= nPages ? false : req.quer.page + 1,
        //             pages : (Array.apply(null, {length: nPages}).map(Number.call, Number)).map(x => x+1)
        //         }
        //         next(err)
        //     })
        // })      
    })

    view.render('archive')
}