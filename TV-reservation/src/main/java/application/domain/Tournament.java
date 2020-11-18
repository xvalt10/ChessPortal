package application.domain;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import application.util.TournamentState;
import application.util.TournamentType;

public class Tournament {
	
	private List<Player> tournamentPlayers;
	
	private int time;
	
	private int increment;
	
	private String tournamentId;
	
	private int numberOfRounds;
	
	private int currentRound;
	
	private OffsetDateTime startDateTime;
	
	private TournamentType tournamentType;
	
	private TournamentState tournamentState;
	
	private List<Pairing> pairings;
	
	private Map<String, Float> scores;
	
	public Tournament(int time, int increment, OffsetDateTime startDateTime, TournamentType tournamentType) {
		this.tournamentId = UUID.randomUUID().toString();
		this.time = time;
		this.increment = increment;
		this.tournamentPlayers = new ArrayList<>();
		this.startDateTime = startDateTime;
		this.tournamentType = tournamentType;
		this.pairings = new ArrayList<Pairing>();
		this.scores = new HashMap<>();
		this.tournamentState = TournamentState.NOT_STARTED;
	
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

	public OffsetDateTime getStartDateTime() {
		return startDateTime;
	}

	public void setStartDateTime(OffsetDateTime startDateTime) {
		this.startDateTime = startDateTime;
	}

	public TournamentType getTournamentType() {
		return tournamentType;
	}

	public void setTournamentType(TournamentType tournamentType) {
		this.tournamentType = tournamentType;
	}

	public List<Pairing> getPairings() {
		return pairings;
	}

	public void setPairings(List<Pairing> pairings) {
		this.pairings = pairings;
	}

	public Map<String, Float> getScores() {
		return scores;
	}

	public void setScores(Map<String, Float> scores) {
		this.scores = scores;
	}

	public int getNumberOfRounds() {
		return numberOfRounds;
	}

	public void setNumberOfRounds(int numberOfRounds) {
		this.numberOfRounds = numberOfRounds;
	}

	public int getCurrentRound() {
		return currentRound;
	}

	public void setCurrentRound(int currentRound) {
		this.currentRound = currentRound;
	}

	public TournamentState getTournamentState() {
		return tournamentState;
	}

	public void setTournamentState(TournamentState tournamentState) {
		this.tournamentState = tournamentState;
	}
	
	
	
	
	

}
