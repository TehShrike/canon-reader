export default <T, U>(ary: T[], fn: (element: T, index: number) => U[]): U[] => ary.reduce<U[]>(
	(acc, element, index) => [ ...acc, ...fn(element, index) ],
	[]
)
