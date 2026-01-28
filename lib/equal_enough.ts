// @ts-expect-error no types available
import toString from 'just-to-string'

export default function equal_enough(params: Record<string, unknown>, end_params: Record<string, unknown>): boolean {
	return Object.keys(params).every(
		key => toString(params[key]) === toString(end_params[key])
	)
}
