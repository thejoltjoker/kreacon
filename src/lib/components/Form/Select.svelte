<!-- eslint-disable-next-line no-undef -->
<script lang="ts" generics="T extends Record<string, unknown>">
	import { Select, type SelectItemProps, type SelectSingleRootProps } from 'bits-ui';
	import { ChevronsUpDownIcon, DotIcon } from 'lucide-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';

	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type Props = Omit<SelectSingleRootProps, 'type' | 'value' | 'items'> & {
		form: SuperForm<T>;

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
		class="h-form rounded-form border-muted-foreground px-sm flex w-full items-center justify-between border text-left data-[state=open]:border-violet-500"
	>
		<span>{selectedLabel}</span>
		<ChevronsUpDownIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="mt-sm rounded-form border-muted-background bg-muted-background p-xs w-(--bits-select-anchor-width) border"
		>
			<Select.Viewport>
				{#each items as item (item.value)}
					<Select.Item
						{...item}
						disabled={item.disabled}
						class="group h-form rounded-form pl-sm hover:bg-muted-foreground! data-disabled:text-muted-foreground flex cursor-pointer items-center justify-between data-disabled:cursor-default! data-disabled:bg-transparent! data-selected:font-bold"
					>
						<span>{item.label}</span>
						<span class="text-primary hidden items-center justify-center group-data-selected:flex">
							<DotIcon class="h-form w-form" />
						</span>
					</Select.Item>
				{/each}

				{#if items.length == 0}
					<Select.Item value="" class="rounded-form p-sm hover:bg-muted-background cursor-pointer">
						No categories found
					</Select.Item>
				{/if}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>

<!-- TODO Display errors -->
{$errors}
