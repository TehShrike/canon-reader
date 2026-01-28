import type { Book } from '#lib/book_types.ts'
import $1chronicles from '#lib/books/1chronicles.ts'
import $1corinthians from '#lib/books/1corinthians.ts'
import $1john from '#lib/books/1john.ts'
import $1kings from '#lib/books/1kings.ts'
import $1peter from '#lib/books/1peter.ts'
import $1samuel from '#lib/books/1samuel.ts'
import $1thessalonians from '#lib/books/1thessalonians.ts'
import $1timothy from '#lib/books/1timothy.ts'
import $2chronicles from '#lib/books/2chronicles.ts'
import $2corinthians from '#lib/books/2corinthians.ts'
import $2john from '#lib/books/2john.ts'
import $2kings from '#lib/books/2kings.ts'
import $2peter from '#lib/books/2peter.ts'
import $2samuel from '#lib/books/2samuel.ts'
import $2thessalonians from '#lib/books/2thessalonians.ts'
import $2timothy from '#lib/books/2timothy.ts'
import $3john from '#lib/books/3john.ts'
import $acts from '#lib/books/acts.ts'
import $amos from '#lib/books/amos.ts'
import $colossians from '#lib/books/colossians.ts'
import $daniel from '#lib/books/daniel.ts'
import $deuteronomy from '#lib/books/deuteronomy.ts'
import $ecclesiastes from '#lib/books/ecclesiastes.ts'
import $ephesians from '#lib/books/ephesians.ts'
import $esther from '#lib/books/esther.ts'
import $exodus from '#lib/books/exodus.ts'
import $ezekiel from '#lib/books/ezekiel.ts'
import $ezra from '#lib/books/ezra.ts'
import $galatians from '#lib/books/galatians.ts'
import $genesis from '#lib/books/genesis.ts'
import $habakkuk from '#lib/books/habakkuk.ts'
import $haggai from '#lib/books/haggai.ts'
import $hebrews from '#lib/books/hebrews.ts'
import $hosea from '#lib/books/hosea.ts'
import $isaiah from '#lib/books/isaiah.ts'
import $james from '#lib/books/james.ts'
import $jeremiah from '#lib/books/jeremiah.ts'
import $job from '#lib/books/job.ts'
import $joel from '#lib/books/joel.ts'
import $john from '#lib/books/john.ts'
import $jonah from '#lib/books/jonah.ts'
import $joshua from '#lib/books/joshua.ts'
import $jude from '#lib/books/jude.ts'
import $judges from '#lib/books/judges.ts'
import $lamentations from '#lib/books/lamentations.ts'
import $leviticus from '#lib/books/leviticus.ts'
import $luke from '#lib/books/luke.ts'
import $malachi from '#lib/books/malachi.ts'
import $mark from '#lib/books/mark.ts'
import $matthew from '#lib/books/matthew.ts'
import $micah from '#lib/books/micah.ts'
import $nahum from '#lib/books/nahum.ts'
import $nehemiah from '#lib/books/nehemiah.ts'
import $numbers from '#lib/books/numbers.ts'
import $obadiah from '#lib/books/obadiah.ts'
import $philemon from '#lib/books/philemon.ts'
import $philippians from '#lib/books/philippians.ts'
import $proverbs from '#lib/books/proverbs.ts'
import $psalms from '#lib/books/psalms.ts'
import $revelation from '#lib/books/revelation.ts'
import $romans from '#lib/books/romans.ts'
import $ruth from '#lib/books/ruth.ts'
import $songofsolomon from '#lib/books/songofsolomon.ts'
import $titus from '#lib/books/titus.ts'
import $zechariah from '#lib/books/zechariah.ts'
import $zephaniah from '#lib/books/zephaniah.ts'

const bible_books_map: Record<string, Book> = {
	'1chronicles': $1chronicles,
	'1corinthians': $1corinthians,
	'1john': $1john,
	'1kings': $1kings,
	'1peter': $1peter,
	'1samuel': $1samuel,
	'1thessalonians': $1thessalonians,
	'1timothy': $1timothy,
	'2chronicles': $2chronicles,
	'2corinthians': $2corinthians,
	'2john': $2john,
	'2kings': $2kings,
	'2peter': $2peter,
	'2samuel': $2samuel,
	'2thessalonians': $2thessalonians,
	'2timothy': $2timothy,
	'3john': $3john,
	acts: $acts,
	amos: $amos,
	colossians: $colossians,
	daniel: $daniel,
	deuteronomy: $deuteronomy,
	ecclesiastes: $ecclesiastes,
	ephesians: $ephesians,
	esther: $esther,
	exodus: $exodus,
	ezekiel: $ezekiel,
	ezra: $ezra,
	galatians: $galatians,
	genesis: $genesis,
	habakkuk: $habakkuk,
	haggai: $haggai,
	hebrews: $hebrews,
	hosea: $hosea,
	isaiah: $isaiah,
	james: $james,
	jeremiah: $jeremiah,
	job: $job,
	joel: $joel,
	john: $john,
	jonah: $jonah,
	joshua: $joshua,
	jude: $jude,
	judges: $judges,
	lamentations: $lamentations,
	leviticus: $leviticus,
	luke: $luke,
	malachi: $malachi,
	mark: $mark,
	matthew: $matthew,
	micah: $micah,
	nahum: $nahum,
	nehemiah: $nehemiah,
	numbers: $numbers,
	obadiah: $obadiah,
	philemon: $philemon,
	philippians: $philippians,
	proverbs: $proverbs,
	psalms: $psalms,
	revelation: $revelation,
	romans: $romans,
	ruth: $ruth,
	songofsolomon: $songofsolomon,
	titus: $titus,
	zechariah: $zechariah,
	zephaniah: $zephaniah,
}

export default bible_books_map
