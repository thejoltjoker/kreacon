<script lang="ts">
	import { Avatar, type AvatarImageLoadingStatus } from 'bits-ui';
	import { UserRoundIcon } from 'lucide-svelte';
	import { twMerge } from 'tailwind-merge';

	interface AvatarProps extends Avatar.RootProps {
		src: string;
	}

	let { src, loadingStatus = undefined }: AvatarProps = $props();

	let rootClasses = $derived(
		twMerge(
			'w-full rounded-full border bg-zinc-900 aspect-square max-w-xxl',
			loadingStatus === 'loaded' ? 'border-white' : 'border-white'
		)
	);
</script>

<Avatar.Root {loadingStatus} class={rootClasses}>
	<div
		class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
	>
		<Avatar.Image {src} alt="Avatar" />
		<Avatar.Fallback><UserRoundIcon /></Avatar.Fallback>
	</div>
</Avatar.Root>
