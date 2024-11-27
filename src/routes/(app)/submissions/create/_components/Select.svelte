<!-- eslint-disable-next-line no-undef -->
<script lang="ts" generics="T extends Record<string, unknown>">
	import { Select } from 'bits-ui';
	import { ChevronsUpDownIcon } from 'lucide-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';

	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';
	import type { SelectItem } from '../_types/SelectItem';

	interface Props {
		// eslint-disable-next-line no-undef
		form: SuperForm<T>;
		// eslint-disable-next-line no-undef
		field: FormPathLeaves<T>;
		disabled: boolean;
		items: SelectItem[];
		label: string;
	}

	const { form, field, disabled, items, label }: Props = $props();
	const { value, errors, constraints } = formFieldProxy(form, field);

	const selectedLabel = $derived($value ? items.find((o) => o.value == $value)?.label : label);
	$effect(() => {
		console.log('value', $value);
	});
</script>

<Select.Root type="single" bind:value={$value as string} name={field}>
	<Select.Trigger
		class="flex h-form w-full items-center justify-between rounded-form border border-white px-sm text-left"
	>
		<span>{selectedLabel}</span>
		<ChevronsUpDownIcon class="size-5" />
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			class="mt-sm w-[var(--bits-select-anchor-width)] rounded-form border border-zinc-700 bg-black p-xs"
		>
			<Select.ScrollUpButton />
			<Select.Viewport>
				{#each items as o}
					<Select.Item value={o.value} class="cursor-pointer rounded-form p-sm hover:bg-zinc-800">
						{o.label}
					</Select.Item>
				{/each}

				{#if items.length == 0}
					<Select.Item value="" class="cursor-pointer rounded-form p-sm hover:bg-zinc-800">
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
