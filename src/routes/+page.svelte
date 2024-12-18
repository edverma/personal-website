<script>
	export let data;
	const posts = data.posts || [];

	let tag = 'news';
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
		<br/>
		<hr/>
		<br/>
		<div class="text-xl {tag === 'news' ? 'font-bold' : 'font-extralight'} text-left">
			<button class="text-black" on:click={() => tag = 'news'}>
				News
			</button>
		</div>
		<br/><br/>
		<div class="text-xl {tag === 'tech' ? 'font-bold' : 'font-extralight'} text-left">
			<button class="text-black" on:click={() => tag = 'tech'}>
				Tech
			</button>
		</div>

	</div>

	<div>
		{#each posts as post (post.id)}
			{#if post.tags.includes(tag)}
				<br/>
				<div class="text-xl font-extralight text-right">
					<a class="text-black" href="/{post.slug}"> {post.title}</a>
				</div>
				<br/>
			{/if}
		{/each}
	</div>
</div>
