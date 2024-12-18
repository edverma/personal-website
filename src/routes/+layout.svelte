<script>
import "../app.css";
import Header from "$lib/components/Header.svelte";
import {dev} from "$app/environment";
</script>

<head>
	<meta name=”robots” content=”noindex”>

	{#if !dev}
		<script defer data-domain="evanverma.com" src="https://plausible.io/js/script.js"></script>
	{/if}
</head>


<div class="flex">
	<div class="p-4 w-11/12 md:w-9/12 mx-auto">
		<Header/>
		<slot/>
	</div>
</div>
