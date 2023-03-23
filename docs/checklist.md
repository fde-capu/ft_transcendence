ft_transcendence
Checklist based on sub. 12.1

[ ]	VERIFICAR: you must use the latest stable version of every library or framework used in your project.
[ ] CONFIGURAÇÕES DE COMPATIBILIDADE COM FIREFOX ou SAFARI ou OUTRO?: Google Chrome and one additional web browser of your choice.
[?]	HASHEAMENTO: Any password stored in your database must be hashed. (Não armazenamos nenhum password na DB.) (...) Please make sure you use a strong password hashing algorithm.
[?] INJEÇÃO: Your website must be protected against SQL injections. (nativo no Angular).
[?] VALIDAÇÃO: Server-side validation for forms and any user input. (Feito apenas 4 <= string.length <= 42)
[ ] IMAGEM: The user should be able to upload an avatar. If the user doesn’t upload an avatar, a default one must be set.
[X] FINALIZAR ISSO: current status: (online, offline, in a game, and so forth).
[X] LADDER
[X] ESTATÍSTICAS, FALTAM ITENS: Stats (such as: wins and losses, ladder level, achievements, and so forth) have to be displayed on the user profile.
[X] HISTORIES: Adaptar para PONG2 e PONG4. Each user should have a Match History including 1v1 games, ladder, and anything else useful. Anyone who is logged in should be able to consult it.
[X] DEIXAR MAIS EXPLÍCITO: (pois atualmente seria só pelo avatarzinho) The user should be able to invite other users to play a Pong game through the chat interface. -- Not done, because invitation is in avatar, which is part of the chat interface.
[ ] MATCHMAKING SYSTEM: (automática/aleatória): the user can join a queue until they get automatically matched with someone else.
[ ] RESPONSIVO: The game must be responsive! (Não tenho certeza do que está implícito aqui, afinal...)
[ ] GAMEPLAY
[ ] DEPLOY: docker-compose up --build
... [ ] Cors?

Bug notes:
[X] WARN[0000] The "FTT_MODE" variable is not set. Defaulting to a blank string. 
---> Just remove FTT_MODE=$FTT_MODE line from your .env;
[X] Strange behavior when authentication expires. Make it renew automatically if user is still logged. (Solved, not with auto-renew, but user gets logged off without strange behaviors.)
[X] When user is kicked from the room, they are only REALLY KICKED after clicking "OK". There is an semi-transparent screen, and they can still read the messages. (Solved: in fact, the user unsubscribes from the chat messages. It might take a few seconds, but new messages cannot be read.)
[X] By now, there is no visualization of off-line users, should there be one? See line on "HISTORIES" above, its interpretation. Solved: my interpretation, no need to show off-line users. Note: ladder currently only includes online users, and it's alright.
[X] (Solved) When logged off, the frontend page keeps making requests and getting 401 continuously.
[X] Users could invite to chat or game event if the other is offline (solved);
[X] Game-history was auto-replicating and getting huge!!
[X] Private messaging was auto-redirecting inviter w/o asking first.
[X] Redirect before notification.
[X] Too much blinking on chat-options.
[X] Double friends (somehow it was possible to add the same friend twice).
[X] Must not be able to invite INGAME nor OFFLINE players.
[X] Abrupt logout was leaving the user INCHAT forever.
[X] User must get offile if the browser closes.
[X] Better behavior on frontend while server is down. (Solution not perfect, still some ERR::CONNECTION CLOSED from browser, but there are not too many anymore);
[X] Check if behavior is of with 2FA from 42 API + PONG!
[X] Menu-bar blinking when updating.


- When installing frontend packs
npm WARN deprecated @npmcli/move-file@2.0.1: This functionality has been moved 
to @npmcli/fs
npm WARN deprecated sourcemap-codec@1.4.8: Please use @jridgewell/sourcemap-cod
ec instead

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
