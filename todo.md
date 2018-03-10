# Should be pretty useful

- quick navigation component
	- given a reference typed in, browse to it
	- keyboard shortcut that displays the input so you can type in a reference
	- when a verse or verse range has been searched for, do the same behavior as when you hit the reference endpoint (navigation + highlighting)
- inline greek/hebrew definitions
	- download Strong's numbers/definitions from somewhere
	- get greek/hebrew text by book/chapter/verse, with some mapping to Strong's numbers
	- make it look not jank on the right column
	- make it look not jank at the bottom of the screen on mobile
	- come up with some UI for showing or hiding it that doesn't look jank on mobile
- use the Pickering Revelation text
- make the JS bundle smaller
	- move chromatism use to a script generator (pre-calculate book-of-the-bible-colors)

# Should be pretty great

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
- a josh@canonreader.com email address listed on the home/about page
- make `main.reference` a better warning page about bad references
- favicon
	- make sure the `favicon.ico` served from the root is aggressively cached because of the Chrome reload-on-replaceState bug

# Would be nice

- initial-load performance
	- move the book text processing to a build script and build individual book JSON to `public/books/*.json`
	- lazy-load books
- offline
	- store books locally
	- add proper offline support
- dark mode
- improve cold start time
	- maybe bundle the server code and transpile to target node 6
	- maybe use the babel runtime
