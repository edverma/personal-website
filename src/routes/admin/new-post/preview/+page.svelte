<script>
    import SvelteMarkdown from 'svelte-markdown'
    import { browser } from '$app/environment'
    import MarkdownImageRenderer from '$lib/components/MarkdownImageRenderer.svelte'
    let source = '';

    $: if (browser) {
        source = localStorage.getItem('newpost_content') || '';
    }
</script>

<SvelteMarkdown {source} renderers={{ image: MarkdownImageRenderer }} />
