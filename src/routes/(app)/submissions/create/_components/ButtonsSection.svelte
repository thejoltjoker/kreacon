<script lang="ts">
	import Button from '$lib/components/Button.svelte';

	let { currentTab = $bindable(), tabsCount }: { currentTab: string; tabsCount: number } = $props();

	const nextTab = () => {
		currentTab = String(Number(currentTab) + 1 > tabsCount ? tabsCount : Number(currentTab) + 1);
	};

	const previousTab = () => {
		currentTab = String(Number(currentTab) - 1 < 1 ? 1 : Number(currentTab) - 1);
	};
</script>

<div class="mt-xl inline-flex gap-sm">
	<Button variant="outline" type="button" class="flex-1" onclick={previousTab}>Go back</Button>
	{#if Number(currentTab) < tabsCount}
		<Button type="button" class="flex-1" onclick={nextTab}>Continue</Button>
	{:else}
		<Button type="submit" class="flex-1">Submit</Button>
	{/if}
</div>
