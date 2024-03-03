<script>
	import {page} from "$app/stores";
	import snarkdown from "snarkdown";
	import {browser} from "$app/environment";
	import {writable} from "svelte/store";

	export let data;
	const text = snarkdown(data.text);

	const sendNewsletter = () => {
		const emailText = text.replaceAll('../images/', 'https://evanverma.com/images/');


		let data = new FormData();
		data.append('subject', `Weekly Newsletter - ${$page.params.slug}`);
		data.append('body', emailText);

		fetch(`/posts/${$page.params.slug}?/sendNewsletter`, {
			method: 'POST',
			body: data
		})
	}

	let authn = false;
	if (browser) {
		const localSecretStore = writable(localStorage.getItem('secret'));
		localSecretStore.subscribe(async value => {
			let data = new FormData();
			data.append('secret', value)
			const res = await fetch(`/posts/${$page.params.slug}?/authn`, {
				method: 'POST',
				body: data
			})
			const readRes = await res.body.getReader().read()
			authn = JSON.parse(JSON.parse(new TextDecoder().decode(readRes.value)).data)[1]
		});
	}
</script>

{#if authn === true}
	<div class="text-right pb-4">
		<button class="text-blue-400" on:click={sendNewsletter}>Send Newsletter</button>
	</div>
{/if}

<div>
	{@html text}
</div>