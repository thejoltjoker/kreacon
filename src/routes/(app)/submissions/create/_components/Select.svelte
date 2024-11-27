<script lang="ts" generics="T extends Record<string, unknown>">
	import { Select } from 'bits-ui';
	import { ChevronsDownUpIcon, ChevronsUpDownIcon } from 'lucide-svelte';
	import type { FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	interface Props {
		form: SuperForm<T>;
		field: FormPathLeaves<T>;
		disabled: boolean;
		options: { label: string; value: string }[];
		label: string;
	}

	const { form, field, disabled, options, label }: Props = $props();
	const { value, errors, constraints } = formFieldProxy(form, field);

	const selectedLabel = $derived($value ? options.find((o) => o.value === $value)?.label : label);
	$effect(() => {
		console.log('value', $value);
	});
</script>

<!-- <select name="category" bind:value={$value} {disabled} {...$constraints}>
	{#each options as o}
		<option value={o.value} selected={o.value == $value}>
			{o.label}
		</option>
	{/each}
</select> -->

<Select.Root type="single" bind:value={$value as string}>
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
				{#each options as o}
					<Select.Item value={o.value} class="cursor-pointer rounded-form p-sm hover:bg-zinc-800">
						{o.label}
					</Select.Item>
				{/each}
				<Select.ScrollDownButton />
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
<!-- TODO Display errors -->
{$errors}
