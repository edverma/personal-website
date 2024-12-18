<script>
    import marked from '$lib/marked.js';

    export let content = '';
    const htmlContent = marked(content);
</script>

<div class="ml-8 mt-8 text-right">
	{@html htmlContent}
</div>
