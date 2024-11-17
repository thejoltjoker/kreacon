<script lang="ts">
	import { Button } from 'bits-ui';
</script>

<Button.Root
	class="text-background active:scale-98 inline-flex h-12 items-center
	justify-center rounded-full bg-white px-6 text-[15px]
	font-semibold text-black transition-all hover:bg-white/90"
>
	<slot />
</Button.Root>
