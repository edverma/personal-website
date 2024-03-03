import {sendNewsletter} from "$lib/server/mailgun.js";

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({request}) => {
		const data = await request.formData();

		// TODO: add auth
		//  sendNewsletter(data.get('subject'), data.get('body'));
	}
};
