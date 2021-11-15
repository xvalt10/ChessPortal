package application.tournaments;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import javax.json.JsonObject;
import javax.json.spi.JsonProvider;

import application.domain.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import application.sockets.UserSessionHandler;
import application.util.TournamentState;
import application.util.TournamentType;

@Component
public class TournamentHandler {

	UserSessionHandler userSessionHandler;
	ThreadPoolTaskScheduler tournamentScheduler;
	int tournamentId = 1;

	protected Map<String, Tournament> tournaments;

	public TournamentHandler(UserSessionHandler userSessionHandler,
			@Qualifier("tournamentScheduler") ThreadPoolTaskScheduler taskScheduler) {
		this.userSessionHandler = userSessionHandler;
		this.tournamentScheduler = taskScheduler;
		this.tournaments = new ConcurrentHashMap<>();
	}



	public void createTournament(String tournamentName, int time, int increment, LocalDateTime utcStartTime,LocalDateTime utcEndTime,
			TournamentType tournamentType) {
		Tournament tournament = new Tournament(tournamentName, time, increment, utcStartTime, tournamentType);

		tournaments.put(tournament.getId(), tournament);

		Date convertedDate = Date.from(utcStartTime.plusSeconds(OffsetDateTime.now().getOffset().getTotalSeconds())
				.atZone(ZoneId.systemDefault()).toInstant());

		tournamentScheduler.schedule(() -> startTournament(tournament) , convertedDate);
	}

	public void joinTournament(String tournamentId, String username) {
		Player player = userSessionHandler.getPlayerByName(username);
		Tournament tournament = tournaments.get(tournamentId);
		if (player != null && tournament != null) {
			if (tournament.getPlayers().stream()
					.noneMatch(playerInList -> playerInList.getUsername().equals(username))) {
				tournament.getPlayers().add(player);
				for (Player tournamentPlayer : tournament.getPlayersInLobby()) {
					sendTournamentInfoToPlayer(tournament, tournamentPlayer);
				}
			}
		}
	}

	public void leaveTournament(String tournamentId, String username) {
		Tournament tournament = tournaments.get(tournamentId);
		tournament.getPlayers().removeIf(player -> username.equals(player.getUsername()));
		for (Player tournamentPlayer : tournament.getPlayersInLobby()) {
			sendTournamentInfoToPlayer(tournament, tournamentPlayer);
		}
	}

	public List<Tournament> getTournamentsByState(String state) {
		return tournaments.values().stream()
				.filter(tournament -> tournament.getState() == TournamentState.valueOf(state.toUpperCase()))
				.collect(Collectors.toList());
	}

	public void processTournamentGameResult(Tournament tournament, String gameId, String gameResult) {

		if (tournament != null) {
			Map<String, Score> scores = tournament.getScores();
			Pairing pairing = tournament.getPairings().stream()
					.filter(currentPairing -> gameId.equals(currentPairing.getGameId())).findFirst().orElse(null);
			if (pairing != null) {
				Player whitePlayer = pairing.getWhitePlayer();
				Player blackPlayer = pairing.getBlackPlayer();
				String whitePlayerName = whitePlayer.getUsername();
				String blackPlayerName = blackPlayer.getUsername();
				Score whitePlayerScore = scores.get(whitePlayerName);
				Score blackPlayerScore = scores.get(blackPlayerName);
				if (gameResult.contains("1/2")) {
					whitePlayerScore.setPoints(whitePlayerScore.getPoints() + 0.5f);
					blackPlayerScore.setPoints(blackPlayerScore.getPoints() + 0.5f);

				} else if (gameResult.contains("1-0")) {
					whitePlayerScore.setPoints(whitePlayerScore.getPoints() + 1);
				} else if (gameResult.contains("0-1")) {
					blackPlayerScore.setPoints(blackPlayerScore.getPoints() + 1);
				}
				scores.put(whitePlayerName, whitePlayerScore);
				scores.put(blackPlayerName, blackPlayerScore);
				whitePlayer.setScore(whitePlayerScore);
				blackPlayer.setScore(blackPlayerScore);
				pairing.setGameResult(gameResult);
			}

		}

	}

