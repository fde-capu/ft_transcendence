ft_transcendence
Checklist based on sub. 12.1

 - [ ] Online user not showing..?


 - [ ] VERIFY: you must use the latest stable version of every library or framework used in your project.
 - [ ] On Chat: disable Private Messaging from u2u when user is already on chat.
 - [ ] Solve all TODOs all around.
 - [ ] Graphic options screen?
 - [ ] Ready/Unready button.
 - [ ] Not only who is playing, but expectators and everyone in game rooms are given as INGAME. Maybe put only who is actualy playing.

--- Warning found: ---

- When installing frontend packs
npm WARN deprecated @npmcli/move-file@2.0.1: This functionality has been moved 
to @npmcli/fs
npm WARN deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-cod
ec instead

> ng serve --host 0.0.0.0 --disable-host-check --watch --configuration development
Warning: Running a server with --disable-host-check is a security risk. See 
https://medium.com/webpack/webpack-dev-server-middleware-security-issues-1489d950874a for more information

- On install backend pack
npm WARN deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-cod
ec instead

- On frontend and backedn npm build:
MANY TIMES REPEATED:
npm WARN tar TAR_ENTRY_ERROR EINVAL: invalid argument, fchown

- On finished Compilation of frontend:
frontend                    | Warning: /app/node_modules/angularx-qrcode/fesm2020/angularx-qrcode.mjs depends on 'qrcode'. CommonJS 
or AMD dependencies can cause optimization bailouts.
frontend                    | For more info see: https://angular.io/guide/build#configuring-commonjs-dependencies

... when entering a game, got once:
	TypeError: p.setVelocity is not a function
			at game.entity.ts:341:28

--- OLDIES ---

 - [X] CONFIGURAÇÕES DE COMPATIBILIDADE COM FIREFOX ou SAFARI ou OUTRO?: Google Chrome and one additional web browser of your choice.
 - [X] (?) VALIDAÇÃO: Server-side validation for forms and any user input. (Feito apenas 4 <= string.length <= 42)
 - [X] (?) INJEÇÃO: Your website must be protected against SQL injections. (nativo no Angular).
 - [X] (?) HASHEAMENTO: Any password stored in your database must be hashed. (Não armazenamos nenhum password na DB.) (...) Please make sure you use a strong password hashing algorithm.
 - [X] IMAGEM: The user should be able to upload an avatar. If the user doesn’t upload an avatar, a default one must be set.
 - [X] FINALIZAR ISSO: current status: (online, offline, in a game, and so forth).
 - [X] LADDER
 - [X] ESTATÍSTICAS, FALTAM ITENS: Stats (such as: wins and losses, ladder level, achievements, and so forth) have to be displayed on the user profile.
 - [X] HISTORIES: Adaptar para PONG2 e PONG4. Each user should have a Match History including 1v1 games, ladder, and anything else useful. Anyone who is logged in should be able to consult it.
 - [X] DEIXAR MAIS EXPLÍCITO: (pois atualmente seria só pelo avatarzinho) The user should be able to invite other users to play a Pong game through the chat interface. -- Not done, because invitation is in avatar, which is part of the chat interface.
 - [X] GAMEPLAY
 - [X] WARN[0000] The "FTT_MODE" variable is not set. Defaulting to a blank string. ---> Just remove FTT_MODE=$FTT_MODE line from your .env;
 - [X] Strange behavior when authentication expires. Make it renew automatically if user is still logged. (Solved, not with auto-renew, but user gets logged off without strange behaviors.)
 - [X] When user is kicked from the room, they are only REALLY KICKED after clicking "OK". There is an semi-transparent screen, and they can still read the messages. (Solved: in fact, the user unsubscribes from the chat messages. It might take a few seconds, but new messages cannot be read.)
 - [X] By now, there is no visualization of off-line users, should there be one? See line on "HISTORIES" above, its interpretation. Solved: my interpretation, no need to show off-line users. Note: ladder currently only includes online users, and it's alright.
 - [X] (Solved) When logged off, the frontend page keeps making requests and getting 401 continuously.
 - [X] Users could invite to chat or game event if the other is offline (solved);
 - [X] Game-history was auto-replicating and getting huge!!
 - [X] Private messaging was auto-redirecting inviter w/o asking first.
 - [X] Redirect before notification.
 - [X] Too much blinking on chat-options.
 - [X] Double friends (somehow it was possible to add the same friend twice).
 - [X] Must not be able to invite INGAME nor OFFLINE players.
 - [X] Abrupt logout was leaving the user INCHAT forever.
 - [X] User must get offile if the browser closes.
 - [X] Better behavior on frontend while server is down. (Solution not perfect, still some ERR::CONNECTION CLOSED from browser, but there are not too many anymore);
 - [X] Check if behavior is of with 2FA from 42 API + PONG!
 - [X] Menu-bar blinking when updating.
 - [X] Even if user have blocked you, if you F5 the profile, you still can see everything.
 - [X] Check all "localhost" mentions, make it configService;
 - [X] Main menu is behind avatars... (solved)
 - [X] Re-check layout of chat options screen. Fixed identification by url.
 - [X] Some page refreshment cancels profile edition. (Implemented ProfileCompoenent.editing:boolean.)
 - [X] Profile was buggy when accessing directly through the URL.
 - [X] Invitation has broken during the process and was cleared.
 - [X] On match history, choosing the exibition game mode does not filter properly.
 - [?] Quadrapong and PongDouble failed (frozen) with "ERROR TypeError: p.setVelocity is not a function"@game.component.ts:68
		...I believe this happens due to malfunctioning of fake users.
 - [X] Login is kindda slow, is it some wrong timer?
Issue #83 notes:
 - [X] Lack of PAUSE screen.
 - [X] Good behavior when waiting for another person to come back.
 - [X] Winner is not correctly showing on cut-scene.
 - [X] Entering a paused game does not show the paused screen.
#Issue 99 related marks:
 - [X] Match history to show partial/individual matches on Profile page.
 - [X] Match history could show the date when the match occurred.
 - [X] Does Game History record the timestamp? If so, show it on game history html.
 - [X] BUG Game mode reverts to PONG after any match (even if it was another mode).
 - [X] BIG QUADPONG is bouncing all walls ...?
 Issue #108
 - [X] Check if updates are not messing up form editions.
 ---
 - [X] Rethink upload-image routine for UX.
Other stuff:
Issue #83 notes:
 - [X] Lack of PAUSE screen.
 - [X] Good behavior when waiting for another person to come back.
 - [X] Winner is not correctly showing on cut-scene.
 - [X] Entering a paused game does not show the paused screen.

Issue #103:
 - [X] Game mode should stay the same after match.

#Issue 99 related marks:
 - [X] Match history to show partial/individual matches on Profile page.
 - [X] Match history could show the date when the match occurred.

