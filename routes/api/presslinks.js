const keystone = require('keystone')
exports = module.exports = (req, res) => {
    keystone.list('PressLink').model.find().sort({sortOrder: 1})
        .exec((err, docs) => {
            if (err) {
                return res.status(500).send(err)
            }
            res.json(docs)
        })
}