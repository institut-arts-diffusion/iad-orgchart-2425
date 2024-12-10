<script lang="ts">
	import type { PageData } from './$types';
	import Tree from '$lib/chart/tree/Chart.svelte';
	import Pack from '$lib/chart/circle/Circle.svelte';
	import { onMount } from 'svelte';
	import type { ChartItem, Datum } from '../app';

	let { data }: { data: PageData } = $props();

	let containerElement: HTMLDivElement;
	let width: number = $state(0);
	let height: number = $state(0);
	let currentTab: string = $state('circle');

	onMount(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			// We're only watching one element
			const entry = entries.at(0);
			width = entry?.contentRect.width || containerElement.clientWidth;
			height = entry?.contentRect.height || containerElement.clientHeight;
			//Get the block size
			//width = entry?.contentBoxSize[0].blockSize || 0;
		});

		resizeObserver.observe(containerElement);

		// This callback cleans up the observer
		return () => resizeObserver.unobserve(containerElement);
	});
	let showGraph = (e: MouseEvent) => {
		e.preventDefault();
		const target = e.target as HTMLElement;
		currentTab = target.dataset.target || 'tree';
	};

	let currentSelection: Datum | null = $state(null);
	let onSelect = (data: Datum) => {
		console.log('onSelect', data);
		currentSelection = data;
	};

	let closeSelection = ()=>{
		currentSelection = null;
	}
</script>

<div class="c-fullscreen-svg" bind:this={containerElement}>
	<div>
		<a href="/tree" data-target="tree" onclick={showGraph}>Tree</a>
		<a href="/circle" data-target="pack" onclick={showGraph}>Circle</a>
	</div>
	{#if width}
		{#if currentTab === 'tree'}
			<Tree {width} {height} items={data.groups} {onSelect} />
		{:else}
			<Pack {width} {height} items={data.groups} {onSelect} />
		{/if}
	{/if}
	{#if currentSelection}
		<div class="c-item-selection">
			<button onclick={closeSelection} class="c-close-btn">X</button>
			{#if currentSelection.data.person}
				<div>
					<h5 class="c-suptitle">{currentSelection.data.name}</h5>
					<h4 class="c-h4">{currentSelection.data.person}</h4>
				</div>
			{:else}
				<div>
					<h4 class="c-h4">{currentSelection.data.name}</h4>

					{#if currentSelection.children?.length}
						<ul>
							{#each currentSelection.children as child}
								<li>{child.data.name}</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/if}
			{#if currentSelection.data.contract && currentSelection.data.fraction}
				<div>
					<div>
						<strong>{currentSelection.data.contract.name}</strong>
						{`${currentSelection.data.contract.fraction * currentSelection.data.fraction}/${currentSelection.data.contract.fraction}`}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
