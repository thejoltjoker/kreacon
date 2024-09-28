<script lang="ts">
	import RegisterForm from './_components/RegisterForm.svelte';
	import type { ActionData, PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;
</script>

<RegisterForm bind:form bind:data />
