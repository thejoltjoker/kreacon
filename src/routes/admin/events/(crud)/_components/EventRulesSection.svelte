<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { ZCreateEventSchema } from '$lib/schemas/eventSchema';
	import { LockOpenIcon, PencilIcon, PlusIcon } from 'lucide-svelte';
	import { getContext, tick } from 'svelte';
	import { type Infer, type SuperForm } from 'sveltekit-superforms/client';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';

	interface EventRulesSectionProps {
		/**
		 * Optional SuperForm instance. If not provided, will attempt to get from GenericForm context
		 * Must be provided if used outside of GenericForm
		 * @default undefined
		 */
		superform?: SuperForm<Infer<ZCreateEventSchema>>;
	}

	let { superform }: EventRulesSectionProps = $props();

	if (superform == null) {
		superform = getContext<SuperForm<Infer<ZCreateEventSchema>>>('superform');
		if (superform == null) {
			throw new Error('Failed to load form context');
		}
	}

	const { form } = superform;
	let rulesContainerRef: HTMLUListElement | undefined = $state(undefined);

	const handleAddRule = async () => {
		$form.rules = [...$form.rules, { text: '', isLocked: false }];

		tick().then(() => {
			const inputs = rulesContainerRef?.querySelectorAll('.event-rule');
			if (inputs?.length) {
				(inputs[inputs.length - 1] as HTMLInputElement).focus();
			}
		});
	};
</script>

<div class="flex items-center justify-between">
	<h3>General Rules</h3>
	<Button icon={PlusIcon} variant="outline" onclick={handleAddRule}>Add Rule</Button>
</div>
{#if $form.rules.length > 0}
	<ul class="flex flex-col gap-sm" bind:this={rulesContainerRef}>
		{#each $form.rules as _, index}
			<li class="flex items-center gap-sm">
				<!-- TODO Replace with TextField -->
				<DumbInput
					type="text"
					onkeydowncapture={(e: KeyboardEvent) => {
						if (e.key === 'Enter') {
							$form.rules[index].isLocked = true;
							handleAddRule();
						}
					}}
					bind:value={$form.rules[index].text}
					class="event-rule"
					disabled={$form.rules[index].isLocked}
					icon={$form.rules[index].isLocked ? PencilIcon : LockOpenIcon}
					iconProps={{
						onclick: () => ($form.rules[index].isLocked = !$form.rules[index].isLocked),
						class:
							'cursor-pointer text-white p-xs -mr-xs rounded-xs w-3xl h-3xl hover:bg-muted-background transition-colors'
					}}
				/>
			</li>
		{/each}
	</ul>
{/if}
