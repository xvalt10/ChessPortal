package application.sockets;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.inject.Singleton;
import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import javax.mail.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import application.domain.Player;
import application.services.UserService;

@Component
@Singleton
public class UserSessionHandler {
	
	@Autowired
	UserService userService;
	
	private final HashMap<String, Player> sessions = new HashMap<>();

	public void addSession(WebSocketSession session, String username, int elo) {
		System.out.println("Adding new session");
		Player player = new Player();
		player.setPlaying(false);
		player.setSession(session);
		player.setElo(elo);
		

		sessions.put(username, player);
		System.out.println("Username:" + username);
		System.out.println("Number of sessions:" + sessions.size());

	}

	public void startGame(JsonObject gameProperties) {
		sendMessageToSession(sessions.get(gameProperties.getString("whitePlayer"))
				.getSession(), gameProperties);
		sendMessageToSession(sessions.get(gameProperties.getString("blackPlayer"))
				.getSession(), gameProperties);
	}

	public void updateSessionSeekDetails(JsonObject message) {
		System.out.println(sessions.size());
		for (String username : sessions.keySet()) {
			System.out.println(username);
		}
		// System.out.println(message.get("user"));
		Player player = sessions.get(message.getString("user"));
		player.setTime(message.getInt("time"));
		player.setIncrement(message.getInt("increment"));
	}

	public void seekOponent(JsonObject message) {
		updateSessionSeekDetails(message);
		System.out.println("Message:" + message.toString());
		boolean oponentFound = false;
		Player myPlayer = sessions.get(message.getString("user"));
		String myUsername=message.getString("user");
		int myElo = sessions.get(myUsername).getElo();
		int count = 0;
		
		myPlayer.setSeeking(true);
	
		while (!oponentFound && !myPlayer.isPlaying()) {
			for (String oponentsUserName : sessions.keySet()) {

				Player oponent = sessions.get(oponentsUserName);
				
				if ((!myPlayer.isPlaying()&& oponent.isSeeking() && !myUsername.equals(
						oponentsUserName))
						&& (oponent.getTime() == message.getInt("time"))
						&& (oponent.getIncrement() == message.getInt("increment"))) {
					
					
					
				//	oponentFound = true;
//					
//
					System.out.println(message.getString("user")
						+ " Oponent found");
					
				//	sessions.get(message.getString("user")).setPlaying(true);

					if (oponent.isSeeking()) {
						myPlayer.setSeeking(false);
						oponent.setSeeking(false);
						myPlayer.setPlaying(true);
						oponent.setPlaying(true);
						startGame(createStartGameMessage(
								myUsername,myElo, oponentsUserName,oponent.getElo(), 
								oponent.getTime(), oponent.getIncrement()));
						oponentFound=true;
						
						
					}
					break;
					
					}
					

				}
			}
		}
	

	private JsonObject createStartGameMessage(String whitePlayer,int whitePlayerElo,
			String blackPlayer, int blackPlayerElo, int time, int increment) {
		JsonProvider provider = JsonProvider.provider();
		JsonObject addMessage = provider.createObjectBuilder()
				.add("action", "startGame")
				.add("whitePlayer", whitePlayer)
				.add("whitePlayerElo", whitePlayerElo)
				.add("blackPlayer", blackPlayer).add("time", time)
				.add("blackPlayerElo", blackPlayerElo)
				.add("increment", increment)

				.build();
		System.out.println("Startgame message:" + addMessage.toString());
		return addMessage;
	}

	public void removeSession(WebSocketSession session) {
		System.out.println("Removing new session");
		sessions.remove(session);
	}

	public void offerDraw(JsonObject message){
		System.out.println("Offering draw.");
		sendMessageToSession(sessions.get(message.getString("oponent")).getSession(),
				message);
		
	}
	
	public void drawOfferReply(JsonObject message){
		System.out.println("Replying to draw offer.");
		Player player1=sessions.get(message.getString("oponent"));
		Player player2=sessions.get(message.getString("player"));
		boolean drawAccepted = message.getBoolean("acceptDraw");
		sendMessageToSession(sessions.get(message.getString("oponent")).getSession(),
				message);
		if (drawAccepted){
			System.out.println("Draw accepted. Ending game.");
			int myNewElo = message.getInt("myNewElo");
			int oponentsNewElo=message.getInt("oponentsNewElo");
			userService.updateElo(userService.getUserAccount(message.getString("player")).getUserId(), myNewElo);
			userService.updateElo(userService.getUserAccount(message.getString("oponent")).getUserId(), oponentsNewElo);
			player2.setElo(myNewElo);
			player1.setElo(oponentsNewElo);	
			endGame(player1,player2);}
		
	}
	
	public void endGame(Player player1, Player player2){
		player1.setPlaying(false);
		player2.setPlaying(false);
	}
	
	public void sendResignation(JsonObject message){
		String userName=message.getString("oponent");
		String oponentsUserName=message.getString("player");
		Player player = sessions.get(oponentsUserName);
		Player oponent = sessions.get(userName);
		int myNewElo = message.getInt("myNewElo");
		int oponentsNewElo=message.getInt("oponentsNewElo");
		userService.updateElo(userService.getUserAccount(userName).getUserId(), myNewElo);
		userService.updateElo(userService.getUserAccount(oponentsUserName).getUserId(), oponentsNewElo);
		player.setElo(myNewElo);
		oponent.setElo(oponentsNewElo);
		sendMessageToSession(sessions.get(userName).getSession(),
				message);
		endGame(player, oponent);
		
	}

	public void makeMove(JsonObject message) {
		System.out.println(message.getString("oponent"));
		sendMessageToSession(sessions.get(message.getString("oponent")).getSession(),
				createMoveMessage(message.toString()));
	}

	private JsonObject createMoveMessage(String moveInfo) {
		JsonProvider provider = JsonProvider.provider();
		JsonObject addMessage = provider.createObjectBuilder()
				.add("action", "move").add("moveInfo", moveInfo).build();
		return addMessage;
	}

	private void sendMessageToSession(WebSocketSession session, JsonObject message) {
		try {
			System.out.println("Sending to session");
			session.sendMessage(new TextMessage(message.toString()));

		} catch (IOException ex) {
			sessions.remove(session);
			Logger.getLogger(UserSessionHandler.class.getName()).log(
					Level.SEVERE, null, ex);
		}
		catch(IllegalStateException ex){
			System.out.println("Caugh illegal state exception");
			sendMessageToSession(session, message);
		}
	}

	private void sendMessageToAllConnectedSessions(JsonObject message) {
		System.out.println("Sending to: " + sessions.size() + " sessions");
		for (String username : sessions.keySet()) {
			sendMessageToSession(sessions.get(username).getSession(), message);
		}
	}
}
