<script>
export const prerender = true;
import "../app.css";
import Header from "$lib/components/Header.svelte";
import {dev} from "$app/environment";
</script>

<head>
	<meta name=”robots” content=”noindex”>

	{#if !dev}
	<script defer data-domain="evanverma.com" src="https://plausible.southernsoftwaresolutions.com/js/script.js"></script>
	{/if}
</head>


<div class="flex max-w-screen-xl mx-auto my-8">
	<div class="p-4 w-11/12 md:w-9/12 mx-auto">
		<Header/>
		<slot/>
	</div>
</div>
