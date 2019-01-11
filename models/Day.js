const keystone = require('keystone')
const Types = keystone.Field.Types


const Day = new keystone.List('Day', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true },
})

Day.add({
    title: {
        type: Types.Text, required: true, initial: true
    },
    index: {
        type: Types.Number, required: true, initial: true
    },
    date: {
        type: Types.Date
    },
    time: {
        type: Types.Text,  default: "From 18:00 to 23:00"
    },

    picture: {
        type: Types.CloudinaryImage
    }
})

Day.defaultSort= 'index'
Day.defaultColumns= 'title, index, date, picture'

Day.register()