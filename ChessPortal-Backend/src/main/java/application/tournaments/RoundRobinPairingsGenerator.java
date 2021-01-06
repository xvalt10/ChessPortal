package application.tournaments;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import application.domain.Pairing;
import application.domain.Player;
import application.domain.Tournament;
import application.util.GameColor;

public class RoundRobinPairingsGenerator implements PairingsGenerator {

	@Override
	public List<Pairing> generatePairings(Tournament tournament, int round) {
		
		List<Player> tournamentPlayers = tournament.getTournamentPlayers();
		List<Pairing> pairingsForRound = new ArrayList<>();
		if (tournamentPlayers.size() % 2 != 0) {
			Player player = null;
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
		};

		return pairingsForRound;

	}

}
