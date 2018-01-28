import $1chronicles from 'world-english-bible/json/1chronicles.json'
import $1corinthians from 'world-english-bible/json/1corinthians.json'
import $1john from 'world-english-bible/json/1john.json'
import $1kings from 'world-english-bible/json/1kings.json'
import $1peter from 'world-english-bible/json/1peter.json'
import $1samuel from 'world-english-bible/json/1samuel.json'
import $1thessalonians from 'world-english-bible/json/1thessalonians.json'
import $1timothy from 'world-english-bible/json/1timothy.json'
import $2chronicles from 'world-english-bible/json/2chronicles.json'
import $2corinthians from 'world-english-bible/json/2corinthians.json'
import $2john from 'world-english-bible/json/2john.json'
import $2kings from 'world-english-bible/json/2kings.json'
import $2peter from 'world-english-bible/json/2peter.json'
import $2samuel from 'world-english-bible/json/2samuel.json'
import $2thessalonians from 'world-english-bible/json/2thessalonians.json'
import $2timothy from 'world-english-bible/json/2timothy.json'
import $3john from 'world-english-bible/json/3john.json'
import $acts from 'world-english-bible/json/acts.json'
import $amos from 'world-english-bible/json/amos.json'
import $colossians from 'world-english-bible/json/colossians.json'
import $daniel from 'world-english-bible/json/daniel.json'
import $deuteronomy from 'world-english-bible/json/deuteronomy.json'
import $ecclesiastes from 'world-english-bible/json/ecclesiastes.json'
import $ephesians from 'world-english-bible/json/ephesians.json'
import $esther from 'world-english-bible/json/esther.json'
import $exodus from 'world-english-bible/json/exodus.json'
import $ezekiel from 'world-english-bible/json/ezekiel.json'
import $ezra from 'world-english-bible/json/ezra.json'
import $galatians from 'world-english-bible/json/galatians.json'
import $genesis from 'world-english-bible/json/genesis.json'
import $habakkuk from 'world-english-bible/json/habakkuk.json'
import $haggai from 'world-english-bible/json/haggai.json'
import $hebrews from 'world-english-bible/json/hebrews.json'
import $hosea from 'world-english-bible/json/hosea.json'
import $isaiah from 'world-english-bible/json/isaiah.json'
import $james from 'world-english-bible/json/james.json'
import $jeremiah from 'world-english-bible/json/jeremiah.json'
import $job from 'world-english-bible/json/job.json'
import $joel from 'world-english-bible/json/joel.json'
import $john from 'world-english-bible/json/john.json'
import $jonah from 'world-english-bible/json/jonah.json'
import $joshua from 'world-english-bible/json/joshua.json'
import $jude from 'world-english-bible/json/jude.json'
import $judges from 'world-english-bible/json/judges.json'
import $lamentations from 'world-english-bible/json/lamentations.json'
import $leviticus from 'world-english-bible/json/leviticus.json'
import $luke from 'world-english-bible/json/luke.json'
import $malachi from 'world-english-bible/json/malachi.json'
import $mark from 'world-english-bible/json/mark.json'
import $matthew from 'world-english-bible/json/matthew.json'
import $micah from 'world-english-bible/json/micah.json'
import $nahum from 'world-english-bible/json/nahum.json'
import $nehemiah from 'world-english-bible/json/nehemiah.json'
import $numbers from 'world-english-bible/json/numbers.json'
import $obadiah from 'world-english-bible/json/obadiah.json'
import $philemon from 'world-english-bible/json/philemon.json'
import $philippians from 'world-english-bible/json/philippians.json'
import $proverbs from 'world-english-bible/json/proverbs.json'
import $psalms from 'world-english-bible/json/psalms.json'
import $revelation from 'world-english-bible/json/revelation.json'
import $romans from 'world-english-bible/json/romans.json'
import $ruth from 'world-english-bible/json/ruth.json'
import $songofsolomon from 'world-english-bible/json/songofsolomon.json'
import $titus from 'world-english-bible/json/titus.json'
import $zechariah from 'world-english-bible/json/zechariah.json'
import $zephaniah from 'world-english-bible/json/zephaniah.json'

