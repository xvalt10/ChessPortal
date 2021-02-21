package application.sockets;

import static application.util.GameUtil.getPlayerEloBasedOnGameTime;
import static application.util.GameUtil.setPlayerEloBasedOnGameTime;

import java.io.IOException;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.spi.JsonProvider;

import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import application.domain.Game;
import application.domain.GameRepository;
import application.domain.Move;
import application.domain.Player;
import application.domain.PlayerRepository;
import application.domain.Tournament;
import application.domain.Useraccount;
import application.services.UserService;
import application.tournaments.TournamentHandler;
import application.util.TimeControl;
import application.util.JpaJsonConverter;

@Component
//@Singleton
public class UserSessionHandler {

	@Autowired
	UserService userService;
	
	@Autowired
	GameRepository gameRepository;
	
	@Autowired
	PlayerRepository playerRepository;
	
	@Autowired
	JpaJsonConverter jpaConverter;
	
	@Autowired
	TournamentHandler tournamentHandler;

	private final Map<String, Player> sessions = new ConcurrentHashMap<>();
	private final Map<String, Game> games = new ConcurrentHashMap<>();

	public Player getPlayerByName(String username) {
		return sessions.get(username);
	}

	public void addNewSession(WebSocketSession session, Player player) {
		
		player.setPlaying(false);
		player.setSession(session);

		sessions.put(player.getUsername(), player);

	}

	public void informPlayerThatOponentDisconnected(String disconnectedPlayer) {

		Game game = findGameByPlayer(disconnectedPlayer);
		if (game != null) {
			Player player = sessions.get(disconnectedPlayer);
			if (player != null) {
				player.setPlaying(false);
				player.setGameId(null);
			}
			String oponentName = disconnectedPlayer.equals(game.getWhitePlayer().getUsername())
					? game.getBlackPlayer().getUsername()
					: game.getWhitePlayer().getUsername();
			Player oponent = sessions.get(oponentName);
			JsonProvider provider = JsonProvider.provider();
			JsonObject oponentDisconnectedMessage = provider.createObjectBuilder().add("action", "oponentDisconnected")
					.add("oponent", oponentName).build();
			if (sessions.get(oponentName) != null) {
				sendMessageToSession(oponent.getSession(), oponentDisconnectedMessage);
			}
			
			if((player == null || !player.isPlaying()) && (oponent == null || !oponent.isPlaying())) {
				games.remove(game.getGameId());
			}
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
			player.setTime(message.getInt("time") * 60 * 1000);
			player.setIncrement(message.getInt("increment") * 1000);
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
					&& !myUsername.equals(oponentsUserName)) && (oponent.getTime() == myPlayer.getTime())
					&& (oponent.getIncrement() == myPlayer.getIncrement())) {

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
				.filter(gameFromCollection -> gameFromCollection.isOngoing()
						&& (gameFromCollection.getWhitePlayer().getUsername().equals(observedPlayer)
								|| gameFromCollection.getBlackPlayer().getUsername().equals(observedPlayer)))
				.findFirst().orElse(null);
	}
	public Game findGameByGameId(String gameId) {
		Game game = games.get(gameId);
		
		return (game != null && game.isOngoing()) ? game : null;
	}

	public Game findTopRatedGameByType(TimeControl gameTimeType) {
		return games.values().stream().filter(game -> game.getGameTimeType().equals(gameTimeType) && game.isOngoing())
				.max(Comparator.comparing(Game::getMaxPlayerRating)).orElse(null);
	}

	public String startGame(Player whitePlayer, Player blackPlayer, int timeInMillis, int incrementInMillis) {
		Game newGame = new Game(whitePlayer, blackPlayer, timeInMillis, incrementInMillis);
		
		newGame = gameRepository.save(newGame);
		List<String> gameIds = games.values().stream()
				.filter(game -> game.getWhitePlayer().getUsername().equals(whitePlayer.getUsername())
						|| game.getBlackPlayer().getUsername().equals(blackPlayer.getUsername()))
				.map(Game::getGameId).collect(Collectors.toList());
		gameIds.forEach(gameId -> games.remove(gameId));
		games.put(newGame.getGameId(), newGame);

		JsonObject gameProperties = createGameIdMessage(newGame);

		System.out.println("sendingMessage startGame to:" + whitePlayer.getUsername());
		sendMessageToSession(whitePlayer.getSession(), gameProperties);

		System.out.println("sendingMessage startGame to:" + blackPlayer.getUsername());
		sendMessageToSession(blackPlayer.getSession(), gameProperties);
		
		whitePlayer.setGameId(newGame.getGameId());
		blackPlayer.setGameId(newGame.getGameId());

		whitePlayer.setPlaying(true);
		blackPlayer.setPlaying(true);
		
		return newGame.getGameId();
	}

