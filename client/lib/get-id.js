export const getChapterNumberId = number => `chapter-number-${number}`

export const getChapterVerseId = (chapter, verse) => `chapter-${chapter}-verse-${verse}`

export const getBookId = name => name.replace(/ /g, '').toLowerCase()
