package application.domain;

import static application.util.GameUtil.getPlayerEloBasedOnGameTime;

import java.io.Serializable;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.*;

import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonBackReference;

import application.util.TimeControl;
import application.util.GameUtil;
import application.util.JpaJsonConverter;

@Entity
@Table(name = "game")
public class Game implements Serializable {

	private static final long serialVersionUID = 1559402074585394052L;
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String gameId;

	@OneToOne
	@JoinColumn(name = "whitePlayer")
	// @JsonBackReference
	private Player whitePlayer;

	@OneToOne
	@JoinColumn(name = "blackPlayer")
	// @JsonBackReference
	private Player blackPlayer;

	private int time;
	private int increment;
	private String gameresult;
	private OffsetDateTime gameTimestamp;
	private String movesJson;

	@Transient
	private boolean ongoing = true;

	@Transient
	private Set<Player> observers = new HashSet<>();

	@Transient
	private TimeControl timeControl;

	@Transient
	// @Convert(converter = JpaJsonConverter.class)
	private Map<Integer, Move> annotatedMoves = new HashMap<>();

	public Game() {

	}

	public Game(Player whitePlayer, Player blackPlayer, int timeInMillis, int increment) {

		this.whitePlayer = whitePlayer;
		this.blackPlayer = blackPlayer;
		this.time = timeInMillis;
		whitePlayer.setTime(this.time);
		blackPlayer.setTime(this.time);
		setGameTimeType(this.time);
		this.increment = increment;
		this.gameTimestamp = OffsetDateTime.now();

	}

	public void setGameTimeType(int timeInMillis) {

		long gameTimeInMinutes = Duration.ofMillis(timeInMillis).toMinutes();
		if (gameTimeInMinutes <= 1) {
			timeControl = TimeControl.BULLET;
		} else if (gameTimeInMinutes < 15) {
			timeControl = TimeControl.BLITZ;
		} else if (gameTimeInMinutes < 60) {
			timeControl = TimeControl.RAPID;
		} else {
			timeControl = TimeControl.CLASSICAL;
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
		setGameTimeType(time);
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

	public int getMaxPlayerRating() {
		if (timeControl == null) {
			setGameTimeType(this.time);
		}
		return Math.max(getPlayerEloBasedOnGameTime(whitePlayer, timeControl),
				getPlayerEloBasedOnGameTime(blackPlayer, timeControl));
	}

	public void setOngoing(boolean ongoing) {
		this.ongoing = ongoing;
	}

	public TimeControl getGameTimeType() {
		return timeControl;
	}

	public void setGameTimeType(TimeControl gameTimeType) {
		this.timeControl = gameTimeType;
	}

	public String getGameresult() {
		return gameresult;
	}

	public void setGameresult(String gameResult) {
		this.gameresult = gameResult;
	}

	public String getMovesJson() {
		return movesJson;
	}

	public void setMovesJson(String movesJson) {
		this.movesJson = movesJson;
	}

	public OffsetDateTime getGameTimestamp() {
		return gameTimestamp;
	}

	public void setGameTimestamp(OffsetDateTime gameTimestamp) {
		this.gameTimestamp = gameTimestamp;
	}

}
