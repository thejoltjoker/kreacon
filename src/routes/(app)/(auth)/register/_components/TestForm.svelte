<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/Form.svelte';
	import TextField from '$lib/components/FormInput.svelte';

	export let data;
</script>

<h3>Multiple componentized Forms</h3>
<hr />

<h4>Register Form</h4>

<!-- Form with dataType 'form' -->
<Form action="?/register" data={data.form} invalidateAll={false} let:message let:superform>
	{#if message}
		<div
			class="status"
			class:error={message.status >= 400}
			class:success={!message.status || message.status < 300}
		>
			{message.text}
		</div>
	{/if}

	<TextField type="text" {superform} field="username" label="Username"></TextField>
	<TextField type="text" {superform} field="email" label="E-Mail"></TextField>
	<TextField type="password" {superform} field="password" label="Password"></TextField>
	<Button type="submit">Register</Button>
</Form>

<hr />

<h4>Another Form</h4>

<style>
	.status {
		color: white;
		padding: 6px;
		padding-left: 8px;
		border-radius: 2px;
		font-weight: 500;
		margin-block: 0.75em;
	}

	.status.success {
		background-color: seagreen;
	}

	.status.error {
		background-color: #ff2a02;
	}

	hr {
		margin: 2rem 0;
	}
</style>
