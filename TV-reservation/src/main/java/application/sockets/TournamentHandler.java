package application.sockets;

import static application.util.TournamentType.ROUND_ROBIN;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.json.JsonObject;
import javax.json.spi.JsonProvider;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import application.domain.Pairing;
import application.domain.Player;
import application.domain.Tournament;
import application.util.GameColor;
import application.util.TournamentState;
import application.util.TournamentType;

@Component
public class TournamentHandler {

	UserSessionHandler userSessionHandler;
	ThreadPoolTaskScheduler taskScheduler;

	Map<String, Tournament> tournaments = new ConcurrentHashMap<>();

	public TournamentHandler(UserSessionHandler userSessionHandler,
			@Qualifier("tournamentScheduler") ThreadPoolTaskScheduler taskScheduler) {
		this.userSessionHandler = userSessionHandler;
		this.taskScheduler = taskScheduler;
		createTournament(5, 0, OffsetDateTime.now().plusMinutes(2), ROUND_ROBIN);
	}

	public void createTournament(int time, int increment, OffsetDateTime startDateTime, TournamentType tournamentType) {
		Tournament tournament = new Tournament(time, increment, startDateTime, tournamentType);
		tournament.setTournamentId("1");
		tournaments.put("1", tournament);
		taskScheduler.schedule(() -> startTournament(tournament, 1), startDateTime.toInstant());
	}

	public void joinTournament(String tournamentId, String username) {
		Player player = userSessionHandler.getPlayerByName(username);
		Tournament tournament = tournaments.get(tournamentId);
		if (player != null && tournament != null) {
			if (tournament.getTournamentPlayers().stream()
					.noneMatch(playerInList -> playerInList.getUsername().equals(username))) {
				tournament.getTournamentPlayers().add(player);
				sendTournamentInfoToPlayer(tournamentId, username);
			}
		}
	}

