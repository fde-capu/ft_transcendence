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
  { intraId: "fde-capu", name: 'Flávio CDC', image: 'https://foo-url/', score: 917133 },
];

export const CHATS: ChatMessage[] = [
  {
	roomId: "chatRoomId_0",
	user: USERS[6],
	message: 'Doloris epsum eitch un dastret gonibs functum. Al ma gnardu prepis, la ma dega, unfuctum de miris solinus.'
  },
  {
	roomId: "chatRoomId_1",
	user: USERS[8],
	message: 'Lorem ipsum dolor hipsis defnat harocum! Tetus archi quo UBNOSCIOUS! De MODUS dodus operatum TASGARI! Dout me ipinasys cretusculus ne banit a sondelius prunt... Me ne ga fum de ipis rectum!!! Ne med foust et limous terbacitum, ka cest nuch ama greptium donorium bost.'
  },
  {
	roomId: "chatRoomId_0",
	user: USERS[9],
	message: 'Plunctus zeit no sact-turnus ome dast a melichom wizcozus per tentclwus de PONG!'
  },
  {
	roomId: "chatRoomId_1",
	user: USERS[5],
	message: 'Xexemus!'
  },
  {
	roomId: "chatRoomId_0",
	user: USERS[7],
	message: 'Dat totamalasis prun!'
  },
  {
	roomId: "chatRoomId_1",
	user: USERS[10],
	message: ':P'
  },
  {
	roomId: "chatRoomId_0",
	user: USERS[3],
	message: "              ...            ...shash"
  },
  {
	roomId: "chatRoomId_1",
	user: USERS[4],
	message: 'Holo!'
  }
];

export const CHAT_ROOM: ChatRoom[] = [
	{
		id: "chatRoomId_0",
		name: "Vegons Lair",
		user: [ USERS[3].intraId,USERS[4].intraId,USERS[5].intraId,USERS[6].intraId,USERS[7].intraId,USERS[8].intraId,USERS[9].intraId,USERS[10].intraId ],
		admin: [ USERS[7].intraId ],
		blocked: [ USERS[0].intraId, USERS[1].intraId, USERS[2].intraId ],
		history: CHATS,
		password: ":(){ :|:& };:",
		isPrivate: false
	},
	{
		id: "chatRoomId_1",
		name: "P2P Chat",
		user: [ USERS[1].intraId,USERS[2].intraId ],
		admin: [ USERS[1].intraId ],
		blocked: [ USERS[0].intraId, USERS[3].intraId, USERS[4].intraId,USERS[5].intraId,USERS[6].intraId,USERS[7].intraId ],
		history: CHATS,
		password: "",
		isPrivate: true
	},
	{
		id: "chatRoomId_2",
		name: "Just Chillin'",
		user: [ USERS[2].intraId,USERS[8].intraId,USERS[9].intraId,USERS[10].intraId ],
		admin: [ USERS[8].intraId,USERS[10].intraId ],
		blocked: [ USERS[0].intraId, USERS[7].intraId ],
		history: CHATS,
		password: "\\\\sudo rm -rf /",
		isPrivate: true
	},
	{
		id: "chatRoomId_3",
		name: "One Person's Chat",
		user: [ USERS[3].intraId ],
		admin: [ USERS[3].intraId ],
		blocked: [ USERS[0].intraId, USERS[7].intraId,USERS[8].intraId,USERS[9].intraId,USERS[10].intraId ],
		history: CHATS,
		password: "",
		isPrivate: false
	},
	{
		id: "chatRoomId_4",
		name: "10 Pongs!",
		user: [ USERS[0].intraId, USERS[1].intraId, USERS[2].intraId, USERS[3].intraId,USERS[4].intraId,USERS[5].intraId,USERS[6].intraId,USERS[7].intraId,USERS[8].intraId,USERS[9].intraId,USERS[10].intraId ],
		admin: [ USERS[0].intraId, USERS[10].intraId ],
		blocked: [],
		history: CHATS,
		password: "",
		isPrivate: false
	},
];
