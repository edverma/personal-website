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

<svelte:head>
	<link rel="sitemap" type="application/xml" href="/sitemap.xml"/>
	<link rel="alternate" type="application/rss+xml" href="/rss.xml"/>
	<title>Evan's Weekly Newsletter | Tech, Software, and Personal Updates</title>
	<meta name="description" content="Join Evan's Weekly Newsletter for insights on software development, technology trends, and personal updates. Subscribe for regular articles on tech, coding, and more." />
	<meta property="og:title" content="Evan's Weekly Newsletter | Tech, Software, and Personal Updates" />
	<meta property="og:description" content="Join Evan's Weekly Newsletter for insights on software development, technology trends, and personal updates." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://evanverma.com" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Evan's Weekly Newsletter" />
	<meta name="twitter:description" content="Tech insights, software development, and personal updates from Evan." />
</svelte:head>

<div class="grid grid-cols-2">
	<div>
		<div class="text-xl {tag === 'about' ? 'font-bold' : 'font-extralight'} text-left">
			<button class="" on:click={() => tag = 'about'}>
				About
			</button>
		</div>
		<br/><br/>
		<div class="text-xl {tag === 'subscribe' ? 'font-bold' : 'font-extralight'} text-left">
			<button class="" on:click={() => tag = 'subscribe'}>
				Subscribe
			</button>
		</div>
		<br/>
		<hr/>
		{#each dbTags as dbTag (dbTag.id)}
			{#if dbTag.slug !== 'about'}
				<br/>
				<div class="text-xl {tag === dbTag.slug ? 'font-bold' : 'font-extralight'} text-left">
					<button class="" on:click={() => tag = dbTag.slug}>
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
						<a class="" href="/{post.slug}"> {post.title}</a>
					</div>
					<br/>
				{/if}
			{/each}
		{/if}
	</div>
</div>