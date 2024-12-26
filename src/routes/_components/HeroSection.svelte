<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { ArrowRightIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
	import EventHighlight from './EventHighlight.svelte';

	let event = $derived.by(() => {
		return $page.data.events[0];
	});
</script>

<section class="flex justify-center py-[25vh]">
	<div class="container">
		<div class="flex flex-col gap-6xl text-center">
			{#if event != null}
				<EventHighlight name={event.name} href={`/events/${event.slug}`} status={event.status} />
			{/if}
			<h1 class="mx-auto max-w-3xl text-balance text-4xl lg:text-7xl">
				<!-- TODO Use $t() -->
				{$_('hero.title', { default: 'Show off your creative skills' })}
			</h1>
			<p class="max-w-3xl text-neutral-200 lg:text-xl">
				{$_('hero.description', {
					default:
						'Join our creative competition and showcase your talent. Let your imagination run wild and stand a chance to win exciting prizes.'
				})}
			</p>
			<div class="mt-8 flex items-center justify-center gap-4 sm:flex-row">
				<Button href="/submissions">{$_('enter_now', { default: 'Enter now' })}</Button>
				<Button variant="ghost">{$_('learn_more', { default: 'Learn more' })}</Button>
			</div>
		</div>
	</div>
</section>
