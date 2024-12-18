<script>
import {browser} from "$app/environment";
import {writable} from "svelte/store";
import {onMount} from "svelte";

let authn = false;
onMount(() => {
    const localSecretStore = writable('');
    if (browser) {
        localSecretStore.set(localStorage.getItem('secret'));
        
        localSecretStore.subscribe(async value => {
            if (browser) {
                let data = new FormData();
                data.append('secret', value);
                const res = await fetch(`/admin?/authn`, {
                    method: 'POST',
                    body: data
                });
                authn = res.ok;
                if (!authn) {
                    window.location.href = '/';
                }
            }
        });
    }
});
</script>

{#if authn}
    <slot/>
{/if}
