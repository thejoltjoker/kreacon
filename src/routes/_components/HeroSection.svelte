<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/Button.svelte';
	import { _ } from 'svelte-i18n';
	import EventHighlight from './EventHighlight.svelte';
	import { getEventStatus } from '$lib/helpers/eventStatus';
	import { fade, fly } from 'svelte/transition';

	let event = $derived.by(() => {
		return $page.data.events[0];
	});

	let mounted = $state(false);
	$effect(() => {
		mounted = true;
	});
</script>

{#if mounted}
	<section
		class="flex justify-center pb-[6vh] pt-[18vh]"
		transition:fade={{ delay: 100, duration: 500 }}
	>
		<div class="container">
			<div class="flex flex-col gap-6xl text-center">
				{#if event != null}
					<EventHighlight
						name={event.name}
						href={`/events/${event.slug}`}
						status={getEventStatus(event)}
					/>
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
{/if}
