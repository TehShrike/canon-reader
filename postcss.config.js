const precss = require(`precss`)
const autoprefixer = require(`autoprefixer`)

module.exports = {
	plugins: [
		precss({
			import: {
				path: [ `client/global-css` ],
				prefix: ``,
			},
		}),
		autoprefixer,
	],
}
