<script>
	import Subscribe from "$lib/components/Subscribe.svelte";
	import About from "$lib/components/About.svelte";
	import {page} from '$app/stores';

	export let data;
	const posts = data.posts || [];
	const aboutPost = data.aboutPost || {};
	const dbTags = data.dbTags || [];
	let tag = $page.url.searchParams.get('tag') || 'news';
</script>

<div class="grid grid-cols-2">
	<div>
		<div class="text-xl {tag === 'about' ? 'font-bold' : 'font-extralight'} text-left">
			<button class="text-black" on:click={() => tag = 'about'}>
				About
			</button>
		</div>
		<br/><br/>
		<div class="text-xl {tag === 'subscribe' ? 'font-bold' : 'font-extralight'} text-left">
			<button class="text-black" on:click={() => tag = 'subscribe'}>
				Subscribe
			</button>
		</div>
		<br/>
		<hr/>
		{#each dbTags as dbTag (dbTag.id)}
			{#if dbTag.slug !== 'about'}
				<br/>
				<div class="text-xl {tag === dbTag.slug ? 'font-bold' : 'font-extralight'} text-left">
					<button class="text-black" on:click={() => tag = dbTag.slug}>
						{dbTag.name}
					</button>
				</div>
				<br/>
			{/if}
		{/each}
	</div>

	<div>
		{#if tag === 'subscribe'}
		<Subscribe/>
		{:else if tag === 'about'}
			<About content={aboutPost.content}/>
		{:else}
			{#each posts as post (post.id)}
				{#if post.tags.includes(tag)}
					<br/>
					<div class="text-xl font-extralight text-right">
						<a class="text-black" href="/{post.slug}"> {post.title}</a>
					</div>
					<br/>
				{/if}
			{/each}
		{/if}
	</div>
</div>