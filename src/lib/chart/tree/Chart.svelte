<script lang="ts">
	import * as d3 from 'd3';
	import type { ChartItem } from '../../../app';
	import type { HierarchyNode } from 'd3';

	const curve = d3.curveBumpX;
	const padding = 1;

	let { items, width, height }: { width: number; height: number; items: ChartItem[] } = $props();
	let svgElement: SVGElement;
	console.log(items);

	let graph: HierarchyNode<ChartItem[]> | null = $state(null);

	let viewBox = $derived.by(() => {
		if (!graph) return '';
		const dy = width / (graph.height + padding);
		// Center the tree.
		let x0 = Infinity;
		let x1 = -x0;
		graph.each((d) => {
			if (d.x > x1) x1 = d.x;
			if (d.x < x0) x0 = d.x;
		});

		const x = (-dy * padding) / 2;

		return [x, -height / 2, width, height].join(' ');
	});

	const makeHierarchy = d3
		.stratify<ChartItem>()
		.id((d) => d.id)
		.parentId((d) => d.parent_id);

	function computeTree(width: number): ChartItem[] {
		const root = makeHierarchy(items.filter((i) => i.type != 'organisationUnitMember'));

		const dx = 30;
		const padding = 1;
		const dy = width / (root.height + padding);
		const tree = d3.tree().nodeSize([dx, dy]);

		// Sort the tree and apply the layout.
		//oot.sort((a, b) => d3.ascending(a.data.name, b.data.name));
		tree(root);

		return root;
	}

	$effect(() => {
		width = svgElement.clientWidth;
		height = svgElement.clientHeight;
		graph = computeTree(width, height);
	});

	$inspect(graph?.links);
</script>

<svg {width} {height} bind:this={svgElement} class="c-svg" {viewBox}>
	{#if graph}
		<g fill="none" fill-rule="evenodd" stroke="#555" stroke-opacity={0.4} stroke-width={1.5}>
			{#each graph.links() as link}
				<path
					d={d3
						.link(curve)
						.x((d) => d.y)
						.y((d) => d.x)(link)}
				/>
			{/each}
		</g>
		<g>
			{#each graph.descendants() as d}
				<g transform={`translate(${d.y},${d.x})`} target="_blank">
					<circle r={2.5} fill={d.children ? '#555' : '#999'} />
					<a href="/hello">
						<text
							x={d.children ? -6 : 6}
							dy="0.32em"
							text-anchor={d.children ? 'end' : 'start'}
							paint-order="stroke">{d.data.name}</text
						>
					</a>
				</g>
			{/each}
		</g>
	{/if}
</svg>
