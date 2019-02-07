# Should be pretty useful

- PK commentary
- navigation input
	- let's move away from reloading the page as you type.  It sucks as long as it takes >50ms for a book to load, anyway
	- go to having the user hit enter to actually make the search happen
	- eventually it would be nice to give some feedback that you've typed something valid
		- highlight words/chapters/verses green as they are matched
		- or, maybe just display the parsed output as they type
	- still need to invent a way to embed the navigation input on the home screen, and then disconnect it and move it to the bottom when a book name is matched
- inline greek/hebrew definitions
	- download Strong's numbers/definitions from somewhere
	- get greek/hebrew text by book/chapter/verse, with some mapping to Strong's numbers
	- make it look not jank on the right column
	- make it look not jank at the bottom of the screen on mobile
	- come up with some UI for showing or hiding it that doesn't look jank on mobile
		- https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
- an absolutely positioned menu at the bottom
	- book selection
	- reference search
	- eventually, word search
- footer
	- about page
	- home page
	- eventually, a pleasant ad
- not horrible on iOS when saved to the home page
	- `<meta name="apple-mobile-web-app-capable" content="yes">`
	- if in full screen mode:
		- `const isFullScreenIos = () => !!window.navigator.standalone`
		- load route/position from store
			- navigate to the route
			- after the first navigation, load the position
		- serialize route/position after every navigation
	- need to: update asr-scroll-position to emit something whenever it saves position


# Should be pretty great

- make the number of chapter numbers displayed based on the viewport height
- initial-load performance
	- move the built book text to `public/books/*.json`
	- lazy-load books with https://github.com/TehShrike/dynamic-import-iife
- bookmarks
	- ???
- search
	- implement on the server maybe?  gotta see how big the database is
	- make a map of english words to Strong's numbers
	- find a database of Strong's numbers to book/chapter/verse
	- when you search for terms, pull all the Strong's numbers for those words, then find all verses that match them
	- rank higher if the verse contains the actual strings that were typed in to the search
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
- make large books render faster
	- try chunking up the books into 5 chapters at a time, and then after changing to the main.text state, add in chunks of 5 chapters at a time on each animation frame until they're all added

# Would be nice

- offline
	- store books locally
	- add proper offline support
- dark mode
- make the app JS bundle smaller
	- move chromatism use to a script generator (pre-calculate book-of-the-bible-colors)
