<script lang="ts">
	import { createSeparator, melt, type CreateSeparatorProps } from '@melt-ui/svelte';
	export let color: 'white' | 'black' = 'white';
	const {
		elements: { root: horizontal }
	} = createSeparator({
		orientation: 'horizontal',
		decorative: true
	});
</script>

<div
	use:melt={$horizontal}
	class="h-[1px] w-full"
	class:bg-white={color === 'white'}
	class:bg-black={color === 'black'}
/>
