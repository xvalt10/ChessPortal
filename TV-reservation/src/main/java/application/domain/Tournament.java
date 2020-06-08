package application.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Tournament {
	
	private List<Player> tournamentPlayers;
	
	private int time;
	
	private int increment;
	
	private String tournamentId;
	
	public Tournament(int time, int increment) {
		this.tournamentId = UUID.randomUUID().toString();
		this.time = time;
		this.increment = increment;
		this.tournamentPlayers = new ArrayList<>();
		// TODO Auto-generated constructor stub
	}

	public List<Player> getTournamentPlayers() {
		return tournamentPlayers;
	}

	public void setTournamentPlayers(List<Player> tournamentPlayers) {
		this.tournamentPlayers = tournamentPlayers;
	}

	public int getTime() {
		return time;
	}

	public void setTime(int time) {
		this.time = time;
	}

	public int getIncrement() {
		return increment;
	}

	public void setIncrement(int increment) {
		this.increment = increment;
	}

	public String getTournamentId() {
		return tournamentId;
	}

	public void setTournamentId(String tournamentId) {
		this.tournamentId = tournamentId;
	}
	
	
	
	

}
