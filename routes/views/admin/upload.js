const keystone = require('keystone');
const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '/../../../uploads/data.json');

const Movie = keystone.list('Movie').model;

String.prototype.capitalize = function () {
	return this.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ');
};

const categories = ['Short', 'Feature', 'Music Video', 'Animation', 'Documentary', 'Porn', 'Afterparty', 'Lounge', 'Performance'];

function getIdFromYoutube (url) {
	var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match && match[2].length === 11) {
		return match[2];
	} else {
		return 'error converting youtube link';
	}
};

function convertYoutubeToEmbed (id) {
	return 'https://www.youtube.com/embed/' + id;
}

function isYoutube (url) {
	return url ? url.indexOf('yout') !== -1 : false;
}

function isVimeo (url) {
	return url ? url.indexOf('vimeo') !== -1 : false;
}

function convertVimeoToEmbed (input) {
	var pattern = /(?:http?s?:\/\/)?(?:www\.)?(?:vimeo\.com)\/?(\S+)/g;
	if (pattern.test(input)) {
		var replacement = '//player.vimeo.com/video/$1';
		input = input.replace(pattern, replacement);
	}
	return input;
}

function isGMailLink (url) {
	return url.indexOf('mail.google') !== -1;
}

function insertData (year, callback) {
	console.log(dataPath)
	fs.readFile(dataPath, 'utf-8', (err, data) => {
		if (err) return callback(err);
		let moviesJSON = JSON.parse(data);
		console.log('moviesJSON', moviesJSON)
		if (!moviesJSON) {
			return callback(new Error('nope'))
		}
		moviesJSON.forEach(movie => {
			let mdb = new Movie();
			mdb.set({
				title: movie.title,
				length: typeof movie.length === 'string' ? movie.length.replace(/\D/g, '') : movie.length,
				description: movie.description,
				director: {
					name: movie.director,
					href: movie['director link'],
				},
				screenTime: {
					year: year,
					day: movie.day,
					position: movie.slot,
				},
				externalLink: isGMailLink(movie['movie link']) ? '' : movie['movie link'],
			});
			let categoryRaw = movie.category;
			let category = '';
      // if (typeof categoryRaw == 'string' && categoryRaw.indexOf(' ') !== -1) {
      //   category = (categoryRaw.split(' ')[1] || '').toLowerCase().capitalize()
      // }
			if (typeof categoryRaw === 'string') {
				category = categoryRaw.toLowerCase().capitalize();
			}
			console.log('category', category);
			if (categories.indexOf(category) !== -1) {
				mdb.set({
					category: category,
				});
			};
			if (isYoutube(movie.trailer)) {
				mdb.set({
					display: {
						youtube: convertYoutubeToEmbed(getIdFromYoutube(movie.trailer)),
					},
				});
			}
			else if (isVimeo(movie.trailer)) {
				mdb.set({
					display: {
						vimeo: convertVimeoToEmbed(movie.trailer),
					},
				});
			}
			mdb.save((err, doc) => console.log(err));
		});
		callback(null);
	});
}

exports = module.exports = (req, res) => {
	let view = new keystone.View(req, res);

	view.on('post', { action: 'upload' }, next => {
		let year = req.body.year;
		console.log('year: ', year);
		let movies = req.files.movies;
		if (movies.extension !== 'json') {
			res.json({ error: 'file must have .json extension' });
			return next();
		}
		let reader = fs.createReadStream(movies.path);
		let writer = fs.createWriteStream(dataPath);
		reader.pipe(writer).on('finish', () => {
			console.log('reader finished!');
			insertData(+year, (err) => {
				if (err) {
					return res.json(err);
				}
				next();
			});
		});
	});

	view.render('admin/upload');
};
