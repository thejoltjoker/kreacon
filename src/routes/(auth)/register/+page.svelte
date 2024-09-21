<script lang="ts">
	import RegisterForm from './_components/RegisterForm.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<RegisterForm bind:form />
