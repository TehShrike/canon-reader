export default (ary, fn) => ary.reduce(
	(acc, element, index) => [ ...acc, ...fn(element, index) ],
	[]
)
