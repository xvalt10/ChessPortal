package application.sockets;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;


import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;

import application.domain.Game;
import application.domain.Move;
import application.domain.Useraccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import application.domain.Player;
import application.services.UserService;

@Component
//@Singleton
public class UserSessionHandler {

    @Autowired
    UserService userService;

    private final Map<String, Player> sessions = new ConcurrentHashMap<>();
    private final Map<String, Game> games = new ConcurrentHashMap<>();

    public Game findGameByPlayer(String observedPlayer) {
        return games.values().stream()
                .filter(gameFromCollection -> gameFromCollection.getWhitePlayer().getUsername().equals(observedPlayer) ||
                        gameFromCollection.getBlackPlayer().getUsername().equals(observedPlayer))
                .findFirst()
                .orElse(null);
    }

    public void addSession(WebSocketSession session, String username, int elo) {
        System.out.println("Adding new session");
        Player player = new Player();
        player.setUsername(username);
        player.setPlaying(false);
        player.setSession(session);
        System.out.println("Session status:" + session.isOpen());
        player.setElo(elo);


        sessions.put(username, player);

        System.out.println(LocalDateTime.now());
        System.out.println("Updating session completed." + sessions.size());

    }


    public void updateSessionSeekDetails(JsonObject message) {

        Player player = sessions.get(message.getString("user"));
        player.setTime(message.getInt("time"));
        player.setIncrement(message.getInt("increment"));
    }

    public void seekOponent(JsonObject message) {
        updateSessionSeekDetails(message);
        System.out.println("Message:" + message.toString());
        Player myPlayer = sessions.get(message.getString("user"));
        String myUsername = message.getString("user");
        int myElo = sessions.get(myUsername).getElo();
        int count = 0;

        myPlayer.setSeeking(true);
	
	/*	while (
				//!oponentFound &&
						!myPlayer.isPlaying()) {*/
        for (String oponentsUserName : sessions.keySet()) {

            Player oponent = sessions.get(oponentsUserName);

            if ((!myPlayer.isPlaying() && oponent != null && oponent.isSeeking() && !myUsername.equals(
                    oponentsUserName))
                    && (oponent.getTime() == message.getInt("time"))
                    && (oponent.getIncrement() == message.getInt("increment"))) {


                if (oponent.isSeeking()) {
                    myPlayer.setSeeking(false);
                    oponent.setSeeking(false);
                    myPlayer.setPlaying(true);
                    oponent.setPlaying(true);
                    startGame(myPlayer, oponent,
                            oponent.getTime(), oponent.getIncrement());
                }
                break;

            }


        }
    }
    /*	}*/

    public void startGame(Player whitePlayer, Player blackPlayer, int time, int increment) {
        Game newGame = new Game(whitePlayer, blackPlayer, time, increment);
        games.put(newGame.getGameId(), newGame);

        JsonObject gameProperties = createGameIdMessage(newGame.getGameId());

        sendMessageToSession(whitePlayer
                .getSession(), gameProperties);

        sendMessageToSession(blackPlayer
                .getSession(), gameProperties);

        whitePlayer.setPlaying(true);
        blackPlayer.setPlaying(true);
    }