function makeArrayOfSections(book) {
	const sections = []
	let current = null

	const createNew = type => current = { type, children: [] }

	book.forEach(chunk => {
		if (chunk.type === 'paragraph start') {
			createNew('paragraph')
		} else if (chunk.type === 'stanza start') {
			createNew('stanza')
		} else if (chunk.type === 'paragraph end' || chunk.type === 'stanza end') {
			sections.push(current)
			current = null
		} else if (chunk.type === 'break' || chunk.type === 'header') {
			if (current) {
				current.children.push(chunk)
			} else {
				sections.push(chunk)
			}
		} else {
			if (current === null) {
				console.error(chunk)
				throw new Error(`wat`)
			}
			current.children.push({
				chapterNumber: chunk.chapterNumber,
				verseNumber: chunk.verseNumber,
				value: chunk.value,
			})
		}
	})

	return sections
}

export default {
	'1chronicles': makeArrayOfSections($1chronicles),
	'1corinthians': makeArrayOfSections($1corinthians),
	'1john': makeArrayOfSections($1john),
	'1kings': makeArrayOfSections($1kings),
	'1peter': makeArrayOfSections($1peter),
	'1samuel': makeArrayOfSections($1samuel),
	'1thessalonians': makeArrayOfSections($1thessalonians),
	'1timothy': makeArrayOfSections($1timothy),
	'2chronicles': makeArrayOfSections($2chronicles),
	'2corinthians': makeArrayOfSections($2corinthians),
	'2john': makeArrayOfSections($2john),
	'2kings': makeArrayOfSections($2kings),
	'2peter': makeArrayOfSections($2peter),
	'2samuel': makeArrayOfSections($2samuel),
	'2thessalonians': makeArrayOfSections($2thessalonians),
	'2timothy': makeArrayOfSections($2timothy),
	'3john': makeArrayOfSections($3john),
	'acts': makeArrayOfSections($acts),
	'amos': makeArrayOfSections($amos),
	'colossians': makeArrayOfSections($colossians),
	'daniel': makeArrayOfSections($daniel),
	'deuteronomy': makeArrayOfSections($deuteronomy),
	'ecclesiastes': makeArrayOfSections($ecclesiastes),
	'ephesians': makeArrayOfSections($ephesians),
	'esther': makeArrayOfSections($esther),
	'exodus': makeArrayOfSections($exodus),
	'ezekiel': makeArrayOfSections($ezekiel),
	'ezra': makeArrayOfSections($ezra),
	'galatians': makeArrayOfSections($galatians),
	'genesis': makeArrayOfSections($genesis),
	'habakkuk': makeArrayOfSections($habakkuk),
	'haggai': makeArrayOfSections($haggai),
	'hebrews': makeArrayOfSections($hebrews),
	'hosea': makeArrayOfSections($hosea),
	'isaiah': makeArrayOfSections($isaiah),
	'james': makeArrayOfSections($james),
	'jeremiah': makeArrayOfSections($jeremiah),
	'job': makeArrayOfSections($job),
	'joel': makeArrayOfSections($joel),
	'john': makeArrayOfSections($john),
	'jonah': makeArrayOfSections($jonah),
	'joshua': makeArrayOfSections($joshua),
	'jude': makeArrayOfSections($jude),
	'judges': makeArrayOfSections($judges),
	'lamentations': makeArrayOfSections($lamentations),
	'leviticus': makeArrayOfSections($leviticus),
	'luke': makeArrayOfSections($luke),
	'malachi': makeArrayOfSections($malachi),
	'mark': makeArrayOfSections($mark),
	'matthew': makeArrayOfSections($matthew),
	'micah': makeArrayOfSections($micah),
	'nahum': makeArrayOfSections($nahum),
	'nehemiah': makeArrayOfSections($nehemiah),
	'numbers': makeArrayOfSections($numbers),
	'obadiah': makeArrayOfSections($obadiah),
	'philemon': makeArrayOfSections($philemon),
	'philippians': makeArrayOfSections($philippians),
	'proverbs': makeArrayOfSections($proverbs),
	'psalms': makeArrayOfSections($psalms),
	'revelation': makeArrayOfSections($revelation),
	'romans': makeArrayOfSections($romans),
	'ruth': makeArrayOfSections($ruth),
	'songofsolomon': makeArrayOfSections($songofsolomon),
	'titus': makeArrayOfSections($titus),
	'zechariah': makeArrayOfSections($zechariah),
	'zephaniah': makeArrayOfSections($zephaniah),
}
