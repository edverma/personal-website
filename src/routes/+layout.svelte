<script>
import "../app.css";
import Header from "$lib/components/Header.svelte";
import Footer from "$lib/components/Footer.svelte";
import {dev} from "$app/environment";

// Add dark mode handling
let darkMode = false;

// Check for system dark mode preference and saved preference on mount
import { onMount } from 'svelte';

onMount(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        darkMode = true;
        document.documentElement.classList.add('dark');
    } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Check system preference if no saved preference
        darkMode = true;
        document.documentElement.classList.add('dark');
    }
});

// Toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark');
}
</script>

<head>
	<meta name=”robots” content=”noindex”>

	{#if !dev}
	<script defer data-domain="evanverma.com" src="https://plausible.southernsoftwaresolutions.com/js/script.js"></script>
	{/if}
</head>


<div class="flex max-w-screen-xl mx-auto my-8 min-h-[80vh]">
	<div class="p-4 w-11/12 md:w-9/12 mx-auto">
		<Header/>
		<button 
			on:click={toggleDarkMode}
			class="fixed top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700"
			aria-label="Toggle dark mode"
		>
			{#if darkMode}
				🌙
			{:else}
				☀️
			{/if}
		</button>
		<slot/>

			<div class="sticky top-[80vh]">
				<hr/>
				<Footer/>
			</div>

	</div>
</div>

