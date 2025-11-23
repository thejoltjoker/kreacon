<script>
	import Button from '$lib/components/Button.svelte';
	import { t } from '$lib/i18n';
</script>

<section class="w-full border-y border-shade-700 px-md py-8xl">
	<div class="mx-auto max-w-(--breakpoint-md) text-center">
		<h2 class="mb-xl text-4xl font-bold">{$t('Join the community today')}</h2>
		<p class="mb-3xl text-lg text-shade-300">
			{$t('Start sharing your creations with the world. Sign up now and get started in seconds.')}
		</p>

		<div class="mb-xl flex flex-col justify-center gap-md sm:flex-row">
			<input
				type="email"
				placeholder={$t('Enter your email')}
				class="max-w-(--breakpoint-sm) grow rounded-form border border-shade-200 px-lg py-md"
				required
			/>
			<Button href="/register">{$t('Sign up')}</Button>
		</div>

		<p class="text-sm text-shade-300">
			{$t('By signing up, you agree to our')}
			<a href="/terms-of-service" class="underline hover:text-primary">{$t('Terms & Conditions')}</a
			>
			{$t('and').toLowerCase()}
			<a href="/privacy-policy" class="underline hover:text-primary">{$t('Privacy Policy')}</a>.
		</p>
	</div>
</section>
