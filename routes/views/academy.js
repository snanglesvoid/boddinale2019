const keystone = require('keystone')

exports = module.exports = (req, res) => {
    let view = new keystone.View(req, res)
    let locals = res.locals

    locals.section = 'academy'

    locals.data = {}

    let year = (new Date()).getFullYear()

    view.query('intro', keystone.list('Content').model.findOne({ slug: 'academy-intro'}))

    view.on('init', next => {
        keystone.list('Workshop').model.find()
            .where({'screenTime.year' : year})
            .sort({
                'screenTime.position':1,
            })
            .exec((err, docs) => {
                locals.data.workshops = docs
                next(err)
            })
    })

    view.render('academy')
}