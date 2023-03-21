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

Bug notes:
[ ] WARN[0000] The "FTT_MODE" variable is not set. Defaulting to a blank string. 
[X] Strange behavior when authentication expires. Make it renew automatically if user is still logged. (Solved, not with auto-renew, but user gets logged off without strange behaviors.)
[X] When user is kicked from the room, they are only REALLY KICKED after clicking "OK". There is an semi-transparent screen, and they can still read the messages. (Solved: in fact, the user unsubscribes from the chat messages. It might take a few seconds, but new messages cannot be read.)
[ ] By now, there is no visualization of off-line users, should there be one? See line on "HISTORIES" above, its interpretation.
[X] (Solved) When logged off, the frontend page keeps making requests and getting 401 continuously.
