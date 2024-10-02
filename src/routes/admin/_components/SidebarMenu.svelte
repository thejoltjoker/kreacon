<script>
	import SidebarMenuItem from './SidebarMenuItem.svelte';
	import { CircleUserRoundIcon, CalendarIcon } from 'lucide-svelte';
	import { _ } from 'svelte-i18n';
</script>

<ul>
	<SidebarMenuItem
		href="/admin/events"
		label={$_('entity.event.plural', { default: 'Events' })}
		icon={CalendarIcon}
		count={1}
	/>
	<SidebarMenuItem
		href="/admin/users"
		label={$_('entity.user.plural', { default: 'Users' })}
		icon={CircleUserRoundIcon}
		count={109}
	/>
</ul>
