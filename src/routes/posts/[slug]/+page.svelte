<script>
	import {page} from "$app/stores";
	import snarkdown from "snarkdown";

	export let data;
	const text = snarkdown(data.text);

	const sendNewsletter = () => {
		const emailText = text.replaceAll('../images/', 'https://evanverma.com/images/');


		let data = new FormData();
		data.append('subject', `Weekly Newsletter - ${$page.params.slug}`);
		data.append('body', emailText);

		fetch(`/posts/${$page.params.slug}`, {
			method: 'POST',
			body: data
		})
	}
</script>

// TODO: add subscribe form
<div class="hidden text-right pb-4">
	<button class="text-blue-400" on:click={sendNewsletter}>Send Newsletter</button>
</div>

<div>
	{@html text}
</div>