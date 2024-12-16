<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import DumbDialog from '$lib/components/DumbDialog.svelte';
	import DumbInput from '$lib/components/Form/DumbInput.svelte';
	import { t } from '$lib/i18n';
	interface Props {
		entity: string;
		text: string;
		confirmationText: string;
		isOpen: boolean;
		onConfirm: () => void;
		onCancel: () => void;
	}
	let {
		isOpen = $bindable(false),
		confirmationText = $bindable(),
		entity,
		onConfirm,
		onCancel,
		text
	}: Props = $props();

	let sanityCheck = $state('');

	$effect(() => {
		if (!isOpen) {
			onCancel();
		}
	});
</script>

{#snippet confirmLabel()}
	<p class="text-base font-bold text-muted-foreground-alt">
		Write "<span class="select-none text-white">{confirmationText}</span>" below to confirm.
	</p>
{/snippet}

<DumbDialog title="Delete {entity}" bind:open={isOpen}>
	{#snippet description()}
		<div class="flex flex-col gap-xl">
			<p>
				{text}
			</p>
			<p class="font-bold tracking-wide text-destructive">{$t('This action cannot be undone!')}</p>
			<Divider variant="invisible" />
			<div class="flex w-full items-end justify-between gap-sm">
				<DumbInput
					type="text"
					name="sanityCheck"
					placeholder="Enter confirmation"
					label={confirmLabel}
					onpaste={(e) => e.preventDefault()}
					bind:value={sanityCheck}
					required
				/>

				<Button
					onclick={onConfirm}
					onkeypress={(e) => {
						if (e.key === 'Enter' || e.key == ' ' || e.code == 'Space') {
							onConfirm();
						}
					}}
					variant="destructive"
					disabled={sanityCheck !== confirmationText}
				>
					{$t('Delete')}
				</Button>
			</div>
		</div>
	{/snippet}
</DumbDialog>
