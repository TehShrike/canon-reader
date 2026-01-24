# Project Preferences

## Code Style

- Use `type` instead of `interface` for TypeScript type definitions
- Use snake_case for variables and function names
- Use PascalCase for component names and type/interface names
- Use snake_case for file names
- Use snake_case for CSS class names

- Do not write comments explaining what the code is going to do
- Use arrow functions
- Inline values unless they're used more than once

# Writing Tests

Uses Node.js built-in test runner.

## File naming

Test files are named `*.test.ts` and placed next to the file they test.

## Template

```ts
import { test } from 'node:test'
import * as assert from 'node:assert'

test('module or function being tested', () => {
	const thing = setup_thing()

	assert.strictEqual(thing.do_something(), expected, 'description of this assertion')
	assert.strictEqual(thing.do_another(), expected, 'description of this assertion')
})
```

## Structure preferences

- Group related assertions in one `test()` call
- Build fixtures inside the test, not at module level
- Put assertion descriptions in the message parameter of `assert.strictEqual`, not in separate `test()` names
- Only use separate `test()` calls when setup differs significantly

## Running tests

```sh
pnpm run test:unit
```

Or run a specific test file:

```sh
node --test path/to/file.test.ts
```

## Common assertions

- `assert.strictEqual(actual, expected)` - strict equality
- `assert.deepStrictEqual(actual, expected)` - deep equality for objects/arrays
- `assert.throws(() => code_that_throws)` - expect an error
