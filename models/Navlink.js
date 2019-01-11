const keystone = require('keystone')
const Types = keystone.Field.Types

const Navlink = new keystone.List('Navlink', {
    map: { name: 'title' },
    autokey: { path: 'key', from: 'title', unique: true },
    defaultSort: "-sortOrder"
})

Navlink.add({
    title: { type: Types.Text, required: true, initial: true },
    linkUrl: { type: Types.Text, required: true, initial: true },
    inDropdown: { type: Types.Boolean, default: false },
    sortOrder: { type: Types.Number, default: 0 },
})

Navlink.defaultColumns= 'title, linkUrl, inDropdown, sortOrder'

Navlink.register()