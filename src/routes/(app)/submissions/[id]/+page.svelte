<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	const { submission } = data;
</script>

<h1>{submission?.title}</h1>
