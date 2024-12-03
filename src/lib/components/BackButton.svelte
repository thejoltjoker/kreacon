<script lang="ts">
	import { ChevronLeftIcon } from 'lucide-svelte';
	import Button from './Button.svelte';

	const handleClick = () => {
		history.back();
	};
</script>

<Button onclick={handleClick} variant="outline" size="icon">
	<ChevronLeftIcon />
</Button>
