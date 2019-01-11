const keystone = require('keystone')
const Types = keystone.Field.Types

const Partner = new keystone.List('Partner', {
    autokey : { path: 'slug', from: 'name', unique: true }
})

Partner.add({
    name: { type: Types.Text },
    logo: { type: Types.CloudinaryImage },
    linkUrl: { type: Types.Url },
    sponsor: { type: Types.Boolean, index: true },
    sortOrder: { type: Types.Number, default: 0 }
})

Partner.defaultColumns= 'name, linkUrl, sponsor, logo, sortOrder'

Partner.register()