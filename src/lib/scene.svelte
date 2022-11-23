<script lang="ts">
	import { OrbitControls, T, Three } from '@threlte/core';
	import { onDestroy, onMount } from 'svelte';
	import {
		AmbientLight,
		BoxGeometry,
		DirectionalLight,
		Group,
		Mesh,
		MeshStandardMaterial,
		PerspectiveCamera,
		BufferGeometry,
		Float32BufferAttribute,
		PointsMaterial,
		Points
	} from 'three';

	// import math from 'mathjs';

	const scale = 200;
	const num_points = 1_000;
	const num_iterations = 50;

	let points: number[] = [];
	let colors: number[] = [];

	function addPoints() {
		for (let i = 0; i < num_points; i++) {
			let x = Math.random() * scale - scale / 2;
			let y = Math.random() * scale - scale / 2;
			let z = Math.random() * scale - scale / 2;
			points.push(x, y, z);

			colors.push(Math.random(), Math.random(), Math.random());
		}
	}

	for (let i = 0; i < num_iterations; i++) {
		addPoints();
	}

	function advectPoints() {
		points.splice(0, num_points * 3);
		colors.splice(0, num_points * 3);
		addPoints();
		for (let i = 0; i < points.length / 3; i++) {
			let x = points[i * 3 + 0];
			let y = points[i * 3 + 1];
			let z = points[i * 3 + 2];

			let r = Math.sqrt(x * x + y * y + z * z);
			let theta = Math.atan2(y, x);
			let phi = Math.acos(z / r);
			
			let r_dot = 1;
			let theta_dot = 1 / r;
			let phi_dot = 1 / (r * Math.sin(phi));

			let x_dot = r_dot * Math.cos(theta) * Math.sin(phi) + r * theta_dot * Math.sin(theta) * Math.sin(phi) - r * phi_dot * Math.cos(theta) * Math.cos(phi);
			let y_dot = r_dot * Math.sin(theta) * Math.sin(phi) - r * theta_dot * Math.cos(theta) * Math.sin(phi) - r * phi_dot * Math.sin(theta) * Math.cos(phi);
			let z_dot = r_dot * Math.cos(phi) + r * phi_dot * Math.sin(phi);

			points[i * 3 + 0] += x_dot;
			points[i * 3 + 1] += y_dot;
			points[i * 3 + 2] += z_dot;


			// let dx = 0.01;
			// let dy = 0;
			// let dz = 0;

			// x += dx*scale;
			// y += dy*scale;
			// z += dz*scale;

			// points[i * 3 + 0] = x;
			// points[i * 3 + 1] = y;
			// points[i * 3 + 2] = z;
		}
	}

	let advectInterval: any;
	onMount(() => {
		advectInterval = setInterval(advectPoints, 20);
	});
	onDestroy(() => {
		clearInterval(advectInterval);
	});
</script>

<Three type={PerspectiveCamera} makeDefault position={[10, 10, 10]} fov={24}>
	<OrbitControls target={{ y: 0 }} />
</Three>

<Three type={DirectionalLight} position={[3, 10, 10]} />
<Three type={DirectionalLight} position={[-3, 10, -10]} intensity={0.2} />
<Three type={AmbientLight} intensity={0.2} />

<!-- Cube -->
<Three type={Group}>
	<Three type={Points}>
		<Three
			type={BufferGeometry}
			attributes={{
				position: new Float32BufferAttribute(points, 3),
				color: new Float32BufferAttribute(colors, 3)
			}}
		/>
		<Three type={PointsMaterial} vertexColors={true} size={3} />
	</Three>
</Three>
