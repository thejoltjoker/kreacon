<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';
	import { UserRoundIcon } from 'lucide-svelte';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let imageUrl: string;
	$: console.log('Avatar:imageUrl', imageUrl);

	const {
		elements: { image, fallback }
	} = createAvatar({
		src: imageUrl
	});
</script>

<div
	class="flex aspect-square items-center justify-center rounded-full border border-white bg-zinc-800"
	class:size-button={size === 'sm'}
	class:size-64={size === 'lg'}
>
	<img use:melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
	<span use:melt={$fallback} class="text-3xl font-medium text-zinc-200">
		<UserRoundIcon class="size-6" />
	</span>
</div>

<style lang="postcss">
</style>
