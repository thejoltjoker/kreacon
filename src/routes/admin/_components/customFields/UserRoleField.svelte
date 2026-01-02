<script lang="ts">
	import type { UserRole } from '$lib/types/userRoles';
	import capitalize from 'lodash/capitalize';
	import EntityListField from '../EntityListField.svelte';
	import type { Field, Item } from '../types';
	import { invalidateAll } from '$app/navigation';
	import Select from '$lib/components/Select.svelte';
	import { userRoles } from '$lib/types/userRoles';

	let { field, item }: { field: Field; item: Item } = $props();
	
	const roleOptions = userRoles.map((role) => ({
		value: role,
		label: capitalize(role)
	}));

	let selectedRole = $state<string>(item.role as string);

	const handleRoleChange = async (newRole: UserRole) => {
		await fetch(`/admin/users/${item.username}`, {
			method: 'PATCH',
			body: JSON.stringify({ role: newRole })
		});
		await invalidateAll();
	};

	$effect(() => {
		if (selectedRole !== item.role) {
			handleRoleChange(selectedRole as UserRole);
		}
	});
</script>

{#snippet valueSnippet(value: UserRole)}
	<Select bind:value={selectedRole} items={roleOptions} />
{/snippet}
<EntityListField {field} {item} {valueSnippet} />
