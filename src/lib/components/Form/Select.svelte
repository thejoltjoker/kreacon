<!-- eslint-disable-next-line no-undef -->
<script lang="ts" generics="T extends Record<string, unknown>">
	import { Select, type SelectItemProps, type SelectSingleRootProps } from 'bits-ui';
	import { ChevronsUpDownIcon, DotIcon } from 'lucide-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';

	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type Props = Omit<SelectSingleRootProps, 'type' | 'value' | 'items'> & {
		// eslint-disable-next-line no-undef
		form: SuperForm<T>;
		// eslint-disable-next-line no-undef
		field: FormPathLeaves<T>;
		disabled: boolean;
		items: SelectItemProps[];
		label: string;
	};

	const { form, field, disabled, items, label, ...rootProps }: Props = $props();
	const { value, errors } = formFieldProxy(form, field);

	const selectedLabel = $derived($value ? items.find((o) => o.value == $value)?.label : label);
</script>

<Select.Root {...rootProps} type="single" bind:value={$value as string} name={field} {disabled}>
	<Select.Trigger
		class="flex h-form w-full items-center justify-between rounded-form border border-muted-foreground px-sm text-left data-[state=open]:border-violet-500"
	>
		<span>{selectedLabel}</span>
		<ChevronsUpDownIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="mt-sm w-[var(--bits-select-anchor-width)] rounded-form border border-muted-background bg-muted-background p-xs"
		>
			<Select.Viewport>
				{#each items as item}
					<Select.Item
						{...item}
						disabled={item.disabled}
						class="group flex h-form cursor-pointer items-center justify-between rounded-form pl-sm hover:!bg-muted-foreground data-[disabled]:!cursor-default data-[disabled]:!bg-transparent data-[selected]:font-bold data-[disabled]:text-muted-foreground"
					>
						<span>{item.label}</span>
						<span
							class="hidden items-center justify-center text-primary group-data-[selected]:flex"
						>
							<DotIcon class="h-form w-form" />
						</span>
					</Select.Item>
				{/each}

				{#if items.length == 0}
					<Select.Item value="" class="cursor-pointer rounded-form p-sm hover:bg-muted-background">
						No categories found
					</Select.Item>
				{/if}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
<!-- <select name={field} bind:value={$value} {disabled} {...$constraints}>
	{#each items as o}
		<option value={o.value} selected={o.value == $value}>
			{o.label}
		</option>
	{/each}
</select> -->
<!-- TODO Display errors -->
{$errors}
