package application.domain;

import java.io.Serializable;
import java.util.*;

import application.util.GameTimeType;

public class Game implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1559402074585394052L;
	private String gameId;
	private Player whitePlayer;
	private Player blackPlayer;
	private GameTimeType gameTimeType;

	private int time;
	private int increment;
	private boolean ongoing = true;
	private Set<Player> observers = new HashSet<>();
	private Map<Integer, Move> annotatedMoves = new HashMap<>();

	public Game() {

	}

	public Game(Player whitePlayer, Player blackPlayer, int time, int increment) {
		this.whitePlayer = whitePlayer;
		this.blackPlayer = blackPlayer;
		this.time = time;
		setGameTimeType(this.time);
		this.increment = increment;
		this.gameId = UUID.randomUUID().toString();

	}

	public void setGameTimeType(int initialGameTime) {

		if (initialGameTime <= 1) {
			gameTimeType = GameTimeType.BULLET;
		} else if (initialGameTime < 15) {
			gameTimeType = GameTimeType.BLITZ;
		} else if (initialGameTime < 60) {
			gameTimeType = GameTimeType.RAPID;
		} else {
			gameTimeType = GameTimeType.CLASSICAL;
		}
	}

	public String getGameId() {
		return gameId;
	}

	public Player getWhitePlayer() {
		return whitePlayer;
	}

	public Player getBlackPlayer() {
		return blackPlayer;
	}

	public int getTime() {
		return time;
	}

	public int getIncrement() {
		return increment;
	}

	public Set<Player> getObservers() {
		return observers;
	}

	public Map<Integer, Move> getAnnotatedMoves() {
		return annotatedMoves;
	}

	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public void setWhitePlayer(Player whitePlayer) {
		this.whitePlayer = whitePlayer;
	}

	public void setBlackPlayer(Player blackPlayer) {
		this.blackPlayer = blackPlayer;
	}

	public void setTime(int time) {
		this.time = time;
	}

	public void setIncrement(int increment) {
		this.increment = increment;
	}

	public void setObservers(Set<Player> observers) {
		this.observers = observers;
	}

	public void setAnnotatedMoves(Map<Integer, Move> annotatedMoves) {
		this.annotatedMoves = annotatedMoves;
	}

	public boolean isOngoing() {
		return ongoing;
	}

	public void setOngoing(boolean ongoing) {
		this.ongoing = ongoing;
	}

	public GameTimeType getGameTimeType() {
		return gameTimeType;
	}

	public void setGameTimeType(GameTimeType gameTimeType) {
		this.gameTimeType = gameTimeType;
	}
	
	

}
