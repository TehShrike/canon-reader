export const get_chapter_number_id = (number: number): string => `chapter-number-${number}`

export const get_chapter_verse_id = (chapter: number, verse: number): string => `chapter-${chapter}-verse-${verse}`

export const get_book_id = (name: string): string => name.replace(/ /g, '').toLowerCase()
