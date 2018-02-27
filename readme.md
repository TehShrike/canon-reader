What I want a Bible reader to be.

# Design goals

- Uninterrupted reading
	- Unobtrusive/hidden chapter/verse markers
	- No chapter breaks, scroll through the whole book
- Simple navigation
	- Select the book to open it
	- Optionally get scrolled directly to a chapter
	- Keyboard shortcut to type in a reference and navigate to it
- Programmatic link friendly
	- An easy, documented way for other sites to generate a link to a book/chapter/verse
- Fast
	- Text should all be pre-downloaded
	- Opening a new book should take <100ms, including render time
	- No loading spinners

## Stretch goals

- Study-friendly
	- Display original Hebrew/Greek while reading, with Strong's definitions
- Bookmarks
	- Actual bookmarks that you can move forward based on how much you read today, not the "page tags" that most apps call bookmarks
- Crossreferences
	- Source from [OpenBible.info's crossreference database](http://www.openbible.info/labs/cross-references/)

## Not prioritizied

Allowing users to choose between different translations will not be a priority.

Zondervan and their ilk use the threat of ungodly copyright enforcement to coerce people into paying them to use more than a small portion of most popular translations of the Bible.

I am not interested in paying for their licensing.

Nor am I interested in reverting to archaic pre-copyright translations.

I will use the [World English Bible](http://worldenglishbible.org/) translation.  It's a good, freely licensed ASV fork.

[This fork of Pickering's translation of Revelation](https://github.com/TehShrike/pickering-majority-text-revelation) will be used for Revelation.

# Develop

To build and run the app, you will need to install [Node.js](https://nodejs.org/).

Fork this repository and clone the fork to your machine.

```sh
npm install
npm run dev
```

This will build the app and open it in your browser.  The page should automatically refresh as you make changes to the code.

To run the tests:

```sh
npm test
```

# License

[WTFPL](http://wtfpl2.com)
