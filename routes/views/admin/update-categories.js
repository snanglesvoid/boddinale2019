const keystone = require('keystone')
const async    = require('async')

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

        async.each(movies, (movie, cb) => {
            let oldCat = movie.category
            let oldAwa = movie.award
            console.log(movie.title, movie._category, movie._award)
            movie.set({
                _award: movie.award,
                _categori: movie.category,
            })
            return movie.save(cb)
            // return cb(null)
            categories.forEach(c => {
                if (c.name == oldCat) {
                    movie.category = c._id
                }
            })
            awards.forEach(a => {
                if (a.name == oldAwa) {
                    movie.award = a._id
                }
            })
            movie.save(cb)
        }, err => {
            if (err) return res.status(500).send(err)
            console.log('done')
            res.json('ok')
        })
    })
}