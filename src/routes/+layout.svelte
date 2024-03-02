<script>
import "../app.css";
import Header from "../components/Header.svelte";
</script>

<style lang="postcss">
	:global(body) {
		@apply bg-pink-50;
	}
</style>

<div class="p-4">
	<Header/>
	<slot/>
</div>