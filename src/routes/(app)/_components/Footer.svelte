<script lang="ts">
	import { t } from '$lib/i18n';
	import { locales } from '$lib/i18n/locales';
	import { locale } from 'svelte-i18n';

	const changeLanguage = (lang: string) => {
		locale.set(lang);
	};

	$effect(() => {
		localStorage.setItem('locale', $locale ?? 'en');
	});
</script>

<footer class="mt-xl flex w-full flex-wrap items-center justify-between px-xl py-xl text-shade-300">
	<p class="flex-1">Kreacon &copy; {new Date().getFullYear()}</p>
	<ul class="flex flex-1 items-center justify-center gap-sm">
		{#each Object.keys(locales) as lc}
			<li>
				<button onclick={() => changeLanguage(lc)} class:active={$locale?.startsWith(lc)}>
					{lc.toUpperCase()}
				</button>
			</li>
		{/each}
	</ul>
	<ul class="flex flex-1 justify-end gap-sm">
		<li><a href="/events/rules">{$t('Rules')}</a></li>
		<li><a href="/events/privacy">{$t('Privacy')}</a></li>
		<li><a href="/events/terms">{$t('Terms')}</a></li>
	</ul>
</footer>

<style lang="postcss">
	a,
	button {
		@apply text-shade-300 hover:text-primary;

		&.active {
			@apply text-white;
		}
	}
</style>