    private JsonObject createGameIdMessage(String gameId) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject gameIdMessage = provider.createObjectBuilder()
                .add("action", "startGame")
                .add("gameId", gameId)
                .build();
        System.out.println("GameId message:" + gameIdMessage.toString());
        return gameIdMessage;
    }

    private JsonObject createGameInfoMessage(Game game) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject whitePlayer = provider.createObjectBuilder()
                .add("username", game.getWhitePlayer().getUsername())
                .add("elo", game.getWhitePlayer().getElo())
                .build();
        JsonObject blackPlayer = provider.createObjectBuilder()
                .add("username", game.getBlackPlayer().getUsername())
                .add("elo", game.getBlackPlayer().getElo())
                .build();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", "gameInfo")
                .add("whitePlayer", whitePlayer)
                //.add("whitePlayerElo", game.getWhitePlayer().getElo())
                .add("blackPlayer", blackPlayer)
                //.add("blackPlayerElo", game.getBlackPlayer().getElo())
                .add("time", game.getTime())
                .add("increment", game.getIncrement())
                .add("gameId", game.getGameId())

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
                sendMessageToSession(game.getWhitePlayer()
                        .getSession(), gameProperties);
            } else if (messageAuthor.equals(game.getBlackPlayer().getUsername())) {
                System.out.println("Sending response to Game Info Message to:" + game.getBlackPlayer().getUsername());
                sendMessageToSession(game.getBlackPlayer()
                        .getSession(), gameProperties);
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

    public void offerDraw(JsonObject message) {
        System.out.println("Offering draw.");
        sendMessageToSession(sessions.get(message.getString("oponent")).getSession(),
                message);

    }

    public void drawOfferReply(JsonObject message) {
        System.out.println("Replying to draw offer.");
        Player player1 = sessions.get(message.getString("oponent"));
        Player player2 = sessions.get(message.getString("player"));
        boolean drawAccepted = message.getBoolean("acceptDraw");
        sendMessageToSession(sessions.get(message.getString("oponent")).getSession(),
                message);
        if (drawAccepted) {
            System.out.println("Draw accepted. Ending game.");
            int myNewElo = message.getInt("myNewElo");
            int oponentsNewElo = message.getInt("oponentsNewElo");
            userService.updateElo(userService.getUserAccount(message.getString("player")).getUserId(), myNewElo);
            userService.updateElo(userService.getUserAccount(message.getString("oponent")).getUserId(), oponentsNewElo);
            player2.setElo(myNewElo);
            player1.setElo(oponentsNewElo);
            endGame(player1, player2);
        }

    }

    public void endGame(Player whitePlayer, Player blackPlayer) {

        whitePlayer.setPlaying(false);
        blackPlayer.setPlaying(false);

        int whitePlayerElo = whitePlayer.getElo();
        int blackPlayerElo = blackPlayer.getElo();

        Useraccount whitePlayerUserAccount = userService.getUserAccount(whitePlayer.getUsername());
        Useraccount blackPlayerUserAccount = userService.getUserAccount(blackPlayer.getUsername());

        userService.updateElo(whitePlayerUserAccount.getUserId(), whitePlayerElo);
        userService.updateElo(blackPlayerUserAccount.getUserId(), blackPlayerElo);

        whitePlayer.setElo(whitePlayerElo);
        blackPlayer.setElo(blackPlayerElo);

        Game game = findGameByPlayer(whitePlayer.getUsername());
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

        Player whitePlayer = game.getWhitePlayer();
        Player blackPlayer = game.getBlackPlayer();
        whitePlayer.setElo(whitePlayerElo);
        blackPlayer.setElo(blackPlayerElo);

        endGame(whitePlayer, blackPlayer);

        Set<String> usersToForwardMessageTo = game.getObservers()
                .stream()
                .map(Player::getUsername)
                .collect(Collectors.toSet());
        usersToForwardMessageTo.add(oponent);
        sendMessageToMultipleUsers(usersToForwardMessageTo, message);
    }

    public void addObserverToGame(Game game, String observerName) {
        Player observer = sessions.get(observerName);
        game.getObservers().add(observer);
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
        Set<String> usersToForwardMessageTo = game.getObservers().stream().map(Player::getUsername).collect(Collectors.toSet());
        usersToForwardMessageTo.add(opponent);
        sendMessageToMultipleUsers(usersToForwardMessageTo, message);

    }

    private JsonObject createMoveMessage(String moveInfo) {
        JsonProvider provider = JsonProvider.provider();
        JsonObject addMessage = provider.createObjectBuilder()
                .add("action", "move").add("moveInfo", moveInfo).build();
        return addMessage;
    }

    public void getAllPlayersOnline(JsonObject message) {
        int numberOfPlayingPlayers = 0;
        JsonProvider provider = JsonProvider.provider();
        JsonArrayBuilder playersArray = provider.createArrayBuilder();

        Set<Map.Entry<String, Player>> playersOnline = sessions.entrySet();
        for (Map.Entry<String, Player> player : playersOnline) {
            Player playerInfo = player.getValue();
            JsonObject jsonPlayerObject = provider.createObjectBuilder()
                    .add("name", player.getKey())
                    .add("elo", playerInfo.getElo())
                    .add("isPlaying", playerInfo.isPlaying())
                    .add("isSeeking", playerInfo.isSeeking())
                    .build();
            if (playerInfo.isPlaying()) {
                numberOfPlayingPlayers++;
            }
            playersArray.add(jsonPlayerObject);
        }

        JsonObject playersOnlineMessage = provider.createObjectBuilder()
                .add("action", "getPlayersOnline")
                .add("players", playersArray)
                .add("gamesInProgress", Math.floor(numberOfPlayingPlayers / 2))
                .build();
        Player user = sessions.get(message.getString("user"));
        if (user != null && user.getSession() != null) {

            sendMessageToSession(sessions.get(message.getString("user")).getSession(),
                    playersOnlineMessage);
        } else {
            System.out.println("Following user was not found:" + message.getString("user"));
        }
    }

    public void getCountOfPlayersOnline(JsonObject message) {
        int playersOnline = sessions.size();
        JsonProvider provider = JsonProvider.provider();
        JsonObject playersOnlineMessage = provider.createObjectBuilder()
                .add("action", "countOfPlayersOnline").add("count", playersOnline).build();
        if (sessions.get(message.getString("user")).getSession() != null) {
            sendMessageToSession(sessions.get(message.getString("user")).getSession(),
                    playersOnlineMessage);
        }

    }

    public void sendChatMessage(JsonObject message) {
        sendMessageToAllConnectedSessions(message);
    }

    private void sendMessageToSession(WebSocketSession session, JsonObject message) {
        try {
            session.sendMessage(new TextMessage(message.toString()));

        } catch (IOException ex) {
            sessions.remove(session);
            Logger.getLogger(UserSessionHandler.class.getName()).log(
                    Level.SEVERE, null, ex);
        } catch (IllegalStateException ex) {
            System.out.println("Caugh illegal state exception");
            sendMessageToSession(session, message);
        }
    }

    private void sendMessageToMultipleUsers(Set<String> users, JsonObject message) {
        for (String user : users) {
            sendMessageToSession(sessions.get(user).getSession(), message);
        }
    }


    private void sendMessageToAllConnectedSessions(JsonObject message) {
        for (String username : sessions.keySet()) {
            sendMessageToSession(sessions.get(username).getSession(), message);
        }
    }
}
