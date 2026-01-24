// @ts-expect-error no types available
import toString from 'just-to-string'

export default function equalEnough(params: Record<string, unknown>, endParams: Record<string, unknown>): boolean {
	return Object.keys(params).every(
		key => toString(params[key]) === toString(endParams[key])
	)
}
