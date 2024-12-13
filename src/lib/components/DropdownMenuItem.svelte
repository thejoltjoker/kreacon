<script lang="ts" module>
	import { DropdownMenu } from 'bits-ui';

	export interface DropdownMenuItemProps extends DropdownMenu.ItemProps {
		icon?: typeof IconType;
		class?: string;
		href?: string;
	}
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { type Icon as IconType } from 'lucide-svelte';

	let {
		icon: Icon,

		children,
		onclick,
		href,
		...props
	}: DropdownMenuItemProps = $props();

	let className = cn(
		'flex cursor-pointer items-center justify-start gap-sm rounded-sm transition-colors hover:bg-shade-800 data-[highlighted]:bg-shade-800',

		href == null && 'py-sm px-sm',
		'disabled:text-shade-400 data-[disabled]:text-shade-400',
		props.class
	);

	let linkClassName = cn(
		'py-sm px-sm flex cursor-pointer items-center justify-start gap-sm w-full'
	);
</script>

{#if href != null}
	<DropdownMenu.Item {...props} class={className}>
		<a {href} class={linkClassName}>
			{#if Icon != null}
				<Icon class="size-5" />
			{/if}
			{@render children?.()}
		</a>
	</DropdownMenu.Item>
{:else}
	<DropdownMenu.Item {...props} class={className} {onclick}>
		{#if Icon != null}
			<Icon class="size-5" />
		{/if}
		{@render children?.()}
	</DropdownMenu.Item>
{/if}
