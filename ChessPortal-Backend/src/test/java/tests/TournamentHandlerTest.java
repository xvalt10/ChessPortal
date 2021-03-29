package tests;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Ignore;
import org.junit.jupiter.api.Test;

import application.domain.Pairing;
import application.domain.Player;
import application.tournaments.TournamentHandler;

class TournamentHandlerTest {
	
	///TournamentHandler tournamentHandler = new TournamentHandler();

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
		fail("Not yet implemented");
	}

	@Test
	void testGeneratePairingsRoundRobin2() {
		List<Player> tournamentPlayers = new ArrayList<>();
		tournamentPlayers.add(generatePlayer("player1"));
		tournamentPlayers.add(generatePlayer("player2"));
		tournamentPlayers.add(generatePlayer("player3"));
		tournamentPlayers.add(generatePlayer("player4"));
		tournamentPlayers.add(generatePlayer("player5"));
		
			
		/*List<Pairing> pairingsForRound1 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 1);
		System.out.println(pairingsForRound1);
		
		List<Pairing> pairingsForRound2 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 2);
		System.out.println(pairingsForRound2);
		
		List<Pairing> pairingsForRound3 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 3);
	    System.out.println(pairingsForRound3);
		
		List<Pairing> pairingsForRound4 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 4);	
		System.out.println(pairingsForRound4);
		
		List<Pairing> pairingsForRound5 = tournamentHandler.generatePairingsRoundRobinCircleMethod(tournamentPlayers, 5);	
		System.out.println(pairingsForRound5);*/
			
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
