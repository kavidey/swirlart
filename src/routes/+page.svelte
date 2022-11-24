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
		field: {
			dx: 'o * (y - x)',
			dy: 'x * (p - z) - y',
			dz: 'x * y - b * z',
			additionalVars: '{"p": 28, "o": 10, "b": 2.666}'
		},
		spawner: {
			bounds: {
				x: 20,
				y: 20,
				z: 20
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

		const fieldControls = pane.addFolder({ title: 'Vector Field' });
		fieldControls.addInput(config.field, 'dx');
		fieldControls.addInput(config.field, 'dy');
		fieldControls.addInput(config.field, 'dz');
		fieldControls.addInput(config.field, 'additionalVars');
		fieldControls.addButton({ title: 'Update Vector Field' }).on('click', () => {
			reset();
		});

		const renderingControls = pane.addFolder({ title: 'Rendering' });
		renderingControls.addInput(config.rendering, 'pointSize', { min: 0, max: 10 });
		renderingControls.addInput(config.rendering, 'integrationStep', { min: 0, max: 1 });
		renderingControls.addInput(config.rendering, 'decayRate', { min: 0.9, max: 1 });
		renderingControls.addInput(config.rendering, 'resetChance', { min: 0, max: 0.1 });

		const sampleControls = pane.addFolder({ title: 'Samples' });
		sampleControls.addButton({ title: 'Lorenz Attractor' }).on('click', () => {
			config.field.dx = 'o * (y - x)';
			config.field.dy = 'x * (p - z) - y';
			config.field.dz = 'x * y - b * z';
			config.field.additionalVars = '{"p": 28, "o": 10, "b": 2.666}';

			config.spawner.bounds.x = 20;
			config.spawner.bounds.y = 20;
			config.spawner.bounds.z = 20;

			config.spawner.density = 1000;

			config.rendering.pointSize = 0.5;
			config.rendering.integrationStep = 0.005;
			config.rendering.decayRate = 0.99;
			config.rendering.resetChance = 0.005;

			pane.refresh();
			reset();
		});
		sampleControls.addButton({ title: 'Rossler Attractor' }).on('click', () => {
			config.field.dx = '-y - z';
			config.field.dy = 'x + a * y';
			config.field.dz = 'b + z * (x - c)';
			config.field.additionalVars = '{"a": 0.2, "b": 0.2, "c": 5.7}';

			config.spawner.bounds.x = 15;
			config.spawner.bounds.y = 15;
			config.spawner.bounds.z = 1;

			config.spawner.density = 1000;

			config.rendering.pointSize = 0.5;
			config.rendering.integrationStep = 0.005;
			config.rendering.decayRate = 0.99;
			config.rendering.resetChance = 0.005;

			pane.refresh();
			reset();
		});
		sampleControls.addButton({ title: 'Rabinovich Fabrikant Attractor' }).on('click', () => {
			config.field.dx = 'y*(z - 1 + x^2) + b * x';
			config.field.dy = 'x*(3z + 1 - x^2) + b * y';
			config.field.dz = '-2*z*(a+x*y)';
			config.field.additionalVars = '{"a": 1.1, "b": 0.87}';

			config.spawner.bounds.x = 20;
			config.spawner.bounds.y = 20;
			config.spawner.bounds.z = 20;

			config.spawner.density = 1000;

			config.rendering.pointSize = 0.5;
			config.rendering.integrationStep = 0.005;
			config.rendering.decayRate = 0.99;
			config.rendering.resetChance = 0.005;

			pane.refresh();
			reset();
		});
		sampleControls.addButton({ title: 'Chua Attractor' }).on('click', () => {
			config.field.dx = 'a * (y - x)';
			config.field.dy = '(c - a) * x - x * z + c * y';
			config.field.dz = 'x * y - b * z';
			config.field.additionalVars = '{"a": 40, "b": 3, "c": 28}';

			config.spawner.bounds.x = 20;
			config.spawner.bounds.y = 20;
			config.spawner.bounds.z = 20;

			config.spawner.density = 1000;

			config.rendering.pointSize = 0.5;
			config.rendering.integrationStep = 0.001;
			config.rendering.decayRate = 0.99;
			config.rendering.resetChance = 0.005;

			pane.refresh();
			reset();
		});
		sampleControls.addButton({ title: 'Rain' }).on('click', () => {
			config.field.dx = '0.1*y';
			config.field.dy = '-0.2*y';
			config.field.dz = '0';
			config.field.additionalVars = '{}';

			config.spawner.bounds.x = 40;
			config.spawner.bounds.y = 20;
			config.spawner.bounds.z = 10;

			config.spawner.density = 1000;

			config.rendering.pointSize = 0.5;
			config.rendering.integrationStep = 0.1;
			config.rendering.decayRate = 0.99;
			config.rendering.resetChance = 0.005;

			pane.refresh();
			reset();
		});
	});

	onDestroy(() => {
		window.removeEventListener('resize', resize);
	});
</script>

<Canvas size={{ width, height }}>
	<Scene bind:config bind:reset />
</Canvas>
