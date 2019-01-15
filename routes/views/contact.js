var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var http = require('http')
var querystring = require('querystring');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		let token = req.body.token
		console.log(token)


		var post_data = querystring.stringify({
			secret: '6LfIEooUAAAAANek286UrfA9bMuugyuWZLh0apTL',
			response: token
		});

		var post_options = {
			host: 'https://www.google.com',
			port: '80',
			path: '/recaptcha/api/siteverify',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': Buffer.byteLength(post_data)
			}
		};

		var post_req = http.request(post_options, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				console.log('Response: ' + chunk);
			});
		});
	  
		// post the data
		post_req.write(post_data);
		post_req.end();


		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				console.log(err)
				locals.validationErrors.errors = err.detail;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('contact');
};
