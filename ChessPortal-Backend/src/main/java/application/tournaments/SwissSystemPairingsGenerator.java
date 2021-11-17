package application.tournaments;

import static application.util.GameColor.BLACK;
import static application.util.GameColor.WHITE;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

import org.javatuples.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import application.domain.Pairing;
import application.domain.Player;
import application.domain.Score;
import application.domain.Tournament;
import application.util.FloatStatus;
import application.util.GameColor;
import application.util.PairingNotPossibleException;

public class SwissSystemPairingsGenerator implements PairingsGenerator {

	private static final Logger log = LoggerFactory.getLogger(SwissSystemPairingsGenerator.class);

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

		List<Player> tournamentPlayers = tournament.getPlayers();

		tournamentPlayers.forEach(player -> {
			player.setAlreadyPaired(false);
			if (round == 1) {
				player.setColorSequence("");
				player.setColorBalance(0);
				player.setByeInRound(0);
				player.setScore(new Score(player.getUsername()));
			}
		});

		int playersCount = tournamentPlayers.size();
		Player playerWithBye = null;
		if (playersCount % 2 != 0) {
			playerWithBye = getPlayerWithBye(tournamentPlayers, round);

		}

		if (round == 1) {
			pairings = PairingHelper.generatePairingsForRoundOne(tournamentPlayers);
		} else {
			List<ScoreGroup> scoreGroups = PairingHelper.groupPlayersByTheirScores(tournamentPlayers);
			SwissSystemPairingContext pairingContext = new SwissSystemPairingContext(round, false, scoreGroups);
			scoreGroups.forEach(sg -> sg.setSwissSystemPairingContext(pairingContext));
			pairings = generatePairingsAfterRoundOne(round, pairingContext);
		}

		return pairings;
	}

	private List<Pairing> generatePairingsAfterRoundOne(int round, SwissSystemPairingContext pairingContext) {

		Map<ScoreGroup, List<Pair<Player, Player>>> pairsByScoreGroup = new HashMap<>();
		log.info("Generating pairings for round {}", round);
		for (ScoreGroup scoreGroup : pairingContext) {
			
			try {
				log.info("\n");
				log.info("Generating pairings for score group {}", scoreGroup.score);
				scoreGroup.generatePairings(pairingContext);
				pairsByScoreGroup.put(scoreGroup, scoreGroup.getPairings());
				pairingContext.increaseIndex();
				log.info("\n");
			} catch (PairingNotPossibleException e) {
				log.warn(e.getMessage());
				if(e.getMessage().contains("Backtracking")) {
				//	log.info("Removing pairings for score group {}", pairingContext.getCurrentScoreGroup().score);
				//	log.info("Removing pairings for score group {}", pairingContext.getPreviousScoreGroup().score);
					pairsByScoreGroup.remove(pairingContext.getCurrentScoreGroup());
					pairsByScoreGroup.remove(pairingContext.getPreviousScoreGroup());
				}
			}
		}
		List<Pair<Player, Player>> pairs = new ArrayList<>();
		pairsByScoreGroup.values().forEach(pairsForScoreGroup -> pairs.addAll(pairsForScoreGroup));
		
		log.info("Pairs count {}", pairs.size());
		
		return pairs.stream().map(pair -> assignColoursAndFinalizePairing(pair, round))
				.collect(Collectors.toList());
	}

	private Pairing assignColoursAndFinalizePairing(Pair<Player, Player> pair, int round) {
		Player player1 = pair.getValue0();
		Player player2 = pair.getValue1();

		GameColor player1ExpectedColor = player1.getExpectedColor();
		GameColor player2ExpectedColor = player2.getExpectedColor();

		if (Math.abs(player1.getColorBalance()) > Math.abs(player2.getColorBalance())) {
			return PairingHelper.createPairing(round, player1, player2, player1ExpectedColor);
		} else if (Math.abs(player1.getColorBalance()) < Math.abs(player2.getColorBalance())) {
			return PairingHelper.createPairing(round, player2, player1, player2ExpectedColor);
		} else if (player1.getPoints() > player2.getPoints()) {
			return PairingHelper.createPairing(round, player1, player2, player1ExpectedColor);
		} else if (player1.getPoints() < player2.getPoints()) {
			return PairingHelper.createPairing(round, player2, player1, player2ExpectedColor);
		} else {
			return PairingHelper.createPairing(round, player2, player1, player2ExpectedColor);
		}

	}

	private Player getPlayerWithBye(List<Player> tournamentPlayers, int round) {

		List<Player> tournamentPlayersWithoutBye = tournamentPlayers.stream()
				.filter(player -> player.getByeInRound() == 0).collect(Collectors.toList());
		Player playerWithBye = tournamentPlayers
				.get(ThreadLocalRandom.current().nextInt(0, tournamentPlayersWithoutBye.size()));
		playerWithBye.setByeInRound(round);
		playerWithBye.setAlreadyPaired(true);

		return playerWithBye;
	}


	private List<Player> getPlayersByColorInLastRound(List<Player> players, GameColor gamecolor) {
		return players.stream()
				.filter(playerInGroup -> playerInGroup.getColorSequence().endsWith(gamecolor.getColorAbbreviation()))
				.collect(Collectors.toList());
	}

	private List<Player> getPlayersWhoCanHaveSpecifiedColorInNextRound(List<Player> players, GameColor gamecolor) {

		if (gamecolor == WHITE) {
			return players.stream()
					.filter(playerInGroup -> !"ww".equals(playerInGroup.getColorSequence())
							&& playerInGroup.getColorBalance() < 2)
					.sorted((player1, player2) -> Integer.compare(player2.getColorBalance(), player1.getColorBalance()))
					.collect(Collectors.toList());
		} else {
			return players.stream()
					.filter(playerInGroup -> !"bb".equals(playerInGroup.getColorSequence())
							&& playerInGroup.getColorBalance() > -2)
					.sorted((player1, player2) -> Integer.compare(player1.getColorBalance(), player2.getColorBalance()))
					.collect(Collectors.toList());
		}

	}

	private void switchPlayers(List<Player> playersWithoutOponent, List<Pairing> pairings) {

		if (playersWithoutOponent.stream().allMatch(player -> player.getColorSequence().equals("ww"))) {
			List<Player> players = pairings.stream().map(Pairing::getBlackPlayer)
					.sorted((Player player1, Player player2) -> Float.compare(player2.getPoints(), player1.getPoints()))
					.collect(Collectors.toList());

			for (Player player3 : players) {
				// List<Players> players.stream().filter(player2 ->
				// !player3.getPreviousOponents().contains(player2))
			}

		}
	}

}
