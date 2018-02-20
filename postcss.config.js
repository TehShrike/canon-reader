const precss = require(`precss`)
const autoprefixer = require(`autoprefixer`)

module.exports = {
	plugins: [
		precss({
			importPaths: [ `client/global-css` ],
		}),
		autoprefixer,
	],
}
