package application.sockets;

import java.io.StringReader;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.json.spi.JsonProvider;

import application.domain.Game;
import application.tournaments.SimulHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import application.domain.Player;
import application.domain.Tournament;
import application.services.UserService;
import application.tournaments.TournamentHandler;

public class UserWebSocketServer extends TextWebSocketHandler {

	@Autowired
	private UserSessionHandler sessionHandler;

	@Autowired
	private UserService userService;

	@Autowired
	private TournamentHandler tournamentHandler;

	@Autowired
	private SimulHandler simulHandler;

	public void afterConnectionEstablished(WebSocketSession session) throws Exception {

		Player player = sessionHandler.getPlayerByName(session.getPrincipal().getName());
		if (player == null) {

			player = userService.getUserAccount(session.getPrincipal().getName());
			sessionHandler.addNewSession(session, player);
			System.out.println("New player Connection established - " + player.getUsername());
		} else {
			player.setSession(session);
			Game ongoingGame = sessionHandler.findGameByPlayer(player.getUsername());
			if(ongoingGame != null) {
				Player opponent = ongoingGame.getWhitePlayer().equals(player) ? ongoingGame.getBlackPlayer() : ongoingGame.getWhitePlayer();
				JsonProvider provider = JsonProvider.provider();
				JsonObject opponentReconnectedMessage = provider.createObjectBuilder()
						.add("action", "opponentReconnected")
						.add("opponent", player.getUsername()).build();
				System.out.println("Sending reconnected message to " + opponent.getUsername());
				sessionHandler.sendMessageToSession(opponent.getSession(), opponentReconnectedMessage);
				System.out.println("Player reconnected - " + player.getUsername());
			}
		}

	}

	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		System.out.println("Connection closed - " + session.getPrincipal().getName());
		sessionHandler.informPlayerThatOponentDisconnected(session.getPrincipal().getName());
		//sessionHandler.removeSession(session);

	}

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) {

		try (JsonReader reader = Json.createReader(new StringReader(message.getPayload()))) {
			JsonObject jsonMessage = reader.readObject();
			System.out.println(
					"Received message from " + session.getPrincipal().getName() + " : " + jsonMessage.toString());
			// System.out.println("Action:" + jsonMessage.get("action"));

			switch (jsonMessage.getString("action")) {
			case "move":
				sessionHandler.makeMove(jsonMessage);
				break;
			case "seekOponent":
				System.out.println("Seek oponent message received.");
				sessionHandler.seekOponent(jsonMessage);
				break;
			case "offerDraw":
				System.out.println("Offer draw messge received by the websocket server.");
				sessionHandler.offerDraw(jsonMessage);
				break;
			case "drawOfferReply":
				System.out.println("Draw offer reply message received by the websocket server.");
				sessionHandler.drawOfferReply(jsonMessage);
				break;
			case "gameResult":
				sessionHandler.processGameResult(jsonMessage);
				break;
			case "chatMessageLobby":
				sessionHandler.sendChatMessage(jsonMessage);
				break;
			case "queryPlayersOnline":
				sessionHandler.getCountOfPlayersOnline(jsonMessage);
				break;
			case "getPlayersOnline":
				sessionHandler.getAllPlayersOnline(jsonMessage);
				break;
			case "getGameInfo":
				sessionHandler.getGameInfo(jsonMessage);
				break;
			case "playerLeftOngoingGame":
				sessionHandler.informPlayerThatOponentDisconnected(session.getPrincipal().getName());
				break;
			case "offerRematch":
				sessionHandler.offerRematch(jsonMessage);
				break;
			case "rematchOfferReply":
				sessionHandler.processRematchOfferReply(jsonMessage);
				break;
			case "getTournamentInfo":
				Player player = sessionHandler.getPlayerByName(jsonMessage.getString("username"));
				String tournamentId = jsonMessage.getString("tournamentId", null);
				Tournament tournament = tournamentHandler.getTournament(tournamentId);
				if(tournament == null){
					tournament = simulHandler.getTournament(tournamentId);
				}
				if (!tournament.getPlayersInLobby().contains(player)) {
					tournament.getPlayersInLobby().add(player);
				}
				tournamentHandler.sendTournamentInfoToPlayer(tournament, player);
				break;
			case "joinTournament":
				String id = jsonMessage.getString("tournamentId");
				String username = jsonMessage.getString("username");
				if (tournamentHandler.getTournament(id) != null) {
					tournamentHandler.joinTournament(id, username);
				} else {
					simulHandler.joinTournament(id, username);
				}
				break;
			case "leaveTournament":
				String tid = jsonMessage.getString("tournamentId");
				String tusername = jsonMessage.getString("username");
				if (tournamentHandler.getTournament(tid) != null) {
					tournamentHandler.leaveTournament(tid, tusername);
				} else{
					simulHandler.leaveTournament(tid, tusername);
				}
				break;

			}


		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
