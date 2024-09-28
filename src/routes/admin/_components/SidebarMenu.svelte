<script>
	import SidebarMenuItem from './SidebarMenuItem.svelte';
	import { CircleUserRoundIcon, CalendarIcon } from 'lucide-svelte';
</script>

<ul>
	<SidebarMenuItem href="/admin/events" label="Events" icon={CalendarIcon} count={1} />
	<SidebarMenuItem href="/admin/users" label="Users" icon={CircleUserRoundIcon} count={109} />
</ul>
