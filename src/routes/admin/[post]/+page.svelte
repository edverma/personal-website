<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
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
        const formData = new FormData();
        formData.append('secret', secret);
        formData.append('title', title);
        formData.append('content', content);
        await fetch(`/admin/${post.slug}?/sendEmail`, {
            method: 'POST',
            body: formData
        });
    }

    async function deletePost() {
        if (confirm('Are you sure you want to delete this post?')) {
            const formData = new FormData();
            formData.append('secret', secret);
            await fetch(`/admin/${post.slug}?/delete`, {
                method: 'POST',
                body: formData
            });
            // Redirect to admin page after deletion
            window.location.href = '/admin';
        }
    }
</script>

{#if showPreview}
    <Preview source={content} bind:showPreview={showPreview} />
{:else}

<h1>Edit Post</h1>

<form action={`/admin/${post.slug}?/update`} method="POST">
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
    {#if !post.email_sent}
        <button type="button" on:click={sendEmail} class="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600">Send Email</button>
    {/if}
</form>

{/if}