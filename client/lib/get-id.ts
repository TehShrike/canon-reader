export const getChapterNumberId = (number: number): string => `chapter-number-${number}`

export const getChapterVerseId = (chapter: number, verse: number): string => `chapter-${chapter}-verse-${verse}`

export const getBookId = (name: string): string => name.replace(/ /g, '').toLowerCase()
