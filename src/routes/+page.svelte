<script lang="ts">
	import type { PageData } from './$types';
	import Tree from '$lib/chart/tree/Chart.svelte';
	import Pack from '$lib/chart/circle/Circle.svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let containerElement: HTMLDivElement;
	let width: number = $state(0);
	let height: number = $state(0);
	let currentTab: string = $state('tree');

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
</script>

<div class="c-fullscreen-svg" bind:this={containerElement}>
	<div>
		<a href="/tree" data-target="tree" onclick={showGraph}>Tree</a>
		<a href="/circle" data-target="pack" onclick={showGraph}>Circle</a>
	</div>
	{#if currentTab === 'tree'}
		<Tree {width} {height} items={data.groups} />
	{:else}
		<Pack {width} {height} items={data.groups} />
	{/if}
</div>
