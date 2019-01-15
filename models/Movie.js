const keystone = require('keystone');
const Types = keystone.Field.Types;


const Movie = new keystone.List('Movie', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Movie.add({
	title: {
		type: Types.Text, required: true, index: true,
	},
	director: {
		name: { type: Types.Text },
		href: { type: Types.Url },
	},
	description: {
		type: Types.Html, wysiwyg: true, height: 400,
	},
	length: {
		type: Types.Number,
	},
	screenTime: {
		year: { type: Types.Number, index: true },
		day: { type: Types.Number, index: true },
		position: { type: Types.Number, index: true, label: 'slot' },
	},
	display: {
		image: { type: Types.CloudinaryImage },
		youtube: { type: Types.Url },
		vimeo: { type: Types.Url },
	},
	externalLink: {
		type: Types.Url,
	},
	category: {
		type: Types.Relationship, ref: 'MovieCategory'
	},
	_category: {
		type: Types.Select,
		// hidden: true,
		options: ['Short', 'Feature', 'Music Video', 'Animation', 'Documentary', 'Porn', 'Afterparty', 'Lounge', 'Performance'],
	},
	award: {
		type: Types.Relationship. ref: 'Award'
	},
	_award: {
		type: Types.Select,
		options: ['Community Award', 'Loophole Award', 'Best Documentary',
							'Best Short', 'Best Feature', 'Best Animation', 'Best Music Video',
							'Special Mention of the Jury', 'Special Mention of the Loophole',
							'Independant Life Award', 'Urban Spree Award'],
	},
	tstImage: { type: Types.CloudinaryImage },
	votes: { type: Types.Number, default: 0 },
});


Movie.schema.virtual('description.full').get(function () {
	return this.description.extended || this.description.brief;
});

function toTitleCase (str) {
	if (!str) return ''
	return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
}

Movie.schema.methods.format = function () {
	this.director.name = toTitleCase(this.director.name).replace(/\s\s+/g, ' ');
	this.title = this.title.toUpperCase();
};

Movie.defaultColumns = 'title, director|20%, screenTime.year|20%, screenTime.day|20%';

Movie.register();

