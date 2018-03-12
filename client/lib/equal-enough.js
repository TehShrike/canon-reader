import toString from 'just-to-string'

export default function equalEnough(params, endParams) {
	return Object.keys(params).every(
		key => toString(params[key]) === toString(endParams[key])
	)
}
