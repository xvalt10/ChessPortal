package application.sockets;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import application.domain.Game;
import application.domain.Move;
import application.domain.Player;
import application.domain.Useraccount;
import application.services.UserService;
import application.util.GameTimeType;

@Component
//@Singleton
public class UserSessionHandler {

	@Autowired
	UserService userService;

	private final Map<String, Player> sessions = new ConcurrentHashMap<>();
	private final Map<String, Game> games = new ConcurrentHashMap<>();
	
	public Player getPlayerByName(String username) {
		return sessions.get(username);
	}

	public void addSession(WebSocketSession session, Useraccount userAccount) {
		// System.out.println("Adding new session");
		Player player = new Player();
		String username = userAccount.getUsername();
		player.setUsername(username);
		player.setPlaying(false);
		player.setSession(session);
		// System.out.println("Session status:" + session.isOpen());

		player.setElobullet(userAccount.getElobullet());
		player.setEloblitz(userAccount.getEloblitz());
		player.setElorapid(userAccount.getElorapid());
		player.setEloclassical(userAccount.getEloclassical());
		sessions.put(username, player);

		// System.out.println("Updating session completed." + sessions.size());

	}
	
	public void informPlayerThatOponentDisconnected(String disconnectedPlayer) {
		
		Game game = findGameByPlayer(disconnectedPlayer);
		if(game != null) {
			String oponent = disconnectedPlayer.equals(game.getWhitePlayer().getUsername()) ? game.getBlackPlayer().getUsername():game.getWhitePlayer().getUsername();
			JsonProvider provider = JsonProvider.provider();
			JsonObject oponentDisconnectedMessage = provider.createObjectBuilder().add("action", "oponentDisconnected").add("oponent", oponent)
					.build();
			sendMessageToSession(sessions.get(oponent).getSession(), oponentDisconnectedMessage);
		}
		
	}

	public void removeSession(WebSocketSession session) {
		System.out.println("Removing new session");
		System.out.println(sessions.size());
		if (session.getPrincipal() != null) {
			sessions.remove(session.getPrincipal().getName());
		}
		System.out.println(sessions.size());
	}

	public void updateSessionSeekDetails(JsonObject message) {

		Player player = sessions.get(message.getString("user"));
		if (player != null) {
			player.setTime(message.getInt("time"));
			player.setIncrement(message.getInt("increment"));
		}
	}

	public void seekOponent(JsonObject message) {
		updateSessionSeekDetails(message);
		System.out.println("Message:" + message.toString());
		Player myPlayer = sessions.get(message.getString("user"));
		String myUsername = message.getString("user");

		myPlayer.setSeeking(true);

		/*
		 * while ( //!oponentFound && !myPlayer.isPlaying()) {
		 */
		for (String oponentsUserName : sessions.keySet()) {

			Player oponent = sessions.get(oponentsUserName);

			if ((!myPlayer.isPlaying() && oponent != null && oponent.isSeeking()
					&& !myUsername.equals(oponentsUserName)) && (oponent.getTime() == message.getInt("time"))
					&& (oponent.getIncrement() == message.getInt("increment"))) {

				if (oponent.isSeeking()) {
					myPlayer.setSeeking(false);
					oponent.setSeeking(false);
					myPlayer.setPlaying(true);
					oponent.setPlaying(true);
					startGame(myPlayer, oponent, oponent.getTime(), oponent.getIncrement());
				}
				break;

			}

		}
	}

	public Game findGameByPlayer(String observedPlayer) {
		return games.values().stream()
				.filter(gameFromCollection -> gameFromCollection.getWhitePlayer().getUsername().equals(observedPlayer)
						|| gameFromCollection.getBlackPlayer().getUsername().equals(observedPlayer))
				.findFirst().orElse(null);
	}

