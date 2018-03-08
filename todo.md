# Should be pretty useful

- a "reference" url that redirects you to the correct book/chapter/verse
	- if the reference isn't valid, go to a page that lets them know, and links them to book selection
	- a regular expression to parse the reference
		- essentially verse-reference-regex but with regular expression support in book names
	- scheme for representing highlighted verses in the url
	- just the chapter/verse id from the range start in the hash fragment?
- quick navigation
	- given a reference typed in, browse to it
	- keyboard shortcut that displays an input so you can type in a reference
	- when a verse or verse range has been searched for, highlight the verse/range
- inline greek/hebrew definitions
	- download Strong's numbers/definitions from somewhere
	- get greek/hebrew text by book/chapter/verse, with some mapping to Strong's numbers
	- make it look not jank on the right column
	- make it look not jank at the bottom of the screen on mobile
	- come up with some UI for showing or hiding it that doesn't look jank on mobile
- data issues
	- use the Pickering Revelation text
	- fix data parsing in the WEB import - don't interpret notemarks as paragraph breaks (2 Chronicles 1:1)
- Put book name into `title` element

# Should be pretty great

- chapter numbers, verse numbers
	- need to line up in a more consistent way on the left
	- make the number of chapter numbers displayed based on the viewport height
- bookmarks
	- ???
- style stuff
	- make the verse numbers on the left line up with the text better
- a real home page
	- two calls to action
		- a reference input
		- a "read" button that takes you to book selection
	- a better "three goals" - three use cases
		- sitting in church looking up a reference
		- sitting at home sitting down and reading for a while
		- internet/water cooler arguments where I want to quickly look up greek/hebrew/crossreferences
- an about page
	- basic design goals/restrictions
	- road map
	- credit WEB, Pickering, Strong, OpenBible.org
- improve cold start time
	- maybe bundle the server code and transpile to target node 6
	- maybe use the babel runtime
- a josh@canonreader.com email address listed on the home/about page
- make `main.reference` a better warning page about bad references

# Would be nice

- initial-load performance
	- move the book text processing to a build script and build individual book JSON to `public/books/*.json`
	- lazy-load books
- offline
	- store books locally
	- add proper offline support
- pre-calculate book-of-the-bibel-colors
