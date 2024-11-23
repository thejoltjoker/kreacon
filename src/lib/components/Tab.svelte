<script lang="ts">
	import { Tabs } from 'bits-ui';
	let { value, label }: { value: string; label: string } = $props();
</script>

<Tabs.Trigger
	{value}
	class="rounded-full px-md py-sm font-bold text-white transition-colors hover:!bg-zinc-800 hover:!text-white data-[state=active]:bg-zinc-900 data-[state=inactive]:text-zinc-400"
>
	{label}
</Tabs.Trigger>