	public void startGame(Player whitePlayer, Player blackPlayer, int time, int increment) {
		Game newGame = new Game(whitePlayer, blackPlayer, time, increment);
		List<String> gameIds = games.values().stream().filter(game->game.getWhitePlayer().getUsername().equals(whitePlayer.getUsername())||
				game.getBlackPlayer().getUsername().equals(blackPlayer.getUsername())).map(Game::getGameId).collect(Collectors.toList());
		gameIds.forEach(gameId -> games.remove(gameId));
		games.put(newGame.getGameId(), newGame);

		JsonObject gameProperties = createGameIdMessage(newGame.getGameId());

		sendMessageToSession(whitePlayer.getSession(), gameProperties);

		sendMessageToSession(blackPlayer.getSession(), gameProperties);

		whitePlayer.setPlaying(true);
		blackPlayer.setPlaying(true);
	}

	private int getPlayerEloBasedOnGameTime(Player player, GameTimeType gameTimeType) {
		int elo = 0;
		switch (gameTimeType) {
		case BULLET:
			elo = player.getElobullet();
			break;
		case BLITZ:
			elo = player.getEloblitz();
			break;
		case RAPID:
			elo = player.getElorapid();
			break;
		case CLASSICAL:
			elo = player.getEloclassical();
			break;
		}

		return elo;
	}

	private void setPlayerEloBasedOnGameTime(Player player, GameTimeType gameTymeType, int elo) {

		switch (gameTymeType) {
		case BULLET:
			player.setElobullet(elo);
			break;
		case BLITZ:
			player.setEloblitz(elo);
			break;
		case RAPID:
			player.setElorapid(elo);
			break;
		case CLASSICAL:
			player.setEloclassical(elo);
			break;
		}

	}

	private JsonObject createGameIdMessage(String gameId) {
		JsonProvider provider = JsonProvider.provider();
		JsonObject gameIdMessage = provider.createObjectBuilder().add("action", "startGame").add("gameId", gameId)
				.build();
		System.out.println("GameId message:" + gameIdMessage.toString());
		return gameIdMessage;
	}

	private JsonObject createGameInfoMessage(Game game) {
		JsonProvider provider = JsonProvider.provider();
		JsonObject whitePlayer = provider.createObjectBuilder().add("username", game.getWhitePlayer().getUsername())
				.add("elo", getPlayerEloBasedOnGameTime(game.getWhitePlayer(), game.getGameTimeType())).build();
		JsonObject blackPlayer = provider.createObjectBuilder().add("username", game.getBlackPlayer().getUsername())
				.add("elo", getPlayerEloBasedOnGameTime(game.getBlackPlayer(), game.getGameTimeType())).build();
		JsonObject addMessage = provider.createObjectBuilder().add("action", "gameInfo").add("whitePlayer", whitePlayer)
				// .add("whitePlayerElo", game.getWhitePlayer().getElo())
				.add("blackPlayer", blackPlayer)
				// .add("blackPlayerElo", game.getBlackPlayer().getElo())
				.add("time", game.getTime()).add("increment", game.getIncrement()).add("gameId", game.getGameId())

				.build();
		System.out.println("Startgame message:" + addMessage.toString());
		return addMessage;
	}

	public void getGameInfo(JsonObject message) {
		Game game = null;

		String gameId = message.getString("gameId");
		String messageAuthor = message.getString("user");

		if (gameId != null && !gameId.isEmpty()) {
			game = games.get(gameId);
		}

		System.out.println("Received Game Info Message");

		if (game != null) {

			JsonObject gameProperties = createGameInfoMessage(game);

			if (messageAuthor.equals(game.getWhitePlayer().getUsername())) {
				System.out.println("Sending response to Game Info Message to:" + game.getWhitePlayer().getUsername());
				sendMessageToSession(game.getWhitePlayer().getSession(), gameProperties);
			} else if (messageAuthor.equals(game.getBlackPlayer().getUsername())) {
				System.out.println("Sending response to Game Info Message to:" + game.getBlackPlayer().getUsername());
				sendMessageToSession(game.getBlackPlayer().getSession(), gameProperties);
			}
		}

	}

	public void offerDraw(JsonObject message) {
		System.out.println("Offering draw.");
		sendMessageToSession(sessions.get(message.getString("oponent")).getSession(), message);

	}