	private JsonObject createGameIdMessage(Game game) {
		JsonProvider provider = JsonProvider.provider();
		JsonObject gameIdMessage = provider.createObjectBuilder().add("action", "startGame")
				.add("gameId", game.getGameId()).add("whitePlayer", game.getWhitePlayer().getUsername())
				.add("blackPlayer", game.getBlackPlayer().getUsername()).build();
		System.out.println("GameId message:" + gameIdMessage.toString());
		return gameIdMessage;
	}

	private JsonObject createGameInfoMessage(Game game) {
		JsonObjectBuilder jsonObjectBuilder = JsonProvider.provider().createObjectBuilder();
		JsonArrayBuilder movesArrayBuilder = JsonProvider.provider().createArrayBuilder();
		
		ObjectMapper mapper = new ObjectMapper();
		
		for(Map.Entry<Integer,Move> entry: game.getAnnotatedMoves().entrySet()) {
			try {
				movesArrayBuilder.add(mapper.writeValueAsString(entry.getValue()));
			} catch (JsonProcessingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		JsonObject whitePlayer = jsonObjectBuilder.add("username", game.getWhitePlayer().getUsername())
				.add("countrycode", game.getWhitePlayer().getCountrycode() != null ? game.getWhitePlayer().getCountrycode().toLowerCase() : "")
				.add("elo", getPlayerEloBasedOnGameTime(game.getWhitePlayer(), game.getGameTimeType())).build();

		JsonObject blackPlayer = jsonObjectBuilder.add("username", game.getBlackPlayer().getUsername())
				.add("countrycode", game.getBlackPlayer().getCountrycode() != null ? game.getBlackPlayer().getCountrycode().toLowerCase() : "")
				.add("elo", getPlayerEloBasedOnGameTime(game.getBlackPlayer(), game.getGameTimeType())).build();

		JsonObjectBuilder jsonBuilder = jsonObjectBuilder
				.add("action", "gameInfo")
				.add("whitePlayer", whitePlayer)
				.add("blackPlayer", blackPlayer)
				.add("time", game.getTime())
				.add("increment", game.getIncrement())
				.add("gameId", game.getGameId())
				
				.add("annotatedMoves", movesArrayBuilder);
		
		if(game.getMovesJson() != null) {
			jsonBuilder.add("movesJson", game.getMovesJson());
		}
		
		JsonObject gameInfoMessage = jsonBuilder.build();
	

		System.out.println("Startgame message:" + gameInfoMessage.toString());
		return gameInfoMessage;
	}

	public void getGameInfo(JsonObject message) {
		Game game = null;

		String gameId = message.getString("gameId");
		String messageAuthor = message.getString("user");
		Player observer = sessions.get(messageAuthor);

		if (gameId != null && !gameId.isEmpty()) {
			if(games.containsKey(gameId)) {
			game = games.get(gameId);}
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
				
			} else {
				
				if (observer != null) {
					game.getObservers().add(observer);
					System.out.println("Sending response to Game Info Message to:" + observer.getUsername());
					sendMessageToSession(observer.getSession(), gameProperties);
				}
			}
		} else {
			game = gameRepository.findById(gameId).orElse(null);
			
			if(game != null) {
				game.setGameTimeType(game.getTime());
				JsonObject gameProperties = createGameInfoMessage(game);
				sendMessageToSession(observer.getSession(), gameProperties);
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

		sendMessageToSession(sessions.get(oponent).getSession(), message);

		/*
		 * if (drawAccepted) { System.out.println("Draw accepted. Ending game."); int
		 * myNewElo = message.getInt("myNewElo"); int oponentsNewElo =
		 * message.getInt("oponentsNewElo");
		 * 
		 * endGame(player1, player2); }
		 */

	}

	public void endGame(Game game, JsonObject message) {
		
		
		int eloAfterGameWhite = message.getInt("whitePlayerElo");
		int eloAfterGameBlack = message.getInt("blackPlayerElo");
		String gameResult = message.getString("gameResult");
		String annotatedMovesJson = message.getString("annotatedMoves");

		Player whitePlayer = game.getWhitePlayer();
		Player blackPlayer = game.getBlackPlayer();
		TimeControl gameTimeType = game.getGameTimeType();

		setPlayerEloBasedOnGameTime(whitePlayer, gameTimeType, eloAfterGameWhite);
		setPlayerEloBasedOnGameTime(blackPlayer, gameTimeType, eloAfterGameBlack);

		userService.updateElo(whitePlayer.getUsername(), eloAfterGameWhite,
				gameTimeType);
		userService.updateElo(blackPlayer.getUsername(), eloAfterGameBlack,
				gameTimeType);

		whitePlayer.setGameId(null);
		blackPlayer.setGameId(null);
		whitePlayer.setPlaying(false);
		blackPlayer.setPlaying(false);
		
		
		game.setGameresult(gameResult);
		game.setOngoing(false);
		game.setMovesJson(annotatedMovesJson);
		
		gameRepository.save(game);

		if (game != null) {
			games.remove(game.getGameId());
		}
	}

	public void processGameResult(JsonObject message) {

		String gameId = message.getString("gameId");
		String tournamentId = message.getString("tournamentId", null);
		String oponent = message.getString("oponent");
		String gameResult = message.getString("gameResult");
					
		Game game = games.get(gameId);
		
		if (game != null) {
			
			endGame(game, message);
			Set<String> usersToForwardMessageTo = game.getObservers().stream().map(Player::getUsername)
					.collect(Collectors.toSet());
			usersToForwardMessageTo.add(oponent);
			sendMessageToMultipleUsers(usersToForwardMessageTo, message);
			if(tournamentId != null) {
				Tournament tournament = tournamentHandler.getTournament(tournamentId);
				tournamentHandler.processTournamentGameResult(tournament, gameId, gameResult);
				tournamentHandler.startNextRoundIfAllGamesFinished(tournament);
			}
		}
		
		
	}

	public boolean addObserverToGame(Game game, String observerName) {
		Player observer = sessions.get(observerName);
		
		boolean observerAddedSuccessfully = false;
		
		if (observer != null) {
			game.getObservers().removeIf(player -> player.equals(observer));
			game.getObservers().add(observer);
			observerAddedSuccessfully = true;
		} 
		
		return observerAddedSuccessfully;
	}

	public void makeMove(JsonObject message) {
		String gameId = message.getString("gameId");
		boolean whiteMove = message.getBoolean("whiteMove");
		String annotatedMove = message.getString("annotatedMove");
		String chessboardAfterMove = message.getString("chessboardAfterMove");
		String opponent = null;
		int whiteTime = message.getInt("whiteTime");
		int blackTime = message.getInt("blackTime");

		Game game = games.get(gameId);
		
		if(game != null) {
		game.getWhitePlayer().setTime(whiteTime);
		game.getBlackPlayer().setTime(blackTime);

		if (whiteMove) {
			Move move = new Move();
			int moveNumber = game.getAnnotatedMoves().size() + 1;
			move.setMoveNumber(moveNumber);
			move.setWhiteMove(annotatedMove);
			move.setBlackTime(blackTime);
			move.setWhiteTime(whiteTime);
			move.setChessboardAfterWhiteMove(chessboardAfterMove);
			opponent = game.getBlackPlayer().getUsername();
			game.getAnnotatedMoves().put(moveNumber, move);
		} else {
			int moveNumber = game.getAnnotatedMoves().size();
			Move move = game.getAnnotatedMoves().get(moveNumber);
			move.setBlackMove(annotatedMove);
			move.setBlackTime(blackTime);
			move.setWhiteTime(whiteTime);
			move.setChessboardAfterBlackMove(chessboardAfterMove);
			opponent = game.getWhitePlayer().getUsername();
		}
		Set<String> usersToForwardMessageTo = game.getObservers().stream().map(Player::getUsername)
				.collect(Collectors.toSet());
		System.out.println("Sending move to observers:"+usersToForwardMessageTo);
		usersToForwardMessageTo.add(opponent);
		sendMessageToMultipleUsers(usersToForwardMessageTo, message);
		}

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
					.add("gameId", playerInfo.getGameId() == null ? "" : playerInfo.getGameId() )
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
			int timeInMillis = message.getInt("time");
			int incrementInMillis = message.getInt("increment");
			Player whitePlayer = sessions.get(whitePlayerName);
			Player blackPlayer = sessions.get(blackPlayerName);
			if (whitePlayer != null && blackPlayer != null) {
				startGame(whitePlayer, blackPlayer, timeInMillis , incrementInMillis);
			}
		}

	}

	public void sendChatMessage(JsonObject message) {
		sendMessageToAllConnectedSessions(message);
	}

	public void sendMessageToSession(WebSocketSession session, JsonObject message) {
		try {
			session.sendMessage(new TextMessage(message.toString()));
		} catch (Exception ex) {
			ex.printStackTrace();
			System.out.println("Caugh illegal state exception");
			session = sessions.get(session.getPrincipal().getName()).getSession();
			sendMessageToSession(session, message);
		}
	}

	private void sendMessageToMultipleUsers(Set<String> users, JsonObject message) {
		for (String user : users) {
			if (sessions.get(user) != null) {
				sendMessageToSession(sessions.get(user).getSession(), message);
			}
		}
	}

	private void sendMessageToAllConnectedSessions(JsonObject message) {
		for (String username : sessions.keySet()) {
			sendMessageToSession(sessions.get(username).getSession(), message);
		}
	}
}
