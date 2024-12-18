<script>
	export let data;
	const posts = data.posts;
</script>

<div class="grid grid-cols-2">
	<div>
		<div class="text-xl font-extralight text-left">
			<a class="text-black" href="/about"> About</a>
		</div>
		<br/><br/>
		<div class="text-xl font-extralight text-left">
			<a class="text-black" href="/subscribe">Subscribe</a>
		</div>
	</div>

	<div>
		<br/>
		{#if posts}
			{#each posts as post (post.id)}
				<div class="text-xl font-extralight text-right">
					<a class="text-black" href="/{post.slug}"> {post.title}</a>
				</div>
				<br/>
			{/each}
		{/if}
	</div>
</div>
