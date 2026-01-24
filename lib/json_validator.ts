import assert from '#lib/assert.ts'

type MessageReturningFunction = (input: unknown, name: string) => string[]

type PredicateFunction<T> = (input: unknown) => input is T

export type Validator<T> = {
	is_valid: PredicateFunction<T>
	get_messages: MessageReturningFunction
}

export type InferValidator<T> = T extends Validator<infer U> ? U : never
type NonOptionalPredicateFunction<T> = PredicateFunction<T extends undefined ? never : T>

type NonOptionalValidator<T> = {
	is_valid: NonOptionalPredicateFunction<T>
	get_messages: MessageReturningFunction
}

type StringIndexedObject = {
	[key: string]: unknown
}

const double_quote = (str: string) => `"${str}"`

const is_string = (input: unknown): input is string => typeof input === `string`

const string_validator: Validator<string> = {
	is_valid: is_string,
	get_messages: (input: unknown, name: string) => (is_string(input) ? [] : [`${double_quote(name)} is not a string`]),
}

const is_number = (input: unknown): input is number => typeof input === `number`

const number_validator: Validator<number> = {
	is_valid: is_number,
	get_messages: (input: unknown, name: string) => (is_number(input) ? [] : [`${double_quote(name)} is not a number`]),
}

const is_integer = (input: unknown): input is number => Number.isInteger(input)

const integer_validator: Validator<number> = {
	is_valid: is_integer,
	get_messages: (input: unknown, name: string) => (is_number(input) ? [] : [`${double_quote(name)} is not an integer`]),
}

const is_boolean = (input: unknown): input is boolean => typeof input === `boolean`

const boolean_validator: Validator<boolean> = {
	is_valid: is_boolean,
	get_messages: (input: unknown, name: string) => (is_boolean(input) ? [] : [`${double_quote(name)} is not a boolean`]),
}

const is_object = (input: unknown): input is StringIndexedObject => !!input && typeof input === `object`

type ValidatorShape<DESIRED_OBJECT extends { [key: string]: any }> = {
	[key in keyof DESIRED_OBJECT]: Validator<DESIRED_OBJECT[key]>
}

const keys_plz = <const KEY extends string>(object: { [key in KEY]: any }): KEY[] => Object.keys(object) as KEY[]
const values_plz = <const VALUE>(object: { [key: string]: VALUE }): VALUE[] => Object.values(object) as VALUE[]

const make_object_validator = <const OBJECT extends { [key: string]: any }>(shape: ValidatorShape<OBJECT>) => {
	const is_valid = (input: unknown): input is OBJECT => {
		if (!is_object(input)) {
			return false
		}

		const all_input_keys_exist_in_shape = keys_plz(input).every((key) => key in shape)

		if (!all_input_keys_exist_in_shape) {
			return false
		}

		return keys_plz(shape).every((key) => {
			const validator = shape[key]
			assert(validator)

			return validator.is_valid(input[key])
		})
	}

	const get_messages = (input: unknown, name: string) => {
		const quoted_name = double_quote(name)

		if (!is_object(input)) {
			return [`${quoted_name} is not an object`]
		}

		const keys_that_dont_exist_in_shape = keys_plz(input).filter((key) => !(key in shape))
		const property_messages = keys_plz(shape).flatMap((key) => {
			const validator = shape[key]
			assert(validator)

			return validator.get_messages(input[key], `${name}.${key}`)
		})

		return [
			...keys_that_dont_exist_in_shape.map(
				(key) => `${quoted_name} should not have a property named ${double_quote(key)} `,
			),
			...property_messages,
		]
	}

	return {
		is_valid,
		get_messages,
	}
}

const make_array_validator = <T>(element_validator: NonOptionalValidator<T>) => {
	const is_valid = (input: unknown): input is T[] => {
		if (!Array.isArray(input)) {
			return false
		}

		return input.every(element_validator.is_valid)
	}

	const get_messages = (input: unknown, name: string) => {
		if (!Array.isArray(input)) {
			return [`${double_quote(name)} is not an array`]
		}

		return input.flatMap((element, index) => element_validator.get_messages(element, `${name}[${index}]`))
	}

	return {
		is_valid,
		get_messages,
	}
}

