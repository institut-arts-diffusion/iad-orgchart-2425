import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

import svg from '@poppanator/sveltekit-svg';
export default defineConfig({
	plugins: [sveltekit(), svg()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
