import { User } from './user';
import { ChatMessage } from './chat-message';
import { ChatRoom } from './chat-room';

export const USERS: User[] = [
  { intraId: "blabla", name: 'Blats Bla', image: 'https://foo-url/', score: 33988 },
  { intraId: "bleble", name: 'Blebs Bleuble', image: 'https://foo-url/', score: 74989 },
  { intraId: "blibli", name: 'Blib Lib Blib', image: 'https://foo-url/', score: 484820 },
  { intraId: "bloblo", name: 'Blocoblomo Blo', image: 'https://foo-url/', score: 45868 },
  { intraId: "blublu", name: 'Blumblu Blub', image: 'https://foo-url/', score: 34365 },
  { intraId: "fulde-tal", name: 'Fulano de Tal', image: 'https://foo-url/', score: 62818 },
  { intraId: "tric-mcmi", name: 'Tricia McMillan', image: 'https://foo-url/', score: 90244 },
  { intraId: "marvin---", name: 'Marvin', image: 'https://foo-url/', score: 97072 },
  { intraId: "zaphbeebl", name: 'Zaphod Beeblebrox', image: 'https://foo-url/', score: 7204 },
  { intraId: "arthudent", name: 'Arthur Dent', image: 'https://foo-url/', score: 18939 },
  { intraId: "fordperfe", name: 'Ford Perfect', image: 'https://foo-url/', score: 11374 },
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

export const CHAT_ROOM: ChatRoom[] = [
	{
		id: "chatRoomId_0",
		name: "Vegons Lair",
		user: [ USERS[3],USERS[4],USERS[5],USERS[6],USERS[7],USERS[8],USERS[9],USERS[10] ],
		admin: [ USERS[7] ],
		blocked: [ USERS[0], USERS[1], USERS[2] ],
		history: CHATS,
		password: ":(){ :|:& };:",
		isPrivate: false
	},
	{
		id: "chatRoomId_1",
		name: "P2P Chat",
		user: [ USERS[1],USERS[2] ],
		admin: [ USERS[1] ],
		blocked: [ USERS[0], USERS[3], USERS[4],USERS[5],USERS[6],USERS[7] ],
		history: CHATS,
		password: "",
		isPrivate: true
	},
	{
		id: "chatRoomId_2",
		name: "Just Chillin'",
		user: [ USERS[2],USERS[8],USERS[9],USERS[10] ],
		admin: [ USERS[8],USERS[10] ],
		blocked: [ USERS[0], USERS[7] ],
		history: CHATS,
		password: "\\\\sudo rm -rf /",
		isPrivate: true
	},
	{
		id: "chatRoomId_3",
		name: "One Person's Chat",
		user: [ USERS[3] ],
		admin: [ USERS[3] ],
		blocked: [ USERS[0], USERS[7],USERS[8],USERS[9],USERS[10] ],
		history: CHATS,
		password: "",
		isPrivate: false
	},
	{
		id: "chatRoomId_4",
		name: "10 Pongs!",
		user: [ USERS[0], USERS[1], USERS[2], USERS[3],USERS[4],USERS[5],USERS[6],USERS[7],USERS[8],USERS[9],USERS[10] ],
		admin: [ USERS[0], USERS[10] ],
		blocked: [],
		history: CHATS,
		password: "",
		isPrivate: false
	},
];
