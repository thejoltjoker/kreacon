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

<div class="gap-xs flex flex-col">
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
		<div class={cn('gap-sm relative flex w-fit flex-col', isChanged && 'text-white', className)}>
			<DateField.Label {...labelProps} class="font-bold text-white">{label}</DateField.Label>
			<DateField.Input
				aria-invalid={$errors ? 'true' : undefined}
				{...$constraints}
				class={cn(
					'group h-form rounded-form border-muted-foreground bg-bg px-xs text-muted-foreground-alt focus-within:border-primary data-invalid:border-destructive flex w-fit items-center border transition-colors select-none focus-within:shadow-sm hover:border-white',
					isChanged && 'border-white text-white',
					inputProps?.class
				)}
				{...inputProps}
			>
				{#snippet children({ segments })}
					{#each segments as { part, value }, i (i)}
						<div class="inline-block select-none">
							{#if part === 'literal'}
								<DateField.Segment {part} class="text-shade-400">
									{value}
								</DateField.Segment>
							{:else}
								<DateField.Segment
									{part}
									class="px-2xs py-2xs focus:bg-shade-600 rounded-xs focus:text-white focus-visible:outline-0! focus-visible:outline-none!"
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
								'ml-sm mr-2xs text-muted-foreground size-5 transition-colors group-focus-within:text-white',
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
		<ul class="gap-xs flex flex-col text-sm">
			{#each $errors as error, i (i)}
				<li class="gap-2xs inline-flex items-center">
					<XCircleIcon class="text-destructive size-4" />
					{error}
				</li>
			{/each}
		</ul>
	{/if}
</div>
