<script lang="ts">
    import type { ChartItem } from '../../app';

		let { items }: { items: ChartItem[] } = $props();
</script>

<ul>
	{#each items as group}
		<li>{group.name}</li>
	{/each}
</ul>