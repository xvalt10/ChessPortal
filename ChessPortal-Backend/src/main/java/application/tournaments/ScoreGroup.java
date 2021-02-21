package application.tournaments;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.math3.util.CombinatoricsUtils;
import org.javatuples.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import application.domain.Player;
import application.util.GameColor;
import application.util.PairingNotPossibleException;
import application.util.Permutations;

public class ScoreGroup {

	private static final Logger log = LoggerFactory.getLogger(ScoreGroup.class);

	float score;
	int index;
	SwissSystemPairingContext swissSystemPairingContext;

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
	}

	List<Player> allPlayers;
	List<Player> remainingPlayers;
	List<Pair<Player, Player>> pairings;
	Player incompatiblePlayer;
	Player playerWithBye;
	int exchangeLength;
	List<Pair<List<Player>, List<Player>>> exchanges;

	SwissSystemPairingCriteria pairingCriteria;

	List<Player> firstPartOfGroup;
	List<Player> secondPartOfGroup;
	boolean isHeterogenous;
	boolean pairedFloaters;

	int maximumNumberOfPairs_p0;
	int numberOfDownfloaters_m0;

	int x1;
	int p1;
	int z1;
	int m1;

	int p;
	int x;
	int z;

	public ScoreGroup() {
		// TODO Auto-generated constructor stub
	}
	
	

	public ScoreGroup(float score, List<Player> allPlayers) {
		this.score = score;
		this.allPlayers = allPlayers;

		this.remainingPlayers = new ArrayList<>();
		this.pairings = new ArrayList<>();
		this.isHeterogenous = isGroupHeterogenous();
		this.exchangeLength = 0;
        this.exchanges = new ArrayList<>();
		this.pairingCriteria = new SwissSystemPairingCriteria(this);

	}

	public void startPairingProcess_c1() {
		
		Set<Player> playersToDownfloat = new HashSet<>();
		
		
		log.info("Starting the pairing process of the players: {}", getPlayers());

		for (Player player : getPlayers()) {
			List<Player> candidateOponentsFromScoreGroup = filterPlayersFromScoreGroup(player, getPlayers());

			if (candidateOponentsFromScoreGroup.isEmpty()) {
				Player incompatiblePlayer = player;
				if (getPlayers().size() == 2) {
					incompatiblePlayer = player.getPoints() > getPlayers().get(1).getPoints() ? player
							: getPlayers().get(1);
				}
				setIncompatiblePlayer(incompatiblePlayer);

				if (player.getPoints() > score) {
					if (isLastScoreGroup()) {
						pairDownfloaterInLastScoreGroup_c13();
						break;
					} else {
						pairDownfloaterIfNotLastScoreGroup_c12();
						break;
					}

				} else if (isLastScoreGroup()) {
					pairDownfloaterInLastScoreGroup_c13();
					break;
				} else if (this.swissSystemPairingContext.canDownfloat(incompatiblePlayer)) {
					playersToDownfloat.add(incompatiblePlayer);					
				}
				// scoreGroup.getRemainingPlayers().add(player);

			}

		}
		playersToDownfloat.forEach(player -> this.swissSystemPairingContext.downfloatPlayer(player));
		
		if(!getAllPlayers().isEmpty()) {
			setScoreGroupProperties();
			dividePlayersIntoTwoGroups();
			sortPlayersByTheirScoresDescending(firstPartOfGroup);
			sortPlayersByTheirScoresDescending(secondPartOfGroup);
			List<Pair<Player, Player>> validPairs = pairPlayersForScoreGroup_c6();
			log.info("Adding {} pairs to score group", validPairs.size());
			//pairings.clear();
			pairings.addAll(validPairs);
		}
		
	
	}

	private List<Pair<Player, Player>> pairPlayersForScoreGroup_c6() {

		List<Pair<Player, Player>> pairs = new ArrayList<>();

		List<Player> originalFirstPartOfGroup = new ArrayList<>(firstPartOfGroup.size());
		List<Player> originalSecondPartOfGroup = new ArrayList<>(secondPartOfGroup.size());

		originalFirstPartOfGroup.addAll(firstPartOfGroup);
		originalSecondPartOfGroup.addAll(secondPartOfGroup);

		boolean pairingSatisfyingCriteriaFound = false;

		while (!pairingSatisfyingCriteriaFound) {

			long numberOfPermutations = Permutations.factorial(secondPartOfGroup.size());
			outer: for (long i = 0; i < numberOfPermutations; i++) {
				pairs = new ArrayList<>();
				secondPartOfGroup = Permutations.permutation(i, secondPartOfGroup);

				for (int j = 0; j < firstPartOfGroup.size(); j++) {
					if(j < secondPartOfGroup.size()) {
					Pair<Player, Player> pairing = new Pair<>(firstPartOfGroup.get(j), secondPartOfGroup.get(j));
					pairs.add(pairing);}
				}

				List<Player> unpairedPlayers = getUnpairedPlayers(pairs);
				Player bye = unpairedPlayers.size() == 1 && isLastScoreGroup() ? unpairedPlayers.get(0) : null;
				Player floater = unpairedPlayers.size() == 1 && bye == null ? unpairedPlayers.get(0) : null;

				if (pairingCriteria.pairingsSatisfyCriteria(pairs, floater, bye)) {

					if (floater != null) {
						if (swissSystemPairingContext.canDownfloat(floater) || !alternativeFloatersIdentified()) {
							pairings.addAll(pairs);
							log.info("downfloating player in c6");
							swissSystemPairingContext.downfloatPlayer(floater);
						} else {
							continue;
						}
					} else {
						pairings.addAll(pairs);
						playerWithBye = bye;

						if (unpairedPlayers.size() > 1) {
							
							pairedFloaters = true;
							if(this.exchanges != null) {
							this.exchanges.clear();}
							this.remainingPlayers = unpairedPlayers;
							this.exchangeLength = 0;
							p = p1 - m1;
							x = x1;
							log.info("Heterogenous group - floaters paired, continuing with homogenous group p = {}, x = {} ,players - {}",p,x, unpairedPlayers);
							dividePlayersIntoTwoGroups();
							sortPlayersByTheirScoresDescending(firstPartOfGroup);
							sortPlayersByTheirScoresDescending(secondPartOfGroup);
							pairPlayersForScoreGroup_c6();

						}
					}

					pairingSatisfyingCriteriaFound = true;
					break;
				}
			}

			if (!pairingSatisfyingCriteriaFound) {

				if (exchanges == null || exchanges.isEmpty()) {
					if (isGroupHeterogenous()) {
						updatePairingCriteria();
					} else {

						setExchangeLength(exchangeLength + 1);
						if (exchangeLength <= p) {

							List<Pair<List<Player>, List<Player>>> possibleExchanges = generateExchanges(
									originalFirstPartOfGroup, originalSecondPartOfGroup, exchangeLength);
							//log.info("Generated {} possible exchanges for exchange length {}", possibleExchanges.size(),
							//		exchangeLength);
							setExchanges(possibleExchanges);
						} else {
							exchangeLength = 0;
							remainingPlayers.clear();
							
							log.warn("Transpositions and exchanges exhausted.");

							if (isGroupHeterogenous()) {
								pairings.clear();
								dividePlayersIntoTwoGroups();
								p = p1;
								x = x1;
								pairPlayersForScoreGroup_c6();
							} else {
								updatePairingCriteria();
								pairPlayersForScoreGroup_c6();
							}
							//throw new RuntimeException("Transpositions and exchanges exhausted.");
						}
					}
				} else {

					Pair<List<Player>, List<Player>> exchange = exchanges.get(0);
					log.info("\n S1 {} \n S2 {}", firstPartOfGroup, secondPartOfGroup);

					firstPartOfGroup.clear();
					firstPartOfGroup.addAll(originalFirstPartOfGroup);

					secondPartOfGroup.clear();
					secondPartOfGroup.addAll(originalSecondPartOfGroup);

					executeExchangeOfPlayers(firstPartOfGroup, secondPartOfGroup, exchange);
					//log.info("\n S1 {} \n S2 {}", firstPartOfGroup, secondPartOfGroup);
					exchanges.remove(0);
					//log.info("Exchanges remaining {} for exchange length {}", exchanges.size(), exchangeLength);
				}

			}
		};
		
		log.info("Following pairs have been identified {}", pairs);
		return pairs;
	}

	private void updatePairingCriteria() {
		if (pairingCriteria.sameUpfloatAsTwoRoundsBefore_b6) {
			pairingCriteria.sameUpfloatAsTwoRoundsBefore_b6 = false;
		} else if (pairingCriteria.doubleUpfloat_b5) {
			pairingCriteria.doubleUpfloat_b5 = false;
		} else if (pairingCriteria.sameDonwfloatAsTwoRoundsBefore_b6) {
			pairingCriteria.sameDonwfloatAsTwoRoundsBefore_b6 = false;
		} else if (pairingCriteria.doubleDownfloat_b5) {
			pairingCriteria.doubleDownfloat_b5 = false;
		} else {
			if (swissSystemPairingContext.roundNumber % 2 != 0) {
				if (x < p1) {
					x += 1;
				}
			} else {
				if (z < x) {
					z += 1;
				} else if (z == x && x < p1) {
					x += 1;
					z = z1;
				}
			}

			pairingCriteria.sameUpfloatAsTwoRoundsBefore_b6 = true;
			pairingCriteria.sameDonwfloatAsTwoRoundsBefore_b6 = true;
			pairingCriteria.doubleDownfloat_b5 = true;
			pairingCriteria.doubleUpfloat_b5 = true;
		}

	}

	private boolean alternativeFloatersIdentified() {
		return getPlayers().stream()
				.anyMatch(player -> pairingCriteria.noIdenticalFloatInAsTwoRoundsBefore_b6(player, null)
						&& pairingCriteria.noIdenticalFloatInTwoConsecutiveRounds_b5(player, null)
						&& swissSystemPairingContext.canDownfloat(player));

	}

	private List<Player> getUnpairedPlayers(List<Pair<Player, Player>> pairings) {
		List<Player> allPlayers = new ArrayList<>();
		allPlayers.addAll(firstPartOfGroup);
		allPlayers.addAll(secondPartOfGroup);

		List<Player> pairedPlayers = new ArrayList<>();
		pairings.forEach(pairing -> {
			pairedPlayers.add(pairing.getValue0());
			pairedPlayers.add(pairing.getValue1());
		});

		return allPlayers.stream().filter(player -> !pairedPlayers.contains(player)).collect(Collectors.toList());
	}

	private void executeExchangeOfPlayers(List<Player> firstPartOfGroup, List<Player> secondPartOfGroup,
			Pair<List<Player>, List<Player>> subsetsToExchange) {

		List<Player> playersToExchangeFromFirstGroup = subsetsToExchange.getValue0();
		for (Player player : playersToExchangeFromFirstGroup) {
			firstPartOfGroup.remove(player);
			secondPartOfGroup.add(player);
		}
		;

		List<Player> playersToExchangeFromSecondGroup = subsetsToExchange.getValue1();
		for (Player player : playersToExchangeFromSecondGroup) {
			secondPartOfGroup.remove(player);
			firstPartOfGroup.add(player);
		}
		;

		//log.info("Exchanged players - S1 {} S2 {}", playersToExchangeFromFirstGroup, playersToExchangeFromSecondGroup);
	}

	private List<Pair<List<Player>, List<Player>>> generateExchanges(List<Player> leftPartfOfScoreGroup,
			List<Player> rightPartfOfScoreGroup, int noOfExchanges) {
		Iterator<int[]> leftSubsets = CombinatoricsUtils.combinationsIterator(leftPartfOfScoreGroup.size(),
				noOfExchanges);

		List<Pair<List<Player>, List<Player>>> exchanges = new ArrayList<>();
		while (leftSubsets.hasNext()) {
			List<Player> playersToExchangeFromLeftGroup = new ArrayList<>();
			int[] playerIndexesFromLeftSubset = leftSubsets.next();
			for (int i = 0; i < playerIndexesFromLeftSubset.length; i++) {
				playersToExchangeFromLeftGroup.add(leftPartfOfScoreGroup.get(playerIndexesFromLeftSubset[i]));
			}
			Iterator<int[]> rightSubsets = CombinatoricsUtils.combinationsIterator(rightPartfOfScoreGroup.size(),
					noOfExchanges);
			while (rightSubsets.hasNext()) {
				List<Player> playersToExchangeFromRightGroup = new ArrayList<>();
				int[] playerIndexesFromRightSubset = rightSubsets.next();
				for (int i = 0; i < playerIndexesFromRightSubset.length; i++) {
					playersToExchangeFromRightGroup.add(rightPartfOfScoreGroup.get(playerIndexesFromRightSubset[i]));
				}
				Pair<List<Player>, List<Player>> exchange = new Pair<>(playersToExchangeFromLeftGroup,
						playersToExchangeFromRightGroup);
				exchanges.add(exchange);

			}
		}
		return exchanges;
	}

	private void dividePlayersIntoTwoGroups() {
		sortPlayersByTheirScoresDescending(getPlayers());
		firstPartOfGroup = getPlayers().subList(0, p);
		secondPartOfGroup = getPlayers().subList(p, getPlayers().size());

	}

	private void setScoreGroupProperties() {
		p1 = getMaximumNumberOfPairs_p0();
		m1 = getNumberOfDownfloaters_m0();

		x1 = calculateX1();
		z1 = calculateZ1();

		if (isGroupHeterogenous()) {
			
			p = m1;
		} else {
			p = p1;
		}

		x = x1;
		z = z1;
		log.info("Group properties p = {}, x = {}, z = {}", p, x, z);
	}

	private GameColor getMajorityExpectedColor() {
		int playersExpectingWhite = getPlayers().stream().filter(player -> player.getExpectedColor() == GameColor.WHITE)
				.collect(Collectors.toList()).size();
		int playersExpectingBlack = getPlayers().stream().filter(player -> player.getExpectedColor() == GameColor.BLACK)
				.collect(Collectors.toList()).size();

		GameColor gameColor = GameColor.BYE;
		if (playersExpectingWhite > playersExpectingBlack) {
			gameColor = GameColor.WHITE;
		} else if (playersExpectingWhite < playersExpectingBlack) {
			gameColor = GameColor.BLACK;
		}

		return gameColor;
	}

	private int calculateX1() {
		int playersExpectingWhite = getPlayers().stream().filter(player -> player.getExpectedColor() == GameColor.WHITE)
				.collect(Collectors.toList()).size();
		int playersExpectingBlack = getPlayers().stream().filter(player -> player.getExpectedColor() == GameColor.BLACK)
				.collect(Collectors.toList()).size();

		return Math.floorDiv(Math.abs((playersExpectingWhite - playersExpectingBlack)), 2);
	}

	private int calculateZ1() {
		if (this.swissSystemPairingContext.roundNumber % 2 != 0) {
			return x1;
		}
		GameColor colorExpectedByMajorityOfPlayers = getMajorityExpectedColor();
		int countOfPlayersExpectingSameColorAsMajorityWithColorBalanceZero = 0;
		for (Player player : getPlayers()) {
			if (player.getColorBalance() == 0 && player.getExpectedColor() == colorExpectedByMajorityOfPlayers) {
				countOfPlayersExpectingSameColorAsMajorityWithColorBalanceZero++;
			}
		}
		return x1 - countOfPlayersExpectingSameColorAsMajorityWithColorBalanceZero;
	}

	private void pairDownfloaterIfNotLastScoreGroup_c12() {
		Player player = incompatiblePlayer;
		if (this.swissSystemPairingContext.canBacktrack(player)) {
			this.swissSystemPairingContext.backtrackPlayer(player);
			this.incompatiblePlayer = null;
			throw new PairingNotPossibleException("Backtracking downfloater not in last score bracket _c12.");
		} else if (isGroupHeterogenous()) {
			_c14b();
		} else {
			_c14a();
		}
	}

	private void pairDownfloaterInLastScoreGroup_c13() {
		if (isGroupHeterogenous()) {
			_c14b();
		} else {
			Player incompatiblePlayer = getIncompatiblePlayer();
			if (getSwissSystemPairingContext().canBacktrack(incompatiblePlayer)) {
				getSwissSystemPairingContext().backtrackPlayer(incompatiblePlayer);
				setIncompatiblePlayer(null);
				throw new PairingNotPossibleException("Backtracking downfloater in last score bracket _c13.");
			} else {
				getSwissSystemPairingContext().collapsePreviousScoreGroup();
				setIncompatiblePlayer(null);
				throw new PairingNotPossibleException("Backtracking downfloater in last score bracket _c13 - collapsing previous scoregroup.");
				//startPairingProcess_c1();
			}

		}
	}

	private void _c14a() {
		if (p1 == 0) {
			swissSystemPairingContext.collapseCurrentScoreGroup();
			throw new PairingNotPossibleException("Collapsing current score bracket.");
		} else {
			p1 -= 1;
			x1 -= x1 > 0 ? 1 : 0;
			z1 -= z1 > 0 && swissSystemPairingContext.roundNumber % 2 == 0 ? 1 : 0;
		}

		if (isGroupHeterogenous()) {
			p = m1;
		} else {
			p = p1;
		}
		x = x1;
		z = z1;
		dividePlayersIntoTwoGroups();
		sortPlayersByTheirScoresDescending(firstPartOfGroup);
		sortPlayersByTheirScoresDescending(secondPartOfGroup);
		pairPlayersForScoreGroup_c6();
	}

	private void _c14b() {
		if (pairedFloaters && !isLastScoreGroup()) {
			p1 -= 1;
			x1 -= x1 > 0 ? 1 : 0;
			z1 -= swissSystemPairingContext.roundNumber % 2 == 0 ? 1 : 0;

		} else {
			if (m1 > 1) {
				m1 -= 1;
				if (isGroupHeterogenous()) {
					p = m1;
				} else {
					p = p1;
				}

			} else if (m1 == 1) {
				m1 = 0;
				p1 = maximumNumberOfPairs_p0;
				x1 = calculateX1();
				z1 = calculateZ1();
			}

		}

		if (isGroupHeterogenous()) {
			p = m1;
		} else {
			p = p1;
		}
		x = x1;
		z = z1;
		dividePlayersIntoTwoGroups();
		sortPlayersByTheirScoresDescending(firstPartOfGroup);
		sortPlayersByTheirScoresDescending(secondPartOfGroup);
		pairPlayersForScoreGroup_c6();
	}

	private List<Player> filterPlayersFromScoreGroup(Player player, List<Player> playersWithSameScore) {

		List<Player> forbiddenPairings = new ArrayList<>();

		if (player.getColorBalance() == 2) {
			forbiddenPairings.addAll(playersWithSameScore.stream().filter(player2 -> player2.getColorBalance() == 2)
					.collect(Collectors.toList()));
		} else if (player.getColorBalance() == -2) {
			forbiddenPairings.addAll(playersWithSameScore.stream().filter(player2 -> player2.getColorBalance() == -2)
					.collect(Collectors.toList()));
		}
		if (player.getColorSequence().equals("ww")) {
			forbiddenPairings.addAll(playersWithSameScore.stream()
					.filter(player2 -> player2.getColorSequence().equals("ww")).collect(Collectors.toList()));
		} else if (player.getColorSequence().equals("bb")) {
			forbiddenPairings.addAll(playersWithSameScore.stream()
					.filter(player2 -> player2.getColorSequence().equals("bb")).collect(Collectors.toList()));
		}

		List<Player> candidateOponentsFromScoreGroup = playersWithSameScore.stream()
				.filter(playerInGroup -> !player.getPreviousOponents().contains(playerInGroup))
				.filter(playerInGroup -> !playerInGroup.getUsername().equals(player.getUsername()))
				.filter(playerInGroup -> !playerInGroup.isAlreadyPaired())
				.filter(playerInGroup -> !forbiddenPairings.contains(playerInGroup)).collect(Collectors.toList());
		return candidateOponentsFromScoreGroup;
	}

	private void sortPlayersByTheirScoresDescending(List<Player> players) {
		players.sort((Player player1, Player player2) -> Float.compare(player1.getPoints(), player2.getPoints()));
		Collections.reverse(players);

	}

	public int getMaximumNumberOfPairs_p0() {
		return Math.floorDiv(this.getPlayers().size(), 2);
	}

	public int getNumberOfDownfloaters_m0() {
		return this.getPlayers().stream().filter(player -> player.getPoints() > this.score).collect(Collectors.toList())
				.size();
	}

	public void reset() {
		this.remainingPlayers.clear();
		this.pairings.clear();
		this.exchanges = null;
		this.exchangeLength = 1;
	}

	public boolean isLastScoreGroup() {
		return this.swissSystemPairingContext.lowestScoreGroup();
	}

	public SwissSystemPairingContext getSwissSystemPairingContext() {
		return swissSystemPairingContext;
	}

	public void setSwissSystemPairingContext(SwissSystemPairingContext swissSystemPairingContext) {
		this.swissSystemPairingContext = swissSystemPairingContext;
	}

	public void addPlayer(Player player) {
		this.allPlayers.add(player);
	}

	public void removePlayer(Player player) {
		this.allPlayers.remove(player);
	}

	public boolean canBackTrack(Player player) {
		return !player.equals(incompatiblePlayer);
	}

	public void backtrackPlayer(Player player) {
		this.reset();
		addPlayer(player);
	}

	private boolean isGroupHeterogenous() {
		return this.getPlayers().stream().anyMatch(player -> player.getScore().getPoints() != this.score);
	}

	public float getScore() {
		return score;
	}

	public void setScore(float score) {
		this.score = score;
	}

	public List<Player> getAllPlayers() {
		return allPlayers;
	}

	public void setAllPlayers(List<Player> allPlayers) {
		this.allPlayers = allPlayers;
	}

	public List<Player> getRemainingPlayers() {
		return remainingPlayers;
	}

	public void setRemainingPlayers(List<Player> remainingPlayers) {
		this.remainingPlayers = remainingPlayers;
	}

	public List<Pair<Player, Player>> getPairings() {
		return pairings;
	}

	public void setPairings(List<Pair<Player, Player>> pairings) {
		this.pairings = pairings;
	}

	public Player getIncompatiblePlayer() {
		return incompatiblePlayer;
	}

	public void setIncompatiblePlayer(Player incompatiblePlayer) {
		this.incompatiblePlayer = incompatiblePlayer;
	}

	public int getExchangeLength() {
		return exchangeLength;
	}

	public void setExchangeLength(int exchangeLength) {
		this.exchangeLength = exchangeLength;
	}

	public List<Pair<List<Player>, List<Player>>> getExchanges() {
		return exchanges;
	}

	public void setExchanges(List<Pair<List<Player>, List<Player>>> exchanges) {
		this.exchanges = exchanges;
	}

	public void generatePairings(SwissSystemPairingContext context) {
		this.swissSystemPairingContext = context;
		startPairingProcess_c1();

	}

	public List<Player> getPlayers() {
		if (remainingPlayers != null && !remainingPlayers.isEmpty()) {
			return remainingPlayers;
		} else
			return allPlayers;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + Float.floatToIntBits(score);
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ScoreGroup other = (ScoreGroup) obj;
		if (Float.floatToIntBits(score) != Float.floatToIntBits(other.score))
			return false;
		return true;
	}
	
	

}
