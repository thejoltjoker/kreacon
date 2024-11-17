<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';
	import { twMerge } from 'tailwind-merge';
	import { UserRoundIcon } from 'lucide-svelte';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let src: string;

	export let src: string;
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

	const {
		elements: { image, fallback }
	} = createAvatar({
		src: src
	});

	const sizeClasses = {
		sm: 'size-avatar-sm',
		md: 'size-avatar-md',
		lg: 'size-avatar-lg',
		xl: 'size-avatar-xl'
	};

	const iconSizeClasses = {
		sm: 'size-4',
		md: 'size-6',
		lg: 'size-8',
		xl: 'size-10'
	};

	$: containerClasses = twMerge(
		'flex items-center justify-center rounded-full border border-white bg-zinc-800 overflow-hidden',
		sizeClasses[size]
	);

	$: imageClasses = twMerge('rounded-full', sizeClasses[size]);
</script>

<div class={containerClasses}>
	<img use:melt={$image} alt="Avatar" class={imageClasses} />
	<span use:melt={$fallback} class="text-zinc-200">
		<UserRoundIcon class={iconSizeClasses[size]} />
	</span>
</div>
