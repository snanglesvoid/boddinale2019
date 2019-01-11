const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    let locals = res.locals

    locals.section = 'partners'

    // view.query('partners', keystone.list('Partners').model.find())

    view.render('partners')
}