const keystone = require('keystone')
const async    = require('async')
const _        = require('lodash')

exports = module.exports = (req, res) => {
    let data = {}
    async.each(['Movie', 'Award', 'MovieCategory'], (listname, callback) => {
        keystone.list(listname).model.find().exec((err, docs) => {
            if (err) return callback(err)
            data[listname] = docs
            callback(null)
        })
    }, err => {
        if (err) return res.status(500).send(err)
        let movies = data['Movie']
        let awards = data['Award']
        let categories = data['MovieCategory']

        async.eachSeries(movies, (movie, cb) => {
            
            // movie.set({
            //     _award: movie.award,
            //     _category: movie.category,
            // })
            // return movie.save(cb)
            // // return cb(null)
            // categories.forEach(c => {
            //     if (c.name == movie._category) {
            //         movie.category = c._id
            //         console.log(c.name)
            //     }
            // })
            let a = _.find(awards, x => x.title == movie._award)
            if (a) movie.award = a._id
            movie.save(cb)
        }, err => {
            if (err) return res.status(500).send(err)
            console.log('done')
            res.json('ok')
        })
    })
}