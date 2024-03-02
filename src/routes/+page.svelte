<script>
	import Header from "../components/Header.svelte";

	export let data;
	const posts = data.posts;
</script>

{#if posts}
	{#each posts as post (post.id)}
		<div class="text-lg font-extralight text-right">
			<a class="text-black" href="./posts/{post.name}"> {post.displayName}</a>
		</div>
		<br/>
	{/each}
{/if}