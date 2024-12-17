<script>
    import SvelteMarkdown from 'svelte-markdown'
    import MarkdownImageRenderer from '$lib/components/MarkdownImageRenderer.svelte'

    export let data;
    let source = data.post.content;
</script>

<SvelteMarkdown {source} renderers={{ image: MarkdownImageRenderer }} />
