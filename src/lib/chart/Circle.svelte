<script lang="ts">
	import * as d3 from 'd3';
	import type { ChartItem } from '../../app';
	import { type HierarchyNode } from 'd3';

	const marginLeft = 10;
	const marginRight = 10;
	const marginTop = 10;
	const marginBottom = 10;

	const fractionLinearScale = d3.scaleLinear().domain([0, 1]).range([10, 50]);
	const colorScale = d3.scaleLinear([0, 0.5, 1], ['#1ac0d7', '#76d143', '#f7b538']);

	let { items }: { items: ChartItem[] } = $props();
	let containerElement: HTMLDivElement;
	let svgElement: SVGElement;

	let width = $state(0);
	let height = $state(0);
	let graph: HierarchyNode<ChartItem[]> | null = $state(null);

	let viewBox = $derived.by(() => {
		return [-marginLeft, -marginTop, width, height].join(' ');
	});

	const makeHierarchy = d3
		.stratify<ChartItem>()
		.id((d) => d.id)
		.parentId((d) => d.parent_id);

	function computePack(width: number, height: number): ChartItem[] {
		const root = makeHierarchy(items)
			.sum((d) => fractionLinearScale(d.fraction || 0))
			.sort((a, b) => d3.descending(a.value, b.value));

		const tree = d3
			.pack()
			.size([width - marginLeft - marginRight, height - marginTop - marginBottom])
			.padding(10);

		tree(root);

		return root;
	}

	let transform = $state(null);
	$effect(() => {
		width = containerElement.clientWidth;
		height = containerElement.clientHeight;
		graph = computePack(width, height);
		const zoom = d3
			.zoom()
			.translateExtent([
				[0, 0],
				[width, height]
			])
			.on('zoom', (e) => {
				transform = e.transform;
			});
		d3.select(svgElement).call(zoom);
	});

	function getStyle(data: ChartItem) {
		if (data.contract) {
			return `--color: ${colorScale(data.contract.cost_distribution)}`;
		}
		return null;
	}
</script>

<div class="c-fullscreen-svg" bind:this={containerElement}>
	<svg {width} {height} {viewBox} bind:this={svgElement}>
		{#if graph}
			<g {transform}>
				{#each graph.descendants() as d}
					<g
						transform={`translate(${d.x},${d.y})`}
						class="c-pack-item"
						class:children={d.children}
						data-depth={d.depth}
						data-height={d.height}
						data-type={d.data.type}
						data-name={d.data.name}
						style={getStyle(d.data)}
					>
						<circle class="c-pack-item__circle" r={d.r} />
					</g>
				{/each}
			</g>
		{/if}
	</svg>
</div>
