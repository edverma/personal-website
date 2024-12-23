<script>
import {browser} from "$app/environment";
import {onMount} from "svelte";
import {goto} from "$app/navigation";

let authn = false;

onMount(async () => {
if (browser) {
    
    // Get secret from localStorage
    const secret = localStorage.getItem('secret');
    if (!secret) {
        goto('/');
    }

    try {
        const res = await fetch(`/api/authn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ secret })
        });
        
        authn = res.ok;
        if (!authn) {
            goto('/');
        }
    } catch (error) {
        console.error('Authentication error:', error);
        goto('/');
    }
}
});
</script>

{#if authn}
    <slot/>
{/if}
