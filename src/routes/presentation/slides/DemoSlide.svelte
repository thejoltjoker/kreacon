<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import image from '../../../assets/images/monster-skeleton-001.png';
</script>

<div class="-mt-24"></div>
<img src={image} alt="" width={300} height={300} />
<h1 class="text-[10rem] font-bold leading-none">Demo</h1>
<Button class="mt-16 animate-pulse py-8 text-h1 hover:animate-none" href="/">
	Gå till demo
</Button>
