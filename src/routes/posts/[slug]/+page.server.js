import {sendNewsletter} from "$lib/server/mailgun.js";
import { SECRET } from '$env/static/private';

/** @type {import('./$types').Actions} */
export const actions = {
	sendNewsletter: async ({request}) => {
		const data = await request.formData();
		sendNewsletter(data.get('subject'), data.get('body'));
	},
	authn: async({request}) => {
		const data = await request.formData();

		const reqSecret = data.get('secret')
		if (reqSecret === SECRET) {
			return {authn: true};
		}
		return {authn: false};
	}
};