	public void drawOfferReply(JsonObject message) {
		System.out.println("Replying to draw offer.");
		String oponent = sessions.get(message.getString("oponent")).getUsername();
		/*
		 * Player player2 = sessions.get(message.getString("player")); boolean
		 * drawAccepted = message.getBoolean("acceptDraw");
		 */
		sendMessageToSession(sessions.get(oponent).getSession(), message);
		/*
		 * if (drawAccepted) { System.out.println("Draw accepted. Ending game."); int
		 * myNewElo = message.getInt("myNewElo"); int oponentsNewElo =
		 * message.getInt("oponentsNewElo");
		 * 
		 * endGame(player1, player2); }
		 */

	}

	public void endGame(Game game, int eloAfterGameWhite, int eloAfterGameBlack) {

		Player whitePlayer = game.getWhitePlayer();
		Player blackPlayer = game.getBlackPlayer();
		GameTimeType gameTimeType = game.getGameTimeType();

		setPlayerEloBasedOnGameTime(whitePlayer, gameTimeType, eloAfterGameWhite);
		setPlayerEloBasedOnGameTime(blackPlayer, gameTimeType, eloAfterGameBlack);

		userService.updateElo(userService.getUserAccount(whitePlayer.getUsername()).getUserId(), eloAfterGameWhite,
				gameTimeType);
		userService.updateElo(userService.getUserAccount(blackPlayer.getUsername()).getUserId(), eloAfterGameBlack,
				gameTimeType);

		whitePlayer.setPlaying(false);
		blackPlayer.setPlaying(false);

		if (game != null) {
			games.remove(game.getGameId());
		}
	}

	public void processGameResult(JsonObject message) {

		String gameId = message.getString("gameId");
		String oponent = message.getString("oponent");
		int whitePlayerElo = message.getInt("whitePlayerElo");
		int blackPlayerElo = message.getInt("blackPlayerElo");
		Game game = games.get(gameId);

		if (game != null) {

			endGame(game, whitePlayerElo, blackPlayerElo);

			Set<String> usersToForwardMessageTo = game.getObservers().stream().map(Player::getUsername)
					.collect(Collectors.toSet());
			usersToForwardMessageTo.add(oponent);
			sendMessageToMultipleUsers(usersToForwardMessageTo, message);
		}
	}

	public void addObserverToGame(Game game, String observerName) {
		Player observer = sessions.get(observerName);
		if (observer != null) {
			game.getObservers().add(observer);
		}
	}

	public void makeMove(JsonObject message) {
		String gameId = message.getString("gameId");
		boolean whiteMove = message.getBoolean("whiteMove");
		String annotatedMove = message.getString("annotatedMove");
		String chessboardAfterMove = message.getString("chessboardAfterMove");
		String opponent = message.getString("oponent");
		int whiteTime = message.getInt("whiteTime");
		int blackTime = message.getInt("blackTime");

		Game game = games.get(gameId);

		if (whiteMove) {
			Move move = new Move();
			int moveNumber = game.getAnnotatedMoves().size() + 1;
			move.setMoveNumber(moveNumber);
			move.setWhiteMove(annotatedMove);
			move.setBlackTime(blackTime);
			move.setWhiteTime(whiteTime);
			move.setChessboardAfterWhiteMove(chessboardAfterMove);

			game.getAnnotatedMoves().put(moveNumber, move);
		} else {
			int moveNumber = game.getAnnotatedMoves().size();
			Move move = game.getAnnotatedMoves().get(moveNumber);
			move.setBlackMove(annotatedMove);
			move.setBlackTime(blackTime);
			move.setWhiteTime(whiteTime);
			move.setChessboardAfterBlackMove(chessboardAfterMove);
		}
		Set<String> usersToForwardMessageTo = game.getObservers().stream().map(Player::getUsername)
				.collect(Collectors.toSet());
		usersToForwardMessageTo.add(opponent);
		sendMessageToMultipleUsers(usersToForwardMessageTo, message);

	}

