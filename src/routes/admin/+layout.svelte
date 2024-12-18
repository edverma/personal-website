<script>
import {browser} from "$app/environment";
import {writable} from "svelte/store";
import {onMount} from "svelte";
import {goto} from "$app/navigation";

const localSecretStore = writable('');
let authn = false;

onMount(async () => {
    if (!browser) return;
    
    // Get secret from localStorage
    const secret = localStorage.getItem('secret');
    if (!secret) {
        goto('/');
        return;
    }
    
    // Set store value and attempt authentication
    localSecretStore.set(secret);
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
});
</script>

{#if authn}
    <slot/>
{/if}
