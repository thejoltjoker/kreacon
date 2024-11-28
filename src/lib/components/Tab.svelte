<script lang="ts">
	import { Tabs } from 'bits-ui';
	let { value, label }: { value: string; label: string } = $props();
</script>

<Tabs.Trigger
	{value}
	class="hover:!bg-muted-background data-[state=inactive]:text-muted-foreground data-[state=active]:bg-muted-background rounded-full px-md py-sm font-bold text-white transition-colors hover:!text-white"
>
	{label}
</Tabs.Trigger>
