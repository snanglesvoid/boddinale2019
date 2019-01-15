const keystone = require('keystone')

exports = module.exports = (req, res) => {
    keystone.list('Movie').mode.find()
}