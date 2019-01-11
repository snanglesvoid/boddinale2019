const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    let locals = res.locals

    locals.section = 'workshop'

    view.query('movie', keystone.list('Workshop').model.findOne({slug: req.params.slug}))

    view.render('workshop')
}