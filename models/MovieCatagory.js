const keystone = require('keystone')
const Types = keystone.Field.Types

const MovieCategory = new keystone.List('MovieCategory', {
    autokey: { path: 'slug', from: 'name', unique: true }
})

MovieCategory.add({
    name: { type: Types.Text, required: true, initial: true },
    showAsArchiveFilter: { type: Types.Boolean },
    showInApp : { type: Types.Boolean }
})

MovieCategory.register()