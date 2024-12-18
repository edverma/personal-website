<script>
    import { enhance } from '$app/forms';

    /** @type {import('./$types').LayoutData} */
    export let data;

    // No need for 'form' unless you're handling form errors
</script>

{#if data.authenticated}
    <div class="p-4">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">Admin Panel</h1>
            <form method="POST" action="?/signout" use:enhance>
                <button type="submit" 
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500">
                    Sign Out
                </button>
            </form>
        </div>
        <slot/>
    </div>
{:else}
    <form 
        method="POST" 
        action="?/authn" 
        use:enhance
        class="flex flex-col gap-4 max-w-md mx-auto mt-8"
    >
        <input 
            type="password"
            name="secret"
            placeholder="Enter secret"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
        >
        {#if data?.error}
            <p class="text-red-500 text-sm">{data.error}</p>
        {/if}
        <button 
            type="submit"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            Sign In
        </button>
    </form>
{/if}
