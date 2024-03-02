<script>
import "../app.css";
import Header from "../components/Header.svelte";
</script>

<style lang="postcss">
	:global(body) {
		@apply bg-pink-50;
	}
</style>
<div class="flex">
<div class="hidden md:block md:w-1/4"></div>
<div class="p-4 w-full md:w-1/2">
	<Header/>
	<slot/>
</div>
<div class="hidden md:block md:w-1/4"></div>
	</div>