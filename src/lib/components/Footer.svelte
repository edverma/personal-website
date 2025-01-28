<script>
    import { page } from '$app/stores';
    import Subscribe from '$lib/components/Subscribe.svelte';

    function getRssFeed() {
        // Open RSS feed in new tab
        window.open('/rss.xml', '_blank');
    }
</script>

{#if $page.url.pathname !== '/'}
    <div class="flex justify-center items-center">
        <Subscribe footer={true}/>
    </div>
{/if}

<div class="text-center my-10 text-gray-500">
    <div class="flex justify-center items-center gap-2 mb-4">
        <button on:click={getRssFeed} class="hover:text-gray-400 flex items-center gap-2" title="RSS Feed">
            <span class="text-xs">RSS Feed</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 13.1z"/>
            </svg>
        </button>
    </div>
    <p class="text-xs break-all"><a href="https://primal.net/edverma" target="_blank" rel="noopener noreferrer">npub18hwy8hmnwk2t66qj3mxjqkkekcwk2p0hde5h6fm74zujtyvxk95qd6xcwr</a></p>
</div>