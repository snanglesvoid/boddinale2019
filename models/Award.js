const keystone = require('keystone')
const Types = keystone.Field.Types

const Award = new keystone.List('Award', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
})

Award.add({
    title: { type: Types.Text }
})

Award.register()