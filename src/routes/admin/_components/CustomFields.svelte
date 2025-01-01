<script module lang="ts">
	export { entryStatusField };
	export interface FieldProps {
		title: string;
		value: unknown;
	}
</script>

{#snippet entryStatusField()}
	<div>
		<p>Custom field</p>
	</div>
{/snippet}
