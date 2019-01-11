const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    let locals = res.locals
    
    locals.section = 'content'

    view.query('data', keystone.list('Content').model.findOne({slug: req.params.slug}))

    view.render('content')
}