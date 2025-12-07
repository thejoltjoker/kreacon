<script lang="ts">
	import { Tabs } from 'bits-ui';
	let { value, label }: { value: string; label: string } = $props();
</script>

<Tabs.Trigger
	{value}
	class="px-xl py-sm hover:bg-muted-background! data-[state=active]:bg-muted-background data-[state=inactive]:text-muted-foreground rounded-full font-bold text-white transition-colors hover:text-white!"
>
	{label}
</Tabs.Trigger>