const make_object_values_validator = <T>(element_validator: NonOptionalValidator<T>) => {
	const is_valid = (input: unknown): input is { [key: string]: T } => {
		if (!is_object(input)) {
			return false
		}

		return values_plz(input).every((value) => element_validator.is_valid(value))
	}

	const get_messages = (input: unknown, name: string) => {
		if (!is_object(input)) {
			return [`${double_quote(name)} is not an object`]
		}

		return Object.entries(input)
			.filter(([_key, value]) => !element_validator.is_valid(value))
			.flatMap(([key, value]) => element_validator.get_messages(value, `${name}.${key}`))
	}

	return {
		is_valid,
		get_messages,
	}
}

type UnpackArray<T> = T extends (infer U)[] ? U : T

type UnpackValidator<T> = T extends Validator<infer U> ? U : T

const one_of = <T extends Validator<any>[]>(...validators: T): Validator<UnpackValidator<UnpackArray<T>>> => {
	const is_valid = (input: unknown): input is UnpackValidator<UnpackArray<T>> =>
		validators.some((validator) => validator.is_valid(input))

	const get_messages = (input: unknown, name: string) => {
		if (!is_valid(input)) {
			const messages = validators
				.filter((validator) => !validator.is_valid(input))
				.map((validator) => {
					const messages = validator.get_messages(input, name)
					return messages.length > 1 ? `(${messages.join(`, and `)})` : messages[0]
				})

			return [messages.join(`, or `)]
		}
		return []
	}

	return {
		is_valid,
		get_messages,
	}
}

const null_validator: Validator<null> = {
	is_valid(input: unknown): input is null {
		return input === null
	},
	get_messages(input: unknown, name: string) {
		if (input !== null) {
			return [`${double_quote(name)} should be null`]
		}

		return []
	},
}

const date_validator: Validator<Date> = {
	is_valid: (value: unknown): value is Date => value instanceof Date,
	get_messages: (value: unknown, name: string) => {
		if (!(value instanceof Date)) {
			return [`${double_quote(name)} is not a Date`]
		}
		return []
	},
}

const nullable = <T>(validator: Validator<T>): Validator<T | null> => one_of(validator, null_validator)

const make_regex_validator = <T extends string>(regex: RegExp, custom_message?: string) => ({
	is_valid(input: unknown): input is T {
		return typeof input === `string` && regex.test(input)
	},
	get_messages(input: unknown, name: string) {
		if (typeof input !== `string` || !regex.test(input)) {
			return [
				custom_message || `${double_quote(name)} should be a string that matches ${double_quote(regex.toString())}`,
			]
		}
		return []
	},
})

const undefined_validator: Validator<undefined> = {
	is_valid(input: unknown): input is undefined {
		return input === undefined
	},
	get_messages(input: unknown, name: string) {
		if (input !== undefined) {
			return [`${double_quote(name)} should be undefined`]
		}

		return []
	},
}

const make_exact_validator = <T>(value: T): Validator<T> => ({
	is_valid(input: unknown): input is T {
		return input === value
	},
	get_messages(input: unknown, name: string) {
		if (input !== value) {
			return [`${double_quote(name)} should be "${value}"`]
		}
		return []
	},
})

const optional = <T>(validator: Validator<T>): Validator<T | undefined> => one_of(validator, undefined_validator)

const make_custom_validator = <T>({
	is_valid,
	get_messages,
}: {
	is_valid: PredicateFunction<T>
	get_messages: MessageReturningFunction
}) => ({
	is_valid,
	get_messages,
})

export {
	make_object_validator as object,
	make_array_validator as array,
	make_object_values_validator as object_values,
	make_regex_validator as regex,
	make_exact_validator as exact,
	make_custom_validator as custom,
	one_of,
	optional,
	integer_validator as is_integer,
	boolean_validator as is_boolean,
	string_validator as is_string,
	number_validator as is_number,
	date_validator as is_date,
	null_validator as is_null,
}
