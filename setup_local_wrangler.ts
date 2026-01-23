import { readFileSync, writeFileSync } from 'node:fs'

interface WranglerConfig {
	name: string
	pages_build_output_dir: string
	compatibility_date: string
	dev?: {
		port?: number
	}
}

const production_config: WranglerConfig = JSON.parse(
	readFileSync('wrangler.production.json', 'utf-8')
)

const local_config: WranglerConfig = {
	...production_config,
	dev: {
		port: 8788,
	},
}

writeFileSync('wrangler.json', JSON.stringify(local_config, null, '\t') + '\n')

console.log('Local wrangler.json generated')