	/*
	 * private JsonObject createMoveMessage(String moveInfo) { JsonProvider provider
	 * = JsonProvider.provider(); JsonObject addMessage =
	 * provider.createObjectBuilder() .add("action", "move").add("moveInfo",
	 * moveInfo).build(); return addMessage; }
	 */

	public void getAllPlayersOnline(JsonObject message) {
		int numberOfPlayingPlayers = 0;
		JsonProvider provider = JsonProvider.provider();
		JsonArrayBuilder playersArray = provider.createArrayBuilder();

		Set<Map.Entry<String, Player>> playersOnline = sessions.entrySet();
		for (Map.Entry<String, Player> player : playersOnline) {
			Player playerInfo = player.getValue();
			JsonObject jsonPlayerObject = provider.createObjectBuilder().add("name", player.getKey())
					.add("elo", playerInfo.getEloblitz()).add("isPlaying", playerInfo.isPlaying())
					.add("isSeeking", playerInfo.isSeeking()).build();
			if (playerInfo.isPlaying()) {
				numberOfPlayingPlayers++;
			}
			playersArray.add(jsonPlayerObject);
		}

		JsonObject playersOnlineMessage = provider.createObjectBuilder().add("action", "getPlayersOnline")
				.add("players", playersArray).add("gamesInProgress", Math.floor(numberOfPlayingPlayers / 2)).build();
		Player user = sessions.get(message.getString("user"));
		if (user != null && user.getSession() != null) {

			sendMessageToSession(sessions.get(message.getString("user")).getSession(), playersOnlineMessage);
		} else {
			System.out.println("Following user was not found:" + message.getString("user"));
		}
	}

	public void getCountOfPlayersOnline(JsonObject message) {
		int playersOnline = sessions.size();
		JsonProvider provider = JsonProvider.provider();
		JsonObject playersOnlineMessage = provider.createObjectBuilder().add("action", "countOfPlayersOnline")
				.add("count", playersOnline).build();
		if (sessions.get(message.getString("user")).getSession() != null) {
			sendMessageToSession(sessions.get(message.getString("user")).getSession(), playersOnlineMessage);
		}

	}

	public void offerRematch(JsonObject message) {
		String oponent = message.getString("oponent");
		WebSocketSession session = sessions.get(oponent).getSession();
		boolean oponentonline = session != null;

		if (oponentonline) {
			sendMessageToSession(session, message);
		}

	}

	public void processRematchOfferReply(JsonObject message) {
		boolean rematchOfferAccepted = message.getBoolean("acceptRematchOffer");

		if (rematchOfferAccepted) {
			String whitePlayerName = message.getString("whitePlayer");
			String blackPlayerName = message.getString("blackPlayer");
			int time = message.getInt("time");
			int increment = message.getInt("increment");
			Player whitePlayer = sessions.get(whitePlayerName);
			Player blackPlayer = sessions.get(blackPlayerName);
			if (whitePlayer != null && blackPlayer != null) {
				startGame(whitePlayer, blackPlayer, time, increment);
			}
		}

	}

	public void sendChatMessage(JsonObject message) {
		sendMessageToAllConnectedSessions(message);
	}

	public void sendMessageToSession(WebSocketSession session, JsonObject message) {
		try {
			session.sendMessage(new TextMessage(message.toString()));

		} catch (IOException ex) {
			// sessions.remove(session);
			Logger.getLogger(UserSessionHandler.class.getName()).log(Level.SEVERE, null, ex);
		} catch (IllegalStateException ex) {
			System.out.println("Caugh illegal state exception");
			sendMessageToSession(session, message);
		}
	}

	private void sendMessageToMultipleUsers(Set<String> users, JsonObject message) {
		for (String user : users) {
			if(sessions.get(user)!=null) {
			sendMessageToSession(sessions.get(user).getSession(), message);}
		}
	}

	private void sendMessageToAllConnectedSessions(JsonObject message) {
		for (String username : sessions.keySet()) {
			sendMessageToSession(sessions.get(username).getSession(), message);
		}
	}
}
