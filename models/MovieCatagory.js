const keystone = require('keystone')
const Types = keystone.Field.Types

const MovieCategory = new keystone.List('MovieCategory', {
    autokey: { path: 'slug', from: 'title', unique: true }
})

MovieCategory.add({
    name: { type: Types.Text }
})

MovieCategory.register()