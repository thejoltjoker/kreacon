<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';
	let imageUrl: string;
	let fallbackString: string;

	export { imageUrl as image };
	export { fallbackString as fallback };
	import { UserRoundIcon } from 'lucide-svelte';

	const {
		elements: { image, fallback }
	} = createAvatar({
		src: imageUrl
	});
</script>

<div
	class="flex h-button w-button items-center justify-center rounded-full border border-white bg-zinc-800"
>
	<img use:melt={$image} alt="Avatar" class="h-full w-full rounded-[inherit]" />
	<span use:melt={$fallback} class="text-3xl font-medium text-zinc-200">
		<UserRoundIcon class="size-6" />
	</span>
</div>

<style lang="postcss">
</style>
