const keystone = require('keystone')
const Types = keystone.Field.Types

const PressLink = new keystone.List('PressLink', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
})

PressLink.add({
    title: { type: Types.Text },
    linkText: { type: Types.Text },
    linkUrl: { type: Types.Text },
    sortOrder: { type: Types.Number }
})

PressLink.defaultColumns= 'title, linkText, linkUrl, sortOrder'

PressLink.register()