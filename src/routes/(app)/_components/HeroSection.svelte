<script>
	import BitsButton from '$lib/components/BitsButton.svelte';
	import Button from '$lib/components/Button.svelte';
	import { ArrowRightIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
</script>

<section class="flex justify-center py-32">
	<div class="container">
		<div class="flex flex-col gap-4 text-center">
			<a
				href="/"
				class="mx-auto inline-flex items-center gap-3 rounded-full border px-2 py-1.5 text-sm"
				><div
					class="focus:ring-ring inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-black transition-colors hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2"
				>
					CURRENT EVENT
				</div>
				Kreacon Winter 2025
				<span class="flex size-5 items-center justify-center">
					<ArrowRightIcon class="size-5" />
				</span></a
			>
			<h1 class="mx-auto mt-4 max-w-3xl text-balance text-4xl font-semibold lg:mb-7 lg:text-7xl">
				{$_('hero.title', { default: 'Show off your creative skills' })}
			</h1>
			<p class="m mx-auto max-w-3xl text-neutral-200 lg:text-xl">
				{$_('hero.description', {
					default:
						'Join our creative competition and showcase your talent. Let your imagination run wild and stand a chance to win exciting prizes.'
				})}
			</p>
			<div class="mt-8 flex items-center justify-center gap-4 sm:flex-row">
				<Button>{$_('enter_now', { default: 'Enter now' })}</Button>
				<Button variant="ghost">{$_('learn_more', { default: 'Learn more' })}</Button>
			</div>
		</div>
	</div>
</section>
