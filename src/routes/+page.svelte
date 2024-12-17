<script>
	export let data;
	const posts = data.posts;
</script>

{#if posts}
	{#each posts as post (post.id)}
		<div class="text-xl font-extralight text-right">
 			<a class="text-black" href="./{post.slug}"> {post.title}</a>
		</div>
		<br/>
	{/each}
{/if}