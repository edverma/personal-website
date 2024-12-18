<script>
import {browser} from "$app/environment";
import {writable} from "svelte/store";
import {onMount} from "svelte";
import {goto} from "$app/navigation";

const localSecretStore = writable('');
let authn = false;

onMount(() => {
    if (browser) {
        const secret = localStorage.getItem('secret');
        if (!secret) {
            goto('/');
            return;
        }
        localSecretStore.set(secret);
    }
    
    localSecretStore.subscribe(async value => {
        if (!browser || !value) return;
        
        try {
            const formData = new FormData();
            formData.append('secret', value);
            
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
});
</script>

{#if authn}
    <slot/>
{/if}
