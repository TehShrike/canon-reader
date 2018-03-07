# Should be pretty useful

- chapter numbers, verse numbers
	- need to line up in a more consistent way on the left
	- put chapter numbers on the right side, absolutely positioned
		- highlight the chapter of the center verse?
			- find the chapter of the verse at the top of the viewport
			- highlight the chapter number that is currently in the "to display" list that is less than or equal to that chapter number
		- make the number of chapter numbers displayed based on the viewport height
- quick navigation
	- given a reference typed in, browse to it
	- keyboard shortcut that displays an input so you can type in a reference
	- when a verse or verse range has been searched for, highlight the verse/range
- a "reference" url that redirects you to the correct book/chapter/verse
	- if the reference isn't valid, go to a page that lets them know, and links them to book selection
- inline greek/hebrew definitions
	- download Strong's numbers/definitions from somewhere
	- get greek/hebrew text by book/chapter/verse, with some mapping to Strong's numbers
	- make it look not jank on the right column
	- make it look not jank at the bottom of the screen on mobile
	- come up with some UI for showing or hiding it that doesn't look jank on mobile

# Should be pretty great

- bookmarks
	- ???
- style stuff
	- make the verse numbers on the left line up with the text better
- a real home page
	- two calls to action
		- a reference input
		- a "read" button that takes you to book selection
- an about page
	- basic design goals/restrictions
	- road map
	- credit WEB, Pickering, Strong, OpenBible.org

# Would be nice

- initial-load performance
	- move the book text processing to a build script and build individual book JSON to `public/books/*.json`
	- lazy-load books
- offline
	- store books locally
	- add proper offline support
