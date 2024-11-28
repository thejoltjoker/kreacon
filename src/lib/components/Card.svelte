<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	let className: string = '';
	export { className as class };
	const classNames = twMerge(
		'flex flex-col gap-lg border border-muted-background rounded-md p-lg',
		className
	);
</script>

<div class={classNames}>
	<slot />
</div>
