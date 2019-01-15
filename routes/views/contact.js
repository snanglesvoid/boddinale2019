var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var request = require('request')

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
		request.post({
			url: 'https://www.google.com/recaptcha/api/siteverify',
			formData: {
				secret: '6LfIEooUAAAAANek286UrfA9bMuugyuWZLh0apTL',
				response: token

			}
		}, function(err, res, body) {
			if (err) console.error(err)
			else console.log(body)
			// if (!err && res.statusCode === 200) {
			// 	funcTwo(body, function(err, output) {
			// 		console.log(err, output);
			// 	});
			// }
		});


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
