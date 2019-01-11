const keystone = require('keystone')
const Types    = keystone.Field.Types

const Content = new keystone.List('Content', {
  map     : { name : 'title' },
  autokey : { path : 'slug', from: 'title', unique: true }
})


Content.add({
  title : { type : Types.Text, required: true, index: true },
  content : {
    type : Types.Html, wysiwyg : true, height: 150
  },
  makeHomepage : { type: Types.Boolean, index: true }
})

Content.defaultColumns = 'title, makeHomepage'

Content.register()