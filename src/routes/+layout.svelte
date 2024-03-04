<script>
import "../app.css";
import Header from "../components/Header.svelte";
import { inject } from '@vercel/analytics'
import {dev} from "$app/environment";

inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="flex">
	<div class="hidden md:block md:w-1/4"></div>
	<div class="p-4 w-full md:w-1/2">
		<Header/>
		<slot/>
	</div>
	<div class="hidden md:block md:w-1/4"></div>
</div>