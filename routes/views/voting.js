const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    let locals = res.locals
    locals.section = 'voting'
    locals.data = {}
    let year = (new Date()).getFullYear()

    view.query('data.intro', keystone.list('Content').model.findOne({slug: 'voting-intro'}))

    view.on('init', next => {
        keystone.list('Movie').model.find()
            .where({ 'screenTime.year' : year })
            .sort({ votes: -1})
            .exec((err, docs) => {
                docs.forEach(d => d.format())
                res.locals.movies = docs
                next(err)
            })
    })

    view.render('voting')
}