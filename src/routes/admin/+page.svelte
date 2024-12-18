<script>
    export let data;

    let posts = data.posts;
    console.log(posts);
</script>

<h1>Admin</h1>

<ul>
    <button on:click={() => window.location.href='/admin/new-post'} type="button" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create New Post</button>
    
    {#each posts as post (post.id)}
        <li><a href={`/admin/${post.slug}`}>{post.title}</a></li>
    {/each}
</ul>