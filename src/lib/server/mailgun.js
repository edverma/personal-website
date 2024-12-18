import { PERSONAL_SITE_MAILGUN, PERSONAL_SITE_DOMAIN_MAILGUN, PERSONAL_SITE_USERNAME_MAILGUN, TO_ADDRESS_MAILGUN } from '$env/static/private';
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailingListAddress = 'newsletter@m.evanverma.com';
const mailgun = new Mailgun(formData);
const client = mailgun.client({username: PERSONAL_SITE_USERNAME_MAILGUN, key: PERSONAL_SITE_MAILGUN});

export const sendNewsletter = async (subject, body) => {
	try {
		const res = await client.messages.create(PERSONAL_SITE_DOMAIN_MAILGUN, {
			from: `<${mailingListAddress}>`,
			to: TO_ADDRESS_MAILGUN,
			'h:Reply-To': mailingListAddress,
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

export const addMember = async (name, email) => {
	try {
		const res = await client.lists.members.createMember(
			mailingListAddress,
			{
				address: email,
				name: name,
				subscribed: 'yes',
				upsert: 'yes',
			}
		);
		console.log(res);
		return {success: true};
	} catch (err) {
		console.error(err);
		if (err.status === 400) {
			if (err.message.includes('already exists')) {
				throw new Error('This email is already subscribed to the newsletter.');
			}
			throw new Error('Invalid email address provided.');
		}
		if (err.status === 429) {
			throw new Error('Too many requests. Please try again later.');
		}
		throw new Error('An unexpected error occurred while subscribing.');
	}
}

export const getMembers = async () => {
	try {
		const res = await client.lists.members(PERSONAL_SITE_DOMAIN_MAILGUN);
		console.log(res);
		return res;
	} catch (err) {
		console.error(err);
		throw err;
	}
}