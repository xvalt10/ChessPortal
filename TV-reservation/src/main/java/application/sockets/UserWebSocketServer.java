package application.sockets;

import java.io.StringReader;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import javax.ws.rs.Path;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import application.services.UserService;

public class UserWebSocketServer extends TextWebSocketHandler {

	@Autowired
	private UserSessionHandler sessionHandler;
	
	@Autowired
	private UserService userService;

	public void afterConnectionEstablished(WebSocketSession session)
			throws Exception {
		
		int myElo=userService.getUserAccount(session.getPrincipal().getName()).getElo();
		String myUserName=session.getPrincipal().getName();

		sessionHandler.addSession(session, myUserName, myElo);

	}

	public void afterConnectionClosed(WebSocketSession session,
			CloseStatus status) throws Exception {
		System.out.println("Connection closed on websocket.Removing session.");
		sessionHandler.removeSession(session);

	}

	@Override
	public void handleTextMessage(WebSocketSession session, TextMessage message) {
		System.out.println("Message received by server.");

		try (JsonReader reader = Json.createReader(new StringReader(message
				.getPayload()))) {
			JsonObject jsonMessage = reader.readObject();
			System.out.println(jsonMessage.toString());
			System.out.println("Action:" + jsonMessage.get("action"));

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
			case "resign":
				sessionHandler.sendResignation(jsonMessage);break;
			case "chatMessageLobby":
				
				sessionHandler.sendChatMessage(jsonMessage);break;
			case "queryPlayersOnline":
				sessionHandler.getCountOfPlayersOnline(jsonMessage);break;
				
				
				
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