	public void startNextRoundIfAllGamesFinished(Tournament tournament) {
		List<Pairing> pairings = tournament.getPairings();
		if (pairings.stream().allMatch(pairing -> pairing.getGameResult() != null)) {
			if (tournament.getCurrentRound() + 1 <= tournament.getNumberOfRounds()) {
				startRound(tournament, tournament.getCurrentRound() + 1);
			} else {
				endTournament(tournament);
			}
		}
	}

	public void endTournament(Tournament tournament) {
		tournament.setState(TournamentState.FINISHED);
		for (Player player : tournament.getPlayersInLobby()) {
			sendTournamentInfoToPlayer(tournament, player);
		}
		for (Player player : tournament.getPlayers()) {
			sendTournamentInfoToPlayer(tournament, player);
		}

	}

	public void sendTournamentInfoToPlayer(Tournament tournament, Player player) {

		if (tournament != null) {
			ObjectMapper objectMapper = new ObjectMapper();
			try {
				String tournamentAsString = objectMapper.writeValueAsString(tournament);
				JsonProvider provider = JsonProvider.provider();
				JsonObject tournamentInfoMessage = provider.createObjectBuilder().add("action", "tournamentInfo")
						.add("tournament", tournamentAsString).build();
				userSessionHandler.sendMessageToSession(player.getSession(), tournamentInfoMessage);

			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void sendTournamentActionMessageToPlayer(String tournamentId, Player player, String action) {

		Tournament tournament = tournaments.get(tournamentId);
		if (tournament != null) {
			ObjectMapper objectMapper = new ObjectMapper();
			try {
				String tournamentAsString = objectMapper.writeValueAsString(tournament);
				JsonProvider provider = JsonProvider.provider();
				JsonObject tournamentInfoMessage = provider.createObjectBuilder().add("action", action)
						.add("tournament", tournamentAsString).build();

				userSessionHandler.sendMessageToSession(player.getSession(), tournamentInfoMessage);

			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void startRound(Tournament tournament, int round) {

		tournament.setCurrentRound(round);
		Player playerWithBye = null;
		List<Pairing> pairings = tournament.getPairingGenerator().generatePairings(tournament, round);
		for (Pairing pairing : pairings) {
			Player whitePlayer = pairing.getWhitePlayer();
			Player blackPlayer = pairing.getBlackPlayer();
			if (whitePlayer != null && blackPlayer != null) {
				String gameId = userSessionHandler.startGame(pairing.getWhitePlayer(), pairing.getBlackPlayer(),
						tournament.getTime() * 60_000, tournament.getIncrement()*1000);
				whitePlayer.setColorBalance(whitePlayer.getColorBalance() + 1);
				whitePlayer.setColorSequence("w");
				blackPlayer.setColorBalance(blackPlayer.getColorBalance() - 1);
				blackPlayer.setColorSequence("b");
				pairing.setGameId(gameId);
			} else {
				playerWithBye = whitePlayer != null ? whitePlayer : blackPlayer;

			}
		}
		pairings.removeIf(pairing -> pairing.getWhitePlayer() == null || pairing.getBlackPlayer() == null);
		tournament.getPairings().addAll(pairings);
		if (playerWithBye != null) {
			Score scorePlayerWithBye = tournament.getScores().get(playerWithBye.getUsername());
			scorePlayerWithBye.setPoints(scorePlayerWithBye.getPoints() + 1);
			sendTournamentActionMessageToPlayer(tournament.getId(), playerWithBye, "byeInCurrentRound");
		}
	}

	public void startTournament(Tournament tournament) {
		int numberOfPlayersRegistered = tournament.getPlayers().size();
		int numberOfRounds = numberOfPlayersRegistered % 2 == 0 ? numberOfPlayersRegistered - 1
				: numberOfPlayersRegistered;
		Map<String, Score> scores = tournament.getScores();
		List<String> playerNames = tournament.getPlayers().stream().map(Player::getUsername)
				.collect(Collectors.toList());
		playerNames.forEach(playerName -> scores.put(playerName, new Score(playerName)));
		if (numberOfPlayersRegistered > 1) {
			tournament.setState(TournamentState.STARTED);
			tournament.setNumberOfRounds(numberOfRounds);
			startRound(tournament, 1);
		} else {
			tournament.setState(TournamentState.FINISHED);
		}
	}

	public Tournament getTournament(String tournamentId) {
		return tournaments.get(tournamentId);
	}
}
