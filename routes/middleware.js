/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const _ = require('lodash');
const async = require('async')
const keystone = require('keystone')

function snippetEditable(user, data, lang) {
	if (!user) return ''
	return JSON.stringify ({
		list: 'textsnippets',
		path: 'content.' + (lang || 'english'),
		data: JSON.stringify(data)
	})
}


/**
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	// res.locals.navLinks = [
	// 	{ label: 'Jury', key: 'jury', href: '/jury' },
	// 	// { label: 'Academy', key: 'academy', href: '/academy' },
	// 	{ label: 'Voting', key: 'voting', href: '/voting' },
	// 	{ label: 'Archive', key: 'archive', href: '/archive' },
	// 	// { label: 'Partners', key: 'partners', href: '/partners', inDropdown: true },
	// 	{ label: 'Press', key: 'press', href: '/press', inDropdown: true },
	// 	{ label: 'Contact', key: 'contact', href: '/contact', inDropdown: true },
	// 	{ label: 'FAQ', key: 'faq', href: '/content/faq', inDropdown: true },
	// ];
	res.locals.user = req.user;
	res.locals.snippetEditable = snippetEditable
	async.each([
			cb => {
				keystone.list('Navlink').model.find().sort({sortOrder: 1})
				.exec((err, links) => {
					// console.log(links)
					res.locals.navLinks = links || []
					cb(err)
				})
			},
			cb => {
				keystone.list('Snippet').model.find()
				.exec((err, tbs) => {
					res.locals.snippets = {}
					tbs.forEach(tb => {
						res.locals.snippets[tb.slug] = tb
					})
					cb(err)
				})
			}
			,
			cb => {
				keystone.list('Partner').model.find().sort({sortOrder:1})
				.exec((err, ps) => {
					res.locals.partners = ps
					cb(err)
				})
			}
			,
			cb => {
				keystone.list('Content').model.findOne({slug: 'imprint-text'})
				.exec((err, c) => {
					res.locals.imprintText = c
					cb(err)
				})
			}
		],
		(fn, cb) => fn(cb),
		err => next(err)
	)
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error'),
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};
