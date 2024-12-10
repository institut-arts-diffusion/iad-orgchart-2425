<script lang="ts">
	import type { PageData } from './$types';
	import Sidebar from '$lib/chart/Sidebar.svelte';
	import Circle from '$lib/chart/Circle.svelte';
	let { data }: { data: PageData } = $props();

	//const services = data.groups.filter((d) => ['service'].includes(d.type));
	//const services = data.groups.filter((d) => ['service'].includes(d.type));
</script>

<Circle items={data.groups} />
