package application.sockets;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;

import com.fasterxml.jackson.databind.ObjectMapper;

import application.domain.Player;
import application.domain.Tournament;

@Component
public class TournamentHandler {

	UserSessionHandler userSessionHandler;
	Map<String, Tournament> tournaments = new ConcurrentHashMap<>();

	public TournamentHandler(UserSessionHandler userSessionHandler) {
		this.userSessionHandler = userSessionHandler;
		Tournament tournament = new Tournament(15, 0);
		tournament.setTournamentId("1");
		tournaments.put("1", tournament);
	}

	public void joinTournament(String tournamentId, String username) {
		Player player = userSessionHandler.getPlayerByName(username);
		Tournament tournament = tournaments.get(tournamentId);
		if (player != null && tournament != null) {
			if(tournament.getTournamentPlayers().stream().noneMatch(playerInList -> playerInList.getUsername().equals(username))) {
			tournament.getTournamentPlayers().add(player);
			sendTournamentInfoToPlayer(tournamentId, username);}
		}
	}
	
	public void sendTournamentInfoToPlayer(String tournamentId, String username) {
		Player player = userSessionHandler.getPlayerByName(username);
		Tournament tournament = tournaments.get(tournamentId);
		if (tournament != null) {
			ObjectMapper objectMapper = new ObjectMapper();		
			try {
				String tournamentAsString = objectMapper.writeValueAsString(tournament);
				player.getSession().sendMessage(new TextMessage(tournamentAsString));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

}
