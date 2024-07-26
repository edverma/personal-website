<script>
import "../app.css";
import Header from "../components/Header.svelte";
import {browser, dev} from "$app/environment";
import {writable} from "svelte/store";

let authn = false;
const localSecretStore = writable('');
if (browser) {
	localSecretStore.set(localStorage.getItem('secret'));
}
localSecretStore.subscribe(async value => {
	if (browser) {
		let data = new FormData();
		data.append('secret', value)
		const res = await fetch(`?/authn`, {
			method: 'POST',
			body: data
		})
		const readRes = await res.body.getReader().read()
		authn = JSON.parse(JSON.parse(new TextDecoder().decode(readRes.value)).data)[1]
	}
});
</script>

<head>
	<meta name=”robots” content=”noindex”>

	{#if !dev}
		<script defer data-domain="evanverma.com" src="https://plausible.io/js/script.js"></script>
	{/if}
</head>

{#if authn}
	<div class="flex">
		<div class="hidden md:block md:w-1/4"></div>
		<div class="p-4 w-full md:w-1/2">
			<Header/>
			<slot/>
		</div>
		<div class="hidden md:block md:w-1/4"></div>
	</div>
{/if}