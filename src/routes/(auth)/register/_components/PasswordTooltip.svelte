<script lang="ts">
	import { createTooltip, melt } from '@melt-ui/svelte';
	import { Plus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import PasswordValidationInfo from './PasswordValidationInfo.svelte';

	const {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip({
		positioning: {
			placement: 'top'
		},
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		forceVisible: true,
		defaultOpen: true
	});
</script>

<button type="button" class="trigger" use:melt={$trigger} aria-label="Add">
	<Plus class="size-4" aria-label="plus" />
</button>

<!-- {#if $open} -->
<div
	use:melt={$content}
	transition:fade={{ duration: 100 }}
	class="z-50 flex flex-col gap-sm rounded-md bg-white p-sm text-black"
>
	<div use:melt={$arrow} />

	<PasswordValidationInfo validationErrorPaths={['too_small', 'special', 'number', 'common']} />
</div>

<!-- {/if} -->

<style lang="postcss">
	.trigger {
		@apply inline-flex h-9 w-9 items-center justify-center rounded-full bg-white;
		@apply text-blue-900 transition-colors hover:bg-white/90;
		@apply focus-visible:ring focus-visible:ring-blue-400 focus-visible:ring-offset-2;
		@apply p-0 text-sm font-medium;
	}
</style>
