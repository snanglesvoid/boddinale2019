const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    let locals = res.locals
    locals.section = 'press'

    view.query('presslinks', keystone.list('PressLink').model.find())

    view.render('press')
}
