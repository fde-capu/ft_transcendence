ft_transcendence
Checklist based on sub. 12.1

[ ]	VERIFICAR: you must use the latest stable version of every library or framework used in your project.
[ ] CONFIGURAÇÕES DE COMPATIBILIDADE COM FIREFOX ou SAFARI ou OUTRO?: Google Chrome and one additional web browser of your choice.
[?]	HASHEAMENTO: Any password stored in your database must be hashed. (Não armazenamos nenhum password na DB.) (...) Please make sure you use a strong password hashing algorithm.
[?] INJEÇÃO: Your website must be protected against SQL injections. (nativo no Angular).
[?] VALIDAÇÃO: Server-side validation for forms and any user input. (Feito apenas 4 <= string.length <= 42)
[ ] IMAGEM: The user should be able to upload an avatar. If the user doesn’t upload an avatar, a default one must be set.
[ ] FINALIZAR ISSO: current status: (online, offline, in a game, and so forth).
[X] LADDER
[ ] ESTATÍSTICAS, FALTAM ITENS: Stats (such as: wins and losses, ladder level, achievements, and so forth) have to be displayed on the user profile.
[X] HISTORIES: Adaptar para PONG2 e PONG4. Each user should have a Match History including 1v1 games, ladder, and anything else useful. Anyone who is logged in should be able to consult it.
[ ] DEIXAR MAIS EXPLÍCITO: (pois atualmente seria só pelo avatarzinho) The user should be able to invite other users to play a Pong game through the chat interface.
[ ] MATCHMAKING SYSTEM: (automática/aleatória): the user can join a queue until they get automatically matched with someone else.
[ ] RESPONSIVO: The game must be responsive! (Não tenho certeza do que está implícito aqui, afinal...)
[ ] GAMEPLAY
[ ] DEPLOY: docker-compose up --build

Bug notes:
[ ] WARN[0000] The "FTT_MODE" variable is not set. Defaulting to a blank string. 
[ ] Strange behavior when authentication expires. Make it renew automatically if user is still logged.
[ ] When user is kicked from the room, they are only REALLY KICKED after clicking "OK". There is an semi-transparent screen, and they can still read the messages.
[ ] By now, there is no visualization of off-line users, should there be one? See line on "HISTORIES" above, its interpretation.
