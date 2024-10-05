<script lang="ts">
	import { createAvatar, melt } from '@melt-ui/svelte';
	import { twMerge } from 'tailwind-merge';
	import { UserRoundIcon } from 'lucide-svelte';

	export let src: string;
	export let size: 'sm' | 'md' | 'lg' = 'md';

	const {
		elements: { image, fallback }
	} = createAvatar({
		src: src
	});

	const sizeClasses = {
		sm: 'size-avatar-sm',
		md: 'size-avatar-md',
		lg: 'size-avatar-lg'
	};

	const iconSizeClasses = {
		sm: 'size-4',
		md: 'size-6',
		lg: 'size-8'
	};

	$: containerClasses = twMerge(
		'flex items-center justify-center rounded-full border border-white bg-zinc-800',
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
