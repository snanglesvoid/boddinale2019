const keystone = require('keystone');
const Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {
	var newEnqury = new Enquiry.model();
	var updater = newEnqury.getUpdateHandler(req);

	console.log('api/contact, req.body = ', req.body);

	updater.process(req.body, {
		flashErrors: false,
		fields: 'name, email, enquiryType, message',
		errorMessage: 'There was a problem submitting your enquiry:',
	}, function (err) {
		if (err) {
			res.status(500).send(err);
		} else {
			res.json('Your enquiry was submitted');
		}
	});
};


