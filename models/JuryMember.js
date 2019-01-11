const keystone = require('keystone')
const Types = keystone.Field.Types

const JuryMember = new keystone.List('JuryMember', {
    autokey: { path: 'slug', from: 'name', unique: true }
})

JuryMember.add({
    name:     { type: Types.Name, required: true, index: true },
    linkText: { type: Types.Text },
    linkUrl:  { type: Types.Url }
})

JuryMember.defaultColumns= 'name, linkText, linkUrl'

JuryMember.register()