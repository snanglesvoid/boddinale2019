/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
	api: importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function (app) {
	// Views
	app.get('/', routes.views.index)
	
	app.get('/movie/:slug', routes.views.movie)
	app.get('/archive', routes.views.archive)
	app.get('/content/:slug', routes.views.content)
	app.get('/jury', routes.views.jury)
	app.get('/partners', routes.views.partners)
	app.get('/press', routes.views.press)
	app.get('/academy', routes.views.academy)
	app.get('/voting', routes.views.voting)
	app.get('/workshop/:slug', routes.views.workshop)
	app.get('/day/:day', routes.views.day)
	app.all('/contact', routes.views.contact)
	app.get('/api/movies', routes.api.movies)
	app.get('/api/archive', routes.api.archive)
	app.get('/api/vote', routes.api.vote)
	app.get('/api/contents', routes.api.contents)
	app.get('/api/snippets', routes.api.snippets)
	app.get('/api/presslinks', routes.api.presslinks)
	app.get('/api/partners', routes.api.partners)
	app.get('/api/jury', routes.api.jury)
	app.all('/admin/upload', middleware.requireUser, routes.views.admin.upload)
	app.get('/admin/update-categories', middleware.requireUser, routes.views.admin['update-categories'])
	// app.get('/api/l')

	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
