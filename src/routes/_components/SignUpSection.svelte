<script>
	import Button from '$lib/components/Button.svelte';
</script>

<section class="border-y border-shade-700 px-md py-8xl">
	<div class="mx-auto max-w-screen-md text-center">
		<h2 class="mb-xl text-4xl font-bold">Join The Community Today</h2>
		<p class="mb-3xl text-lg text-shade-300">
			Start sharing your creations with the world. Sign up now and get started in seconds.
		</p>

		<div class="mb-xl flex flex-col justify-center gap-md sm:flex-row">
			<input
				type="email"
				placeholder="Enter your email"
				class="max-w-screen-sm flex-grow rounded-form border border-shade-200 px-lg py-md"
				required
			/>
			<Button href="/register">Sign Up</Button>
		</div>

		<p class="text-sm text-shade-300">
			By signing up, you agree to our
			<a href="/terms" class="underline hover:text-primary">Terms & Conditions</a> and
			<a href="/privacy" class="underline hover:text-primary">Privacy Policy</a>.
		</p>
	</div>
</section>
