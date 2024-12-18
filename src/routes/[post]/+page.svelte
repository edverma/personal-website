<script>
    export let data;
    let source = data.post.content;
</script>

<svelte:head>
    <title>{data.post.title}</title>
    <meta name="description" content={data.post.description} />
</svelte:head>

{@html data.post.content}