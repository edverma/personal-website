import { PERSONAL_SITE_MAILGUN, PERSONAL_SITE_DOMAIN_MAILGUN, PERSONAL_SITE_USERNAME_MAILGUN, TO_ADDRESS_MAILGUN } from '$env/static/private';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: PERSONAL_SITE_USERNAME_MAILGUN, key: PERSONAL_SITE_MAILGUN});

export const sendNewsletter = async (subject, body) => {
	try {
		const res = await client.messages.create(PERSONAL_SITE_DOMAIN_MAILGUN, {
			from: '<newsletter@evanverma.com>',
			to: TO_ADDRESS_MAILGUN,
			'h:Reply-To': 'newsletter@m.evanverma.com',
			subject: subject,
			html: body
		});
		console.log(res);
		return res;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

export const addMember = (name, email) => {
	client.lists.create({
		address: email,
		name: name
	})
		.then(data => console.log(data))
		.catch(err => console.error(err));
}
