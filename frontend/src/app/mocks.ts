import { User } from './user';
import { ChatMessage } from './chat-message';

export const USERS: User[] = [
  { intraId: "blabla", name: 'Blats Bla', image: 'https://foo-url/' },
  { intraId: "bleble", name: 'Blebs Bleuble', image: 'https://foo-url/' },
  { intraId: "blibli", name: 'Blib Lib Blib', image: 'https://foo-url/' },
  { intraId: "bloblo", name: 'Blocoblomo Blo', image: 'https://foo-url/' },
  { intraId: "blublu", name: 'Blumblu Blub', image: 'https://foo-url/' },
  { intraId: "fulde-tal", name: 'Fulano de Tal', image: 'https://foo-url/' },
  { intraId: "tric-mcmi", name: 'Tricia McMillan', image: 'https://foo-url/' },
  { intraId: "marvin---", name: 'Marvin', image: 'https://foo-url/' },
  { intraId: "zaphbeebl", name: 'Zaphod Beeblebrox', image: 'https://foo-url/' },
  { intraId: "arthudent", name: 'Arthur Dent', image: 'https://foo-url/' },
  { intraId: "fordperfe", name: 'Ford Perfect', image: 'https://foo-url/' },
];

export const CHATS: ChatMessage[] = [
  {
	user: USERS[6],
	message: 'Doloris epsum eitch un dastret gonibs functum. Al ma gnardu prepis, la ma dega, unfuctum de miris solinus.'
  },
  {
	user: USERS[8],
	message: 'Lorem ipsum dolor hipsis defnat harocum! Tetus archi quo UBNOSCIOUS! De MODUS dodus operatum TASGARI! Dout me ipinasys cretusculus ne banit a sondelius prunt... Me ne ga fum de ipis rectum!!! Ne med foust et limous terbacitum, ka cest nuch ama greptium donorium bost.'
  },
  {
	user: USERS[9],
	message: 'Plunctus zeit no sact-turnus ome dast a melichom wizcozus per tentclwus de PONG!'
  },
  {
	user: USERS[5],
	message: 'Xexemus!'
  },
  {
	user: USERS[7],
	message: 'Dat totamalasis prun!'
  },
  {
	user: USERS[10],
	message: ':P'
  },
  {
	user: USERS[3],
	message: "              ...            ...shash"
  },
  {
	user: USERS[4],
	message: 'Holo!'
  }
];
