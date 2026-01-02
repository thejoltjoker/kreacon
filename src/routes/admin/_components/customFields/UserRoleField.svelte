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
	let isUpdating = $state(false);

	const handleRoleChange = async (newValue: string | undefined) => {
		if (!newValue || newValue === item.role || isUpdating) return;
		
		const previousRole = selectedRole;
		isUpdating = true;
		try {
			const response = await fetch(`/admin/users/${item.username}`, {
				method: 'PATCH',
				body: JSON.stringify({ role: newValue as UserRole }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			
			if (response.ok) {
				await invalidateAll();
			} else {
				// Revert to previous role on failure
				selectedRole = previousRole;
				console.error('Failed to update user role:', await response.text());
			}
		} catch (error) {
			// Revert to previous role on error
			selectedRole = previousRole;
			console.error('Error updating user role:', error);
		} finally {
			isUpdating = false;
		}
	};
</script>

{#snippet valueSnippet(value: UserRole)}
	<Select 
		bind:value={selectedRole} 
		items={roleOptions}
		onValueChange={handleRoleChange}
	/>
{/snippet}
<EntityListField {field} {item} {valueSnippet} />
