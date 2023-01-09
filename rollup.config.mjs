import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import livereload from 'rollup-plugin-livereload'
import terser from '@rollup/plugin-terser'
import css from 'rollup-plugin-css-only'
import json from '@rollup/plugin-json'
import childProcess from 'child_process'

const production = !process.env.ROLLUP_WATCH

function serve() {
	let server

	function toExit() {
		if (server) server.kill(0)
	}

	return {
		writeBundle() {
			if (server) return
			server = childProcess.spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true,
			})

			process.on('SIGTERM', toExit)
			process.on('exit', toExit)
		},
	}
}

export default {
	input: 'src/index.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/build/bundle.js',
	},
	plugins: [
		svelte({
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			},
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// allows importing of geojson and json
		json(),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),

		replace({
			'process.env.MAPBOX_TOKEN': JSON.stringify(process.env.MAPBOX_TOKEN),
			'process.env.WAKA_COMMUTER_SOURCE': JSON.stringify(
				process.env.WAKA_COMMUTER_SOURCE
			),
		}),

		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `dist` directory and refresh the
		// browser on changes when not in production
		!production && livereload('dist'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
}
