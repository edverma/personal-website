<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
</svelte:head>

<script>
    import marked from '$lib/marked';
    export let source = '';
    export let showPreview = false;

    const htmlContent = marked(source);
</script>

<div class="relative">
    <button 
        class="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-gray-600 hover:text-gray-800" 
        on:click={() => showPreview = false}
    >
        <span class="text-sm font-medium">Close</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
    </button>
    {@html htmlContent}
</div>
