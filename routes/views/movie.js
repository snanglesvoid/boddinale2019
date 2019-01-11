const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    let locals = res.locals

    locals.section = 'movie'
    locals.data = {}
    
    view.query('data.movie', keystone.list('Movie').model.findOne({
        slug: req.params.slug
    }))

    view.render('movie')
}