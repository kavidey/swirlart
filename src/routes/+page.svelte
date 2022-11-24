<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '../lib/scene.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { Pane } from 'tweakpane';
	import type { config } from '$lib/config';

	let width = 500;
	let height = 500;

	let reset: () => void;

	let config: config = {
		pause: false,
		spawner: {
			bounds: {
				x: 10,
				y: 10,
				z: 10
			},
			density: 1000
		},
		rendering: {
			pointSize: 0.5,
			integrationStep: 0.005,
			decayRate: 0.99,
			resetChance: 0.005
		}
	};

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};
	onMount(() => {
		window.addEventListener('resize', resize);
		resize();

		const pane = new Pane({ title: 'Scene' });
		pane.addButton({ title: 'Reset' }).on('click', () => {
			reset();
		});
		pane.addInput(config, 'pause');

		const spawnerControls = pane.addFolder({ title: 'Spawner' });
		spawnerControls.addInput(config.spawner, 'bounds', {
			x: { min: 0, max: 1000 },
			y: { min: 0, max: 1000 },
			z: { min: 0, max: 1000 }
		});
		spawnerControls.addInput(config.spawner, 'density', { min: 0, max: 100_000 });

		const renderingControls = pane.addFolder({ title: 'Rendering' });
		renderingControls.addInput(config.rendering, 'pointSize', { min: 0, max: 10 });
		renderingControls.addInput(config.rendering, 'integrationStep', { min: 0, max: 1 });
		renderingControls.addInput(config.rendering, 'decayRate', { min: 0.9, max: 1 });
		renderingControls.addInput(config.rendering, 'resetChance', { min: 0, max: 0.1 });
	});

	onDestroy(() => {
		window.removeEventListener('resize', resize);
	});
</script>

<Canvas size={{ width, height }}>
	<Scene bind:config bind:reset />
</Canvas>
