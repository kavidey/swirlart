import adapter from '@sveltejs/adapter-static';
import seqPreprocessor from 'svelte-sequential-preprocessor'
import preprocess from 'svelte-preprocess';
import { preprocessThrelte } from '@threlte/preprocess'

const dev = process.argv.includes('dev');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	// preprocess: preprocess(),
	preprocess: seqPreprocessor([preprocess(), preprocessThrelte()]),

	kit: {
		adapter: adapter(),
		paths: {
			base: dev ? '' : '/swirlart',
		},
		// If you are not using a .nojekyll file, change your appDir to something not starting with an underscore.
		// For example, instead of '_app', use 'app_', 'internal', etc.
		appDir: 'internal',
	}
};

export default config;
