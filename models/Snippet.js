const keystone = require('keystone')
const Types = keystone.Field.Types

const Snippet = new keystone.List('Snippet', {
    map : { name: 'title' },
    autokey : { path: 'slug', from: 'title', unique: true }
})

Snippet.add({
    title: { type: Types.Text, required: true, initial: true, index: true },
    content : {
        type : Types.Text
    }
})

Snippet.register()