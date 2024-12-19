<script>
    import marked from '$lib/marked.js';

    export let content = '';
    const htmlContent = marked(content);
</script>

<div class="ml-8 mt-[-2rem] text-right">
	{@html htmlContent}
</div>
