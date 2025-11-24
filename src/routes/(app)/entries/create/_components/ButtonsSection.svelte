<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let {
		currentTab = $bindable(),
		step1Valid,
		step2Valid,
		step3Valid,
		tabsCount
	}: {
		currentTab: string;
		tabsCount: number;
		step1Valid: boolean;
		step2Valid: boolean;
		step3Valid: boolean;
	} = $props();

	let allowSubmit = $derived([step1Valid, step2Valid, step3Valid].every((v) => v));
	let allowContinue = $derived.by(() => (currentTab === '1' ? step1Valid : step2Valid));
	const nextTab = () => {
		currentTab = String(Number(currentTab) + 1 > tabsCount ? tabsCount : Number(currentTab) + 1);
	};

	const previousTab = () => {
		currentTab = String(Number(currentTab) - 1 < 1 ? 1 : Number(currentTab) - 1);
	};
</script>

<div class="mt-xl gap-sm inline-flex">
	<Button variant="outline" type="button" class="flex-1" onclick={previousTab}>Go back</Button>
	{#if Number(currentTab) < tabsCount}
		<Button type="button" class="flex-1" onclick={nextTab} disabled={!allowContinue}
			>Continue</Button
		>
	{:else}
		<Button type="submit" class="flex-1" disabled={!allowSubmit}>Submit</Button>
	{/if}
</div>
