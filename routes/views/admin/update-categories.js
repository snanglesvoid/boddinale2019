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
            
            //backup old
            // movie.set({
            //     _award: movie.award,
            //     _category: movie.category,
            // })
            // return movie.save(cb)

            //instantiate new
            console.log('Movie: ', movie.title, movie._category)
            let c = _.find(categories, x => x.name == movie._category)
            if (c) {
                movie.category = c._d
                console.log('found c: ', c.name)
            }
            let a = _.find(awards, x => x.title == movie._award)
            if (a){
                movie.award = a._id
                console.log('found a:', a.title)
            }
            movie.save(cb)
        }, err => {
            if (err) return res.status(500).send(err)
            console.log('done')
            res.json('ok')
        })
    })
}