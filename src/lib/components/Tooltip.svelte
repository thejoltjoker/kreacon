<script lang="ts">
	import { cn } from '$lib/utils';
	import { Tooltip } from 'bits-ui';
	import { type Snippet } from 'svelte';

	type Props = Tooltip.RootProps & {
		trigger: Snippet;
		tooltipClassName?: string;
		triggerProps?: Tooltip.TriggerProps;
	};

	let {
		open = $bindable(false),
		children,
		trigger,
		triggerProps = {},
		onOpenChange,
		...restProps
	}: Props = $props();

	const triggerClassName = cn('pointer-events-auto', triggerProps.class);
	const tooltipClassName = cn(
		'z-50 rounded-md bg-muted-background px-3 py-2 text-sm shadow-md',
		restProps.tooltipClassName
	);
</script>

<!--
 Ensure you have a `Tooltip.Provider` component wrapping
 your root layout content
-->
<Tooltip.Provider>
	<Tooltip.Root bind:open {onOpenChange}>
		<Tooltip.Trigger {...triggerProps} class={triggerClassName}>
			{@render trigger()}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content>
				<div class={tooltipClassName}>
					{@render children?.()}
				</div>
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
