<script lang="ts">
	import * as d3 from 'd3';
	import type { ChartItem, Datum } from '../../../app';
	import { type HierarchyNode } from 'd3';
	import CircleItem from '$lib/chart/circle/CircleItem.svelte';
	import { onMount } from 'svelte';

	const {
		items,
		width,
		height,
		onSelect
	}: { items: ChartItem[]; width: number; height: number; onSelect: (d: Datum) => void } = $props();

	const marginLeft = 10;
	const marginRight = 10;
	const marginTop = 10;
	const marginBottom = 10;

	const fractionLinearScale = d3.scaleLinear().domain([0, 1]).range([10, 100]);

	let svgElement: SVGElement;

	let graph: HierarchyNode<ChartItem> | null = $state(null);

	let viewBox = $derived.by(() => {
		return [-marginLeft, -marginTop, width, height].join(' ');
	});

	const makeHierarchy = d3
		.stratify<ChartItem>()
		.id((d) => d.id)
		.parentId((d) => d.parent_id);

	function computePack(width: number, height: number) {
		const root = makeHierarchy(items)
			.sum((d) => fractionLinearScale(d.fraction || 0))
			.sort((a, b) => d3.descending(a.value, b.value));

		return d3
			.pack<ChartItem>()
			.size([width - marginLeft - marginRight, height - marginTop - marginBottom])
			.padding(10)(root);
	}

	let transform = $state(null);
	$effect(() => {
		graph = computePack(width, height);
	});
	onMount(() => {
		const zoom = d3
			.zoom<SVGElement, Datum>()
			.translateExtent([
				[0, 0],
				[width, height]
			])
			.on('zoom', (e) => {
				transform = e.transform;
			});
		d3.select(svgElement).call(zoom);
		return () => {
			zoom.on('zoom', null);
		};
	});
</script>

<svg {width} {height} {viewBox} bind:this={svgElement}>
	{#if graph}
		<g {transform}>
			{#each graph.descendants() as data}
				<CircleItem {data} {onSelect} />
			{/each}
		</g>
	{/if}
</svg>
