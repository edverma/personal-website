<script>
import {browser} from "$app/environment";
import {writable} from "svelte/store";
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
        const formData = new FormData();
        formData.append('secret', secret);
        
        const res = await fetch(`/admin?/authn`, {
            method: 'POST',
            body: formData
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
