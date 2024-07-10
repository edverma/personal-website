<script>
import "../app.css";
import Header from "../components/Header.svelte";
import {dev} from "$app/environment";
</script>

<head>
	{#if dev}
		<script defer data-domain="evanverma.com" src="https://plausible.io/js/script.js"></script>
	{/if}
</head>

<div class="flex">
	<div class="hidden md:block md:w-1/4"></div>
	<div class="p-4 w-full md:w-1/2">
		<Header/>
		<slot/>
	</div>
	<div class="hidden md:block md:w-1/4"></div>
</div>