<script>
    import SvelteMarkdown from 'svelte-markdown'
    import MarkdownImageRenderer from '$lib/components/MarkdownImageRenderer.svelte'

    export let data;
    let source = data.post.content;
</script>

<svelte:head>
    <title>{data.post.title}</title>
    <meta name="description" content={data.post.description} />
</svelte:head>

<SvelteMarkdown {source} renderers={{ image: MarkdownImageRenderer }} />
