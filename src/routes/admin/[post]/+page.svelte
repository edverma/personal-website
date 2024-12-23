<script>
    import { browser } from "$app/environment";
    import Preview from '$lib/components/Preview.svelte';
    export let data;
    let post = data.post;

    let title = post.title;
    let tags = post.tags;
    let description = post.description;
    let content = post.content;
    let img_src = post.img_src;
    let slug = post.slug;
    let secret = '';
    if (browser) {
        secret = localStorage.getItem('secret') || '';
    }

    let showPreview = false;

    function togglePreview() {
        showPreview = !showPreview;
    }

    async function sendEmail() {
        const response = await fetch(`/api/admin/posts/${post.slug}/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Secret': secret },
            body: JSON.stringify({
                title,
                content
            })
        });
        
        if (!response.ok) {
            alert('Failed to send email');
        }
    }

    async function publishLongFormNote() {
        const response = await fetch(`/api/admin/posts/${post.slug}/nostr`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Secret': secret },
            body: JSON.stringify({
                title,
                content,
                description,
                img_src,
                created_at: post.created_at
            })
        });

        if (!response.ok) {
            alert('Failed to publish to Nostr');
        }
    }

    async function deletePost() {
        if (confirm('Are you sure you want to delete this post?')) {
            const response = await fetch(`/api/admin/posts/${post.slug}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'X-Secret': secret },
            });

            const result = await response.json();
            if (result.success === true) {
                window.location.href = '/admin';
            } else {
                alert('Failed to delete post');
            }
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch(`/api/admin/posts/${post.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Secret': secret },
            body: JSON.stringify({
                title,
                tags,
                description,
                img_src,
                content,
                slug
            })
        });

        const result = await response.json();
        if (result.success === true) {
            window.location.href = '/admin';
        } else {
            alert('Failed to update post');
        }
    }
</script>

{#if showPreview}
    <Preview source={content} bind:showPreview={showPreview} />
{:else}

<h1>Edit Post</h1>

<form on:submit={handleSubmit}>
    <div class="mb-4">
        <label for="title" class="block text-sm font-medium text-gray-700 dark:text-white">Title</label>
        <input type="text" id="title" name="title" bind:value={title} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div class="mb-4">
        <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-white">Tags</label>
        <input type="text" id="tags" name="tags" bind:value={tags} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div class="mb-4">
        <label for="slug" class="block text-sm font-medium text-gray-700 dark:text-white">Slug</label>
        <input type="text" id="slug" name="slug" bind:value={slug} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div class="mb-4">
        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-white">Description</label>
        <textarea id="description" name="description" bind:value={description} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
    </div>
    <div class="mb-4">
        <label for="img_src" class="block text-sm font-medium text-gray-700 dark:text-white">Image Source</label>
        <input type="text" id="img_src" name="img_src" bind:value={img_src} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
    </div>
    <div class="mb-4">
        <label for="content" class="block text-sm font-medium text-gray-700 dark:text-white">Content</label>
        <textarea id="content" name="content" bind:value={content} class="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
    </div>
    <input type="hidden" name="secret" value={secret} />
    <div class="flex gap-4">
        <button type="submit" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
        <button type="button" on:click={togglePreview} class="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
            {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
        <button type="button" on:click={deletePost} class="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Delete Post</button>
    </div>

    <br>
    <div class="flex gap-4">
        {#if !post.email_sent}
            <button type="button" on:click={sendEmail} class="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Send Email</button>
        {/if}
        <button type="button" on:click={publishLongFormNote} class="rounded-md bg-pink-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600">Publish to Nostr</button>

    </div>
</form>

{/if}