<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { cn } from '$lib/utils';
	import { DateField, DatePicker, type WithoutChildrenOrChild } from 'bits-ui';
	import { XCircleIcon } from 'lucide-svelte';
	import { getContext } from 'svelte';
	import { formFieldProxy, type FormPathLeaves, type SuperForm } from 'sveltekit-superforms';
	import { CalendarDateTime, type DateValue } from '@internationalized/date';
	import { Icon as IconType, type IconProps } from 'lucide-svelte';

	interface DateFieldProps extends WithoutChildrenOrChild<DateField.RootProps> {
		label: string;
		field: FormPathLeaves<T>;
		labelProps?: DatePicker.LabelProps;
		icon?: typeof IconType;
		iconProps?: IconProps;
		class?: string;
		inputProps?: DateField.InputProps;
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<T>;
	}

	let {
		superform,
		field,
		labelProps,
		label,
		class: className,
		inputProps,
		icon: Icon,
		iconProps,
		...props
	}: DateFieldProps = $props();

	if (superform == null) {
		superform = getContext<SuperForm<T>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}
	const { value, errors, constraints } = formFieldProxy(superform, field);
	const handleUpdateFormValue = (newValue: DateValue) => {
		// TODO Type value to be date
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		$value = new Date(newValue.toString()) as any;
	};

	let initialValue = new CalendarDateTime(
		$value?.getFullYear() ?? new Date().getFullYear(),
		($value?.getMonth() ?? new Date().getMonth()) + 1,
		$value?.getDate() ?? new Date().getDate(),
		$value?.getHours() ?? new Date().getHours(),
		$value?.getMinutes() ?? new Date().getMinutes()
	);

	let dateFieldValue: DateValue | undefined = $state(initialValue);
	let isChanged = $derived(dateFieldValue != null);
	let placeholder = initialValue;
</script>

<div class="flex flex-col gap-xs">
	<!-- <StyledInput
		name={field}
		type="text"
		class={cn($errors && 'input-invalid', className)}
		
		bind:value={$value}
		{...$constraints}
		{...props}
	/> -->

	<DateField.Root
		bind:value={dateFieldValue}
		{placeholder}
		{...props}
		onValueChange={(v) => {
			if (v != null) handleUpdateFormValue(v);
		}}
		hourCycle={24}
	>
		<div class={cn('relative flex w-fit flex-col gap-sm', isChanged && 'text-white', className)}>
			<DateField.Label {...labelProps} class="font-bold text-white">{label}</DateField.Label>
			<DateField.Input
				aria-invalid={$errors ? 'true' : undefined}
				{...$constraints}
				class={cn(
					'group flex h-form w-fit select-none items-center rounded-form border border-muted-foreground bg-bg px-xs text-muted-foreground-alt transition-colors focus-within:border-primary focus-within:shadow-sm hover:border-white data-invalid:border-destructive',
					isChanged && 'border-white text-white',
					inputProps?.class
				)}
				{...inputProps}
			>
				{#snippet children({ segments })}
					{#each segments as { part, value }}
						<div class="inline-block select-none">
							{#if part === 'literal'}
								<DateField.Segment {part} class="text-shade-400">
									{value}
								</DateField.Segment>
							{:else}
								<DateField.Segment
									{part}
									class="rounded-xs px-2xs py-2xs focus:bg-shade-600 focus:text-white focus-visible:outline-none! focus-visible:outline-0!"
								>
									{value}
								</DateField.Segment>
							{/if}
						</div>
					{/each}
					{#if Icon != null}
						<Icon
							{...iconProps}
							class={cn(
								'ml-sm mr-2xs size-5 text-muted-foreground transition-colors group-focus-within:text-white',
								isChanged && 'text-white',
								iconProps?.class
							)}
						/>
					{/if}
				{/snippet}
			</DateField.Input>
		</div>
	</DateField.Root>

	{#if $errors}
		<ul class="flex flex-col gap-xs text-sm">
			{#each $errors as error}
				<li class="inline-flex items-center gap-2xs">
					<XCircleIcon class="size-4 text-destructive" />
					{error}
				</li>
			{/each}
		</ul>
	{/if}
</div>
