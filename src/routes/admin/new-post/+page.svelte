<script>
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import Preview from "$lib/components/Preview.svelte";

    let title = '';
    let tags = '';
    let description = '';
    let content = '';
    let secret = '';
    let img_src = '';

    let showPreview = false;

    function togglePreview() {
        showPreview = !showPreview;
    }

    onMount(() => {
        if (browser) {
            // Load initial values from localStorage or set default values
            title = localStorage.getItem('newpost_title') || '';
            tags = localStorage.getItem('newpost_tags') || '';
            description = localStorage.getItem('newpost_description') || '';
            content = localStorage.getItem('newpost_content') || '';
            secret = localStorage.getItem('secret') || '';
            img_src = localStorage.getItem('newpost_img_src') || '';

            // Ensure keys are created in localStorage
            localStorage.setItem('newpost_title', title);
            localStorage.setItem('newpost_tags', tags);
            localStorage.setItem('newpost_description', description);
            localStorage.setItem('newpost_content', content);
            localStorage.setItem('newpost_img_src', img_src);
        }
    });

    $: if (browser) {
        if (title) {    
            localStorage.setItem('newpost_title', title);
        }
        if (tags) {
            localStorage.setItem('newpost_tags', tags);
        }
        if (description) {
            localStorage.setItem('newpost_description', description);
        }
        if (content) {
            localStorage.setItem('newpost_content', content);
        }
        if (img_src) {
            localStorage.setItem('newpost_img_src', img_src);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        
        const payload = {
            title,
            tags,
            description,
            content,
            secret,
            img_src
        };

        try {
            const response = await fetch('/api/admin/new-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            // Clear form or redirect after successful submission
            // window.location.href = '/admin'; // Uncomment to redirect
        } catch (error) {
            console.error('Error creating post:', error);
            // Handle error (show message to user, etc.)
        }
    }
</script>

{#if showPreview}
    <Preview source={content} bind:showPreview={showPreview} />
{:else}

<h1>Create New Post</h1>

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
    </div>
</form>
{/if}
