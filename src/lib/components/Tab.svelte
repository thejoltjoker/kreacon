<script lang="ts">
	import { Tabs } from 'bits-ui';
	let { value, label }: { value: string; label: string } = $props();
</script>

<Tabs.Trigger
	{value}
	class="rounded-full px-xl py-sm font-bold text-white transition-colors hover:bg-muted-background! hover:text-white! data-[state=active]:bg-muted-background data-[state=inactive]:text-muted-foreground"
>
	{label}
</Tabs.Trigger>
