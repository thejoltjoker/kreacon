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
		class="border-muted-foreground flex h-form w-full items-center justify-between rounded-form border px-sm text-left data-[state=open]:border-violet-500"
	>
		<span>{selectedLabel}</span>
		<ChevronsUpDownIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="border-muted-background bg-muted-background mt-sm w-[var(--bits-select-anchor-width)] rounded-form border p-xs"
		>
			<Select.Viewport>
				{#each items as item}
					<Select.Item
						{...item}
						disabled={item.disabled}
						class="hover:!bg-muted-foreground data-[disabled]:text-muted-foreground group flex h-form cursor-pointer items-center justify-between rounded-form pl-sm data-[disabled]:!cursor-default data-[disabled]:!bg-transparent data-[selected]:font-bold"
					>
						<span>{item.label}</span>
						<span
							class="text-primary hidden items-center justify-center group-data-[selected]:flex"
						>
							<DotIcon class="h-form w-form" />
						</span>
					</Select.Item>
				{/each}

				{#if items.length == 0}
					<Select.Item value="" class="hover:bg-muted-background cursor-pointer rounded-form p-sm">
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
