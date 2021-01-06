package application.tournaments;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NavigableMap;
import java.util.NavigableSet;
import java.util.TreeMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import application.domain.Pairing;
import application.domain.Player;
import application.domain.Score;
import application.domain.Tournament;

public class SwissSystemPairingsGenerator implements PairingsGenerator {

	/**
	 * The following rules are valid for each Swiss system unless explicitly stated
	 * otherwise.
	 * 
	 * The number of rounds to be played is declared beforehand.
	 * 
	 * 
	 * Two players shall not play against each other more than once.
	 * 
	 * 
	 * Should the number of players to be paired be odd, one player is unpaired.
	 * This player receives a pairing-allocated bye: no opponent, no colour and as
	 * many points as are rewarded for a win, unless the rules of the tournament
	 * state otherwise.
	 * 
	 * d
	 * 
	 * 
	 * A player who has already received a pairing-allocated bye, or has already
	 * scored a (forfeit) win due to an opponent not appearing in time, shall not
	 * receive the pairing-allocated bye.
	 * 
	 * e
	 * 
	 * 
	 * In general, players are paired to others with the same score.
	 * 
	 * f
	 * 
	 * 
	 * For each player the difference between the number of black and the number of
	 * white games shall not be greater than 2 or less than –2. Each system may have
	 * exceptions to this rule in the last round of a tournament.
	 * 
	 * g
	 * 
	 * 
	 * No player shall receive the same colour three times in a row. Each system may
	 * have exceptions to this rule in the last round of a tournament.
	 * 
	 * 
	 * 
	 * In general, a player is given the colour with which he played less games.
	 * 
	 * 
	 * If colours are already balanced, then, in general, the player is given the
	 * colour that alternates from the last one with which he played.
	 * 
	 * 
	 * The pairing rules must be such transparent that the person who is in charge
	 * for the pairing can explain them.
	 * 
	 * At any stage in the tournament you have to have a list of forbidden pairings.
	 * 
	 * The first, obvious entries are pairings that have occurred previously. The
	 * second, banning 3 whites in a row, is ww v ww since one of them will have to
	 * be white giving www. Similarly bb v bb is forbidden. Then the white/black
	 * imbalance, so 2 v 2 and -2 v -2 are forbidden since in each case one player
	 * will end up with a 3 or -3 imbalance.
	 * 
	 * So, for each player you need to keep track of previous opponents, colour
	 * sequence and colour imbalance. This gives you the information to know which
	 * pairings are forbidden. In the last round you should also perform the
	 * forbidden pairing check for colours and pair with this in mind if possible.
	 * If not then you can ignore colour restrictions in the last round only.
	 * 
	 * The "previous opponent" forbidden pairings are cumulative. The "colour"
	 * forbidden pairings change from round to round as the players' colour
	 * sequences and imbalances change.
	 * 
	 */

	public List<Pairing> generatePairings(Tournament tournament, int round) {
		//
		List<Pairing> pairings = new ArrayList<>();
		List<Player> tournamentPlayers = tournament.getTournamentPlayers();
		int playersCount = tournamentPlayers.size();
		
		tournamentPlayers.forEach(player -> player.setAlreadyPaired(false));
		if(playersCount % 2 != 0) {
			List<Player> tournamentPlayersWithoutBye = tournament.getTournamentPlayers().stream().filter(player-> player.isByeInCurrentRound()==false).collect(Collectors.toList());
			Player playerWithBye = tournamentPlayers.get(ThreadLocalRandom.current().nextInt(0, tournamentPlayersWithoutBye.size()));
			playerWithBye.setByeInCurrentRound(true);
			playerWithBye.setAlreadyPaired(true);
		}

		Map<Float, List<Player>> playersGroupedByPoints = tournamentPlayers.stream()
				.collect(
					Collectors.groupingBy(tplayer -> tplayer.getScore().getPoints(), 
					TreeMap::new, 
					Collectors.toList()));

		for (Player player : tournamentPlayers) {
			Player oponent = null;
			float playerScore = player.getScore().getPoints();
			while (oponent == null) {

				List<Player> playersWithSameScore = playersGroupedByPoints.get(playerScore);
				if (playersWithSameScore != null) {

					List<Player> forbiddenPlayers = forbiddenPairings(player, playersWithSameScore);
					List<Player> candidateOponents = playersWithSameScore.stream()
							.filter(playerInGroup -> player.getPreviousOponents().contains(playerInGroup))
							.filter(playerInGroup -> playerInGroup.getUsername().equals(player.getUsername()))
							.filter(playerInGroup -> !playerInGroup.isAlreadyPaired())
							.filter(playerInGroup -> forbiddenPlayers.contains(playerInGroup))
							.collect(Collectors.toList());

					if (player.getColorBalance() > 0) {
						candidateOponents = candidateOponents.stream()
								.filter(playerInGroup -> playerInGroup.getColorSequence().endsWith("b"))
								.collect(Collectors.toList());
						// candidateOponents
					} else if (player.getColorBalance() < 0) {
						candidateOponents = candidateOponents.stream()
								.filter(playerInGroup -> playerInGroup.getColorSequence().endsWith("w"))
								.collect(Collectors.toList());
					}

					if (!candidateOponents.isEmpty()) {
						oponent = candidateOponents.get(0);
						player.setAlreadyPaired(true);
						player.getPreviousOponents().add(oponent);
						
						oponent.setAlreadyPaired(true);
						oponent.getPreviousOponents().add(player);
						
						Pairing pairing = new Pairing();
						pairing.setBlackPlayer(player.getColorBalance() > 0 ? player : oponent);
						pairing.setWhitePlayer(player.getColorBalance() > 0 ? oponent : player);
						pairing.setRound(round);
						pairings.add(pairing);
					} 
				}
				if (playerScore == 0) {
					if (oponent == null) {
						throw new RuntimeException("No oponent found for:" + player.getUsername());
					}
					break;
				} else {
					playerScore -= 0.5f;
				}
			}
		}

		return pairings;
	}

	private List<Player> forbiddenPairings(Player player, List<Player> playersInScoreGroup) {
		List<Player> forbiddenPairings = new ArrayList<>();

		forbiddenPairings.addAll(player.getPreviousOponents());
		if (player.getColorBalance() == 2) {
			forbiddenPairings.addAll(playersInScoreGroup.stream().filter(player2 -> player2.getColorBalance() == 2)
					.collect(Collectors.toList()));
		} else if (player.getColorBalance() == -2) {
			forbiddenPairings.addAll(playersInScoreGroup.stream().filter(player2 -> player2.getColorBalance() == -2)
					.collect(Collectors.toList()));
		}
		if (player.getColorSequence().equals("ww")) {
			forbiddenPairings.addAll(playersInScoreGroup.stream()
					.filter(player2 -> player2.getColorSequence().equals("ww")).collect(Collectors.toList()));
		} else if (player.getColorSequence().equals("bb")) {
			forbiddenPairings.addAll(playersInScoreGroup.stream()
					.filter(player2 -> player2.getColorSequence().equals("bb")).collect(Collectors.toList()));
		}
		return forbiddenPairings;

	}

}