	public void processTournamentGameResult(Tournament tournament, String gameId, String gameResult) {

		if (tournament != null) {
			Map<String, Float> scores = tournament.getScores();
			Pairing pairing = tournament.getPairings().stream()
					.filter(currentPairing -> currentPairing.getGameId().equals(gameId)).findFirst().orElse(null);
			if (pairing != null) {
				String whitePlayerName = pairing.getWhitePlayer().getUsername();
				String blackPlayerName = pairing.getBlackPlayer().getUsername();
				if (gameResult.contains("1/2")) {
					scores.put(whitePlayerName, scores.get(whitePlayerName) + 0.5f);
					scores.put(blackPlayerName, scores.get(blackPlayerName) + 0.5f);
				} else if (gameResult.contains("1-0")) {
					scores.put(whitePlayerName, scores.get(whitePlayerName) + 1);
				} else if (gameResult.contains("0-1")) {
					scores.put(blackPlayerName, scores.get(blackPlayerName) + 1);
				}

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
		tournament.setTournamentState(TournamentState.FINISHED);
		for (Player player : tournament.getTournamentPlayers()) {
			sendTournamentInfoToPlayer(tournament.getTournamentId(), player.getUsername());
		}

	}

	public void sendTournamentInfoToPlayer(String tournamentId, String username) {
		Player player = userSessionHandler.getPlayerByName(username);
		Tournament tournament = tournaments.get(tournamentId);
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

	public void startRound(Tournament tournament, int round) {

		tournament.setCurrentRound(round);

		List<Pairing> pairings = generatePairings(tournament, round);
		for (Pairing pairing : pairings) {
			String gameId = userSessionHandler.startGame(pairing.getWhitePlayer(), pairing.getBlackPlayer(),
					tournament.getTime(), tournament.getIncrement());
			pairing.setGameId(gameId);
		}

		tournament.getPairings().addAll(pairings);
	}

	public void startTournament(Tournament tournament, int round) {
		int numberOfPlayersRegistered = tournament.getTournamentPlayers().size();
		int numberOfRounds = numberOfPlayersRegistered % 2 == 0 ? numberOfPlayersRegistered - 1
				: numberOfPlayersRegistered;
		Map<String, Float> scores = tournament.getScores();
		List<String> playerNames = tournament.getTournamentPlayers().stream().map(Player::getUsername)
				.collect(Collectors.toList());
		playerNames.forEach(playerName -> scores.put(playerName, 0f));
		if (numberOfPlayersRegistered > 1) {
			tournament.setTournamentState(TournamentState.STARTED);
			tournament.setNumberOfRounds(numberOfRounds);
			startRound(tournament, round);
		}

	}

	public List<Pairing> generatePairings(Tournament tournament, int round) {
		List<Player> tournamentPlayers = tournament.getTournamentPlayers();
		List<Pairing> pairingsForRound = new ArrayList<>();
		switch (tournament.getTournamentType()) {
		case ROUND_ROBIN:
			pairingsForRound = generatePairingsRoundRobinCircleMethod(tournamentPlayers, round);
			break;
		default:
		}

		return pairingsForRound;
	}

	public List<Pairing> generatePairingsRoundRobinCircleMethod(List<Player> tournamentPlayers, int round) {

		List<Pairing> pairingsForRound = new ArrayList<>();
		if (tournamentPlayers.size() % 2 != 0) {
			Player player = new Player();
			player.setUsername("BYE");
			tournamentPlayers.add(player);
		}

		int numberOfPlayers = tournamentPlayers.size();
		int endIndexOfFirstPlayerGroup = (numberOfPlayers / 2) - 1;
		IntStream playersRange = IntStream.range(1, numberOfPlayers + 1);

		List<Integer> playerNumbers = new ArrayList<>();

		playersRange.forEach(number -> {
			if (number <= numberOfPlayers / 2) {
				playerNumbers.add(number);
			} else {
				playerNumbers.add((numberOfPlayers + 2) - (number - (endIndexOfFirstPlayerGroup)));
			}
		});

		if (round > 1) {
			for (int i = 1; i < round; i++) {
				int middleElement = playerNumbers.get(endIndexOfFirstPlayerGroup);
				int firstElementAfterMiddle = playerNumbers.get(endIndexOfFirstPlayerGroup + 1);
				playerNumbers.remove(Integer.valueOf(middleElement));
				playerNumbers.add(middleElement);
				playerNumbers.remove(Integer.valueOf(firstElementAfterMiddle));
				playerNumbers.add(1, firstElementAfterMiddle);
			}
		}

		System.out.println(playerNumbers);

		for (int i = 0; i <= endIndexOfFirstPlayerGroup; i++) {
			Pairing pairing = new Pairing();
			pairing.setRound(round);
			if (round % 2 == 0) {
				pairing.setWhitePlayer(tournamentPlayers.get(playerNumbers.get(i) - 1));
				pairing.setBlackPlayer(
						tournamentPlayers.get(playerNumbers.get(i + endIndexOfFirstPlayerGroup + 1) - 1));
			} else if (round % 2 != 0) {
				pairing.setBlackPlayer(tournamentPlayers.get(playerNumbers.get(i) - 1));
				pairing.setWhitePlayer(
						tournamentPlayers.get(playerNumbers.get(i + endIndexOfFirstPlayerGroup + 1) - 1));
			}
			pairingsForRound.add(pairing);
		}

		return pairingsForRound;

	}

	public List<Pairing> generatePairingsRoundRobin(List<Player> tournamentPlayers, int round,
			List<Pairing> previousParings) {

		List<Player> pairedPlayers = new ArrayList<>();
		List<Pairing> pairingsForRound = new ArrayList<>();
		Player playerWithBye = tournamentPlayers.get(tournamentPlayers.size() - round);

		for (Player player : tournamentPlayers) {

			if (pairedPlayers.contains(player)) {
				continue;
			}

			GameColor playerColourInThisRound = round == 1 ? GameColor.WHITE
					: (player.getLastGameColor() == GameColor.WHITE ? GameColor.BLACK : GameColor.WHITE);
			player.setLastGameColor(playerColourInThisRound);
			Player oponent = null;

			List<Player> previousOponents = previousParings.stream().filter(
					pairing -> player.equals(pairing.getWhitePlayer()) || player.equals(pairing.getBlackPlayer()))
					.map(pairing -> {
						if (player.equals(pairing.getWhitePlayer())) {
							return pairing.getBlackPlayer();
						} else {
							return pairing.getWhitePlayer();
						}
					}).map(Player.class::cast).collect(Collectors.toList());

			List<Player> pairingCandidates = tournamentPlayers.stream()
					.filter(tournamentPlayer -> !player.equals(tournamentPlayer))
					.filter(tournamentPlayer -> tournamentPlayers.size() % 2 == 0
							|| (tournamentPlayers.size() % 2 != 0 && !tournamentPlayer.equals(playerWithBye)))

					.filter(tournamentPlayer -> !previousOponents.contains(tournamentPlayer))
					.filter(tournamentPlayer -> !pairedPlayers.contains(tournamentPlayer)).collect(Collectors.toList());
			if (pairingCandidates.size() == 0 || (tournamentPlayers.size() % 2 != 0 && player.equals(playerWithBye))) {

			} else if (pairingCandidates.size() == 1) {
				oponent = pairingCandidates.get(0);
			} else if (round == 1) {
				oponent = pairingCandidates.stream().findFirst().get();
			} else if (playerColourInThisRound == GameColor.WHITE) {
				Optional<Player> possibleOponent = pairingCandidates.stream()
						.filter(oponentCandidate -> oponentCandidate.getLastGameColor() == GameColor.WHITE).findFirst();

				if (!possibleOponent.isPresent()) {
					oponent = pairingCandidates.stream()
							.filter(oponentCandidate -> oponentCandidate.getLastGameColor() == GameColor.BLACK)
							.findFirst().get();
				} else {
					oponent = possibleOponent.get();
				}
			} else if (playerColourInThisRound == GameColor.BLACK) {
				Optional<Player> possibleOponent = pairingCandidates.stream()
						.filter(oponentCandidate -> oponentCandidate.getLastGameColor() == GameColor.BLACK).findFirst();

				if (!possibleOponent.isPresent()) {
					oponent = pairingCandidates.stream()
							.filter(oponentCandidate -> oponentCandidate.getLastGameColor() == GameColor.WHITE)
							.findFirst().get();
				} else {
					oponent = possibleOponent.get();
				}
			}
			Pairing pairing = new Pairing();

			if (playerColourInThisRound == GameColor.WHITE) {

				pairing.setWhitePlayer(player);
				pairing.setBlackPlayer(oponent);
				if (oponent != null) {
					oponent.setLastGameColor(GameColor.BLACK);
				}
			} else {
				pairing.setWhitePlayer(oponent);
				pairing.setBlackPlayer(player);
				if (oponent != null) {
					oponent.setLastGameColor(GameColor.WHITE);
				}
			}

			pairing.setRound(round);
			pairingsForRound.add(pairing);

			pairedPlayers.add(player);
			pairedPlayers.add(oponent);
		}
		;

		return pairingsForRound;

	}

	public Tournament getTournament(String tournamentId) {
		return tournaments.get(tournamentId);
	}
}
