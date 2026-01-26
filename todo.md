# the 2025 modernization

- destroy the lambda and any other AWS resources

# stuff I feel like doing soon

- search input inline on the home page
- clean up claude css
- make the text in the search results read like it does on the main reader
	- left-aligned
	- same width – able to display info on the right same as I eventually hope to do in the main reader

# Should be pretty useful

- inline greek/hebrew definitions
	- how do you trigger them showing up?
	- download Strong's numbers/definitions from somewhere
	- get greek/hebrew text by book/chapter/verse, with some mapping to Strong's numbers
	- make it look not jank on the right column
	- make it look not jank at the bottom of the screen on mobile
	- come up with some UI for showing or hiding it that doesn't look jank on mobile
		- https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html
- about page
- not horrible on iOS when saved to the home page
	- `<meta name="apple-mobile-web-app-capable" content="yes">`

# Should be pretty great

- some kind of verse crossreference functionality
	- http://www.openbible.info/labs/cross-references/
	- same problem as with the inline word definitions - how do you trigger them, where do you display them
- word search based on Strong's numbers
	- find a database of Strong's numbers to book/chapter/verse
	- when you search for terms, pull all the Strong's numbers for those words, then find all verses that match them
	- rank higher if the verse contains the actual strings that were typed in to the search
- style stuff
	- make the verse numbers on the left line up with the text better
- improve on "three goals" - three use cases?
	- sitting in church looking up a reference
	- sitting at home sitting down and reading for a while
	- internet/water cooler arguments where I want to quickly look up greek/hebrew/crossreferences
- an about page
	- credit WEB, Pickering, Strong, OpenBible.org
- a josh@canonreader.com email address listed on the home/about page
- make `main.reference` a better warning page about bad references
	- wtf does this mean
- favicon
	- make sure the `favicon.ico` served from the root is aggressively cached because of the Chrome reload-on-replaceState bug
	- does this bug still exist in 2026+?  eh, caching is probably still valuable either way
- make large books render faster
	- try chunking up the books into 5 chapters at a time, and then after changing to the main.text state, add in chunks of 5 chapters at a time on each animation frame until they're all added
	- this would cause issues with the "scroll to the anchor once the state navigation is finished" behavior.  This is in the direction of a fairly extreme optimization.  Maybe still worthwhile eventually
- bookmarks
	- ???

# Would be nice

- offline
	- store books locally
	- add proper offline support
- dark mode
- make the app JS bundle smaller
	- move chromatism use to a script generator (pre-calculate book-of-the-bible-colors)
