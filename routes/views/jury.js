const keystone = require('keystone')

exports = module.exports = (req, res) => {
    const view = new keystone.View(req, res)
    let locals = res.locals
    locals.section = 'jury'

    view.query('members', keystone.list('JuryMember').model.find())

    view.render('jury')
}