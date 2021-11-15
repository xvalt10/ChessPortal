package application.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

import application.tournaments.PairingsGenerator;
import application.tournaments.RoundRobinPairingsGenerator;
import application.tournaments.SwissSystemPairingsGenerator;
import application.util.TournamentState;
import application.util.TournamentType;

public class Tournament {

	private List<Player> players;

	private List<Player> playersInLobby;

	protected int time;

	protected String name;

	@JsonIgnore
	private PairingsGenerator pairingGenerator;

	protected int increment;

	private String id;

	protected int numberOfRounds;

	private int currentRound;

	protected LocalDateTime utcStartDateTime;

	protected TournamentType type;

	private TournamentState state;

	private List<Pairing> pairings;

	private Map<String, Score> scores;

	public Tournament(){
		this.id = UUID.randomUUID().toString();
		this.state = TournamentState.NOT_STARTED;
		this.players = new ArrayList<>();
		this.playersInLobby = new ArrayList<>();
		this.pairings = new ArrayList<Pairing>();
		this.scores = new HashMap<>();
	}

	public Tournament(String name, int time, int increment, LocalDateTime startDateTime,
					  TournamentType type) {
		this();
		this.name = name;
		this.time = time;
		this.increment = increment;
		this.utcStartDateTime = startDateTime;
		this.type = type;
		switch (this.type) {
		case SWISS:
			this.pairingGenerator = new SwissSystemPairingsGenerator();
			break;
		case ROUND_ROBIN:
			this.pairingGenerator = new RoundRobinPairingsGenerator();
			break;
		}
	}

	public List<Player> getPlayers() {
		return players;
	}

	public void setPlayers(List<Player> players) {
		this.players = players;
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public LocalDateTime getUtcStartDateTime() {
		return utcStartDateTime;
	}

	public void setUtcStartDateTime(LocalDateTime startDateTime) {
		this.utcStartDateTime = startDateTime;
	}

	public TournamentType getType() {
		return type;
	}

	public void setType(TournamentType type) {
		this.type = type;
	}

	public List<Pairing> getPairings() {
		return pairings;
	}

	public void setPairings(List<Pairing> pairings) {
		this.pairings = pairings;
	}

	public Map<String, Score> getScores() {
		return scores;
	}

	public void setScores(Map<String, Score> scores) {
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

	public TournamentState getState() {
		return state;
	}

	public void setState(TournamentState state) {
		this.state = state;
	}

	public List<Player> getPlayersInLobby() {
		return playersInLobby;
	}

	public void setPlayersInLobby(List<Player> playersInLobby) {
		this.playersInLobby = playersInLobby;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public PairingsGenerator getPairingGenerator() {
		return pairingGenerator;
	}

	public void setPairingGenerator(PairingsGenerator pairingGenerator) {
		this.pairingGenerator = pairingGenerator;
	}

}
