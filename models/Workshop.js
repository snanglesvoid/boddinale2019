const keystone = require('keystone')
const Types    = keystone.Field.Types


const Workshop = new keystone.List('Workshop', {
  map     : { name: 'title' },
	autokey : { path: 'slug', from: 'title', unique: true },
})

Workshop.add({
  title : { 
    type : Types.Text, required: true, index: true
  },
  director : { 
    name : { type : Types.Text },
    href : { type : Types.Url  }
  },
  description : {
    type: Types.Html, wysiwyg: true, height: 400
	},
  screenTime : {
    year     : { type : Types.Number, index: true },
    day      : { type : Types.Number, index: true },
    position : { type : Types.Number, index: true, label : 'slot' }
  },
  display : {
    image    : { type : Types.CloudinaryImage },
    youtube  : { type : Types.Url },
    vimeo    : { type : Types.Url }
  },
  externalLink : {
    type : Types.Url
  }
})


Workshop.schema.virtual('description.full').get(function() {
  return this.description.extended || this.description.brief
})

Workshop.defaultColumns = 'title, director|20%, screenTime.year|20%, screenTime.day|20%'

Workshop.register()

