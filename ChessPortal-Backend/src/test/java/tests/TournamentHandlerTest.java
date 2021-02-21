package tests;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.junit.Ignore;
import org.junit.jupiter.api.Test;

import application.domain.Pairing;
import application.domain.Player;
import application.domain.Score;
import application.domain.Tournament;
import application.tournaments.TournamentHandler;
import application.util.TournamentType;

class TournamentHandlerTest {
	
	TournamentHandler tournamentHandler = new TournamentHandler();

	@Test
	void testJoinTournament() {
		fail("Not yet implemented");
	}

	@Test
	void testSendTournamentInfoToPlayer() {
		fail("Not yet implemented");
	}

	@Test
	void testGeneratePairings() {
		
		Tournament tournament = new Tournament("", 3, 0, LocalDateTime.now(), TournamentType.SWISS);
		tournament.setNumberOfRounds(9);
		
		List<Player> players = generatePlayers(30); 
		tournament.setTournamentPlayers(players);
		Map<String, Score> scores = tournament.getScores();
		List<String> playerNames = tournament.getTournamentPlayers().stream().map(Player::getUsername)
				.collect(Collectors.toList());
		playerNames.forEach(playerName -> scores.put(playerName, new Score(playerName)));
		
		for (int round = 1; round <= tournament.getNumberOfRounds(); round++) {
			List<Pairing> pairingsForRound = tournament.getPairingGenerator().generatePairings(tournament, round);
			tournament.getPairings().addAll(pairingsForRound);
			generateRandomGameResults(tournament, pairingsForRound);
		}
		
	}
	
	
	
	
	private List<Player> generatePlayers(int count) {
		List<Player> tournamentPlayers = new ArrayList<>();
		for (int i = 0; i < count; i++) {
			Player player = new Player();
			player.setUsername("player"+i);
			tournamentPlayers.add(player);
		}
		
		return tournamentPlayers;
	}
	
	private void generateRandomGameResults(Tournament tournament,List<Pairing> pairings) {
		for(Pairing pairing:pairings) {
			pairing.setGameId(UUID.randomUUID().toString());
			String gameresult = null;
			double random = Math.random();
			if(random >= 0 && random < 0.33 ) {
				gameresult = "1-0";
			} else if(random < 0.66) {
				gameresult = "0-1";
			} else {gameresult = "1/2";}
			
			tournamentHandler.processTournamentGameResult(tournament, pairing.getGameId(), gameresult);
			
		}
		
	}

	@Test
	void testGeneratePairingsRoundRobin2() {
		List<Player> tournamentPlayers = new ArrayList<>();
		tournamentPlayers.add(generatePlayer("player1"));
		tournamentPlayers.add(generatePlayer("player2"));
		tournamentPlayers.add(generatePlayer("player3"));
		tournamentPlayers.add(generatePlayer("player4"));
		tournamentPlayers.add(generatePlayer("player5"));
		
			
//		List<Pairing> pairingsForRound1 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 1);
//		System.out.println(pairingsForRound1);
//		
//		List<Pairing> pairingsForRound2 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 2);
//		System.out.println(pairingsForRound2);
//		
//		List<Pairing> pairingsForRound3 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 3);
//	    System.out.println(pairingsForRound3);
//		
//		List<Pairing> pairingsForRound4 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 4);	
//		System.out.println(pairingsForRound4);
//		
//		List<Pairing> pairingsForRound5 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 5);	
//		System.out.println(pairingsForRound5);
//			
	}
	
	@Test
	@Ignore
	void testGeneratePairingsRoundRobin() {
//		List<Player> tournamentPlayers = new ArrayList<>();
//		tournamentPlayers.add(generatePlayer("player1"));
//		tournamentPlayers.add(generatePlayer("player2"));
//		tournamentPlayers.add(generatePlayer("player3"));
//		tournamentPlayers.add(generatePlayer("player4"));
//		tournamentPlayers.add(generatePlayer("player5"));
//		
//			
//		List<Pairing> pairingsForRound1 = tournamentHandler.generatePairingsRoundRobin(tournamentPlayers, 1, new ArrayList<>());
//		System.out.println(pairingsForRound1);
//		List<Pairing> pairingsForRound2 = tournamentHandler.generatePairingsRoundRobin(tournamentPlayers, 2, pairingsForRound1);
//		System.out.println(pairingsForRound2);
//		pairingsForRound2.addAll(pairingsForRound1);
//		List<Pairing> pairingsForRound3 = tournamentHandler.generatePairingsRoundRobin(tournamentPlayers, 3, pairingsForRound2);
//	    System.out.println(pairingsForRound3);
//		pairingsForRound3.addAll(pairingsForRound2);
//		List<Pairing> pairingsForRound4 = tournamentHandler.generatePairingsRoundRobin(tournamentPlayers, 4, pairingsForRound3);	
//		System.out.println(pairingsForRound4);
		
		
	}
	
	public Player generatePlayer(String name) {
		Player player = new Player();
		player.setUsername(name);
		return player;
	}

}
