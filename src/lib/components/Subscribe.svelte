<script>
	export let footer = false;

	let errorMessage = '';
	let successMessage = '';

	async function handleSubmit(event) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';
		const form = event.target;
		const formData = new FormData(form);
		const email = formData.get('email');
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailPattern.test(email)) {
			errorMessage = 'Invalid email format. Please enter a valid email address.';
			return;
		}

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: formData.get('name'),
					email: formData.get('email')
				})
			});

			const result = await response.json();
			console.log('result: ', result);

			if (result.success === true) {
				successMessage = 'Thank you for subscribing!';
			} else {
				errorMessage = result.error || 'Failed to subscribe. Please try again.';
			}

		} catch (error) {
			errorMessage = 'An error occurred while subscribing. Please try again.';
			console.error(error);
		}
	}
</script>

<form class="{footer ? '' : 'max-w-md ml-8'} mt-8 {footer ? 'flex flex-row items-center gap-4' : ''}" on:submit={handleSubmit}>
	<div class="{footer ? 'flex-1' : 'mb-4'}">
		<label class="block text-gray-700 dark:text-white text-sm font-bold mb-2" for="name">
			Name
		</label>
		<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" name="name" type="text" placeholder="{footer ? 'Name' : 'Your name'}" required>
	</div>
	<div class="{footer ? 'flex-1' : 'mb-4'}">
		<label class="block text-gray-700 dark:text-white text-sm font-bold mb-2" for="email">
			Email
		</label>
		<input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" name="email" type="email" placeholder="{footer ? 'Email' : 'Your email'}" required>
	</div>
	<div class="{footer ? 'self-end' : 'flex items-end justify-end'}">
		<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
			Subscribe
		</button>
	</div>
	{#if errorMessage}
		<div class="text-red-500 text-sm mt-4">
			{errorMessage}
		</div>
	{/if}
	{#if successMessage}
		<div class="text-green-500 text-sm mt-4">
			{successMessage}
		</div>
	{/if}
</form>
