package application.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import application.util.FloatStatus;
import application.util.GameColor;

import org.springframework.web.socket.WebSocketSession;

import static application.util.GameColor.BLACK;
import static application.util.GameColor.WHITE;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@JsonIgnoreProperties(value = { "session" })
@Entity
@Table(name = "UserAccount")
public class Player implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = 1742921267584361991L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long userId;

	private String username;
	@JsonIgnore
	private String password;
	private int eloblitz;
	private int elobullet;
	private int eloclassical;
	private int elorapid;
	private String email;
	private String countrycode;

	@Transient
	private String gameId;
	@Transient
	private boolean isPlaying;
	@Transient
	private boolean isSeeking;
	@Transient
	private int time;
	@Transient
	private int increment;
	@Transient
	private int minRatingForSeek;
	@Transient
	private int maxRatingForSeek;
	@Transient
	private GameColor lastGameColor;
	@Transient
	private transient WebSocketSession session;
	@Transient
	private int colorBalance;
	@Transient
	private String colorSequence = "";
	@Transient
	private List<Player> previousOponents = new ArrayList<>();
	@Transient
	private boolean alreadyPaired;
	@Transient
	private int byeInRound = 0;
	@Transient
	private Score score;
	@Transient
	private FloatStatus floatStatus;

	public FloatStatus getFloatStatus() {
		return floatStatus;
	}

	public void setFloatStatus(FloatStatus floatStatus) {
		if (floatStatus != FloatStatus.NONE) {
			this.floatStatus = floatStatus;
		} else {
			int playerfloatStatusAsInt = floatStatus.getStatus();
			if (playerfloatStatusAsInt < 0) {
				playerfloatStatusAsInt += 1;
			} else if (playerfloatStatusAsInt > 0) {
				playerfloatStatusAsInt -= 1;
			}

			FloatStatus[] floatStatusArray = FloatStatus.values();
			for (int i = 0; i < floatStatusArray.length; i++) {
				if (floatStatusArray[i].getStatus() == playerfloatStatusAsInt) {
					this.floatStatus = floatStatusArray[i];
					break;
				}
			}
		}

	}

	public boolean isSeeking() {
		return isSeeking;
	}

	public void setSeeking(boolean isSeeking) {
		this.isSeeking = isSeeking;
	}

	public int getEloblitz() {
		return eloblitz;
	}

	public void setEloblitz(int elo) {
		this.eloblitz = elo;
	}

	public int getElobullet() {
		return elobullet;
	}

	public void setElobullet(int elobullet) {
		this.elobullet = elobullet;
	}

	public int getEloclassical() {
		return eloclassical;
	}

	public void setEloclassical(int eloclassical) {
		this.eloclassical = eloclassical;
	}

	public int getElorapid() {
		return elorapid;
	}

	public void setElorapid(int elorapid) {
		this.elorapid = elorapid;
	}

	public boolean isPlaying() {
		return isPlaying;
	}

	public void setPlaying(boolean isPlaying) {
		System.out.println("Setting playing status of user to: " + isPlaying);
		this.isPlaying = isPlaying;
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

	public int getMinRatingForSeek() {
		return minRatingForSeek;
	}

	public void setMinRatingForSeek(int minRatingForSeek) {
		this.minRatingForSeek = minRatingForSeek;
	}

	public int getMaxRatingForSeek() {
		return maxRatingForSeek;
	}

	public void setMaxRatingForSeek(int maxRatingForSeek) {
		this.maxRatingForSeek = maxRatingForSeek;
	}

	public WebSocketSession getSession() {
		return session;
	}

	public void setSession(WebSocketSession session) {
		this.session = session;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getGameId() {
		return gameId;
	}

	public void setGameId(String gameId) {
		this.gameId = gameId;
	}

	public Score getScore() {
		return score;
	}

	public float getPoints() {
		if (this.score == null) {
			return 0;
		} else {
			return this.score.getPoints();
		}
	}

	public void setScore(Score score) {
		this.score = score;
	}

	public GameColor getLastGameColor() {
		return lastGameColor;
	}

	public void setLastGameColor(GameColor lastGameColor) {
		this.lastGameColor = lastGameColor;
	}

	public boolean isAlreadyPaired() {
		return alreadyPaired;
	}

	public void setAlreadyPaired(boolean alreadyPaired) {
		this.alreadyPaired = alreadyPaired;
	}

	public int getColorBalance() {
		return colorBalance;
	}

	public void setColorBalance(int colorBalance) {
		this.colorBalance = colorBalance;
	}

	public String getColorSequence() {
		return colorSequence;
	}

	public void setColorSequence(String colorSequence) {
		this.colorSequence = colorSequence;
	}

	public void addColorToColorSequence(String colorSequence) {
		if (this.colorSequence == null || this.colorSequence.isEmpty()) {
			this.colorSequence = colorSequence;
		} else {
			this.colorSequence = this.colorSequence + colorSequence;
			this.colorSequence = this.colorSequence.substring(this.colorSequence.length() - 2);
		}
	}

	public List<Player> getPreviousOponents() {
		return previousOponents;
	}

	public void setPreviousOponents(List<Player> previousOponents) {
		this.previousOponents = previousOponents;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCountrycode() {
		return countrycode;
	}

	public void setCountrycode(String countrycode) {
		this.countrycode = countrycode;
	}

	@Override
	public String toString() {

		return this.getUsername() + " PT: " + this.getPoints() + " CB: " + this.getColorBalance() + " CS: "
				+ this.getColorSequence();
	}

	public int getByeInRound() {
		return byeInRound;
	}

	public void setByeInRound(int byeInRound) {
		this.byeInRound = byeInRound;
	}

	public GameColor getExpectedColor() {
		GameColor playerColorInCurrentRound = null;
		if (colorBalance > 0) {
			playerColorInCurrentRound = BLACK;
		} else if (colorBalance < 0) {
			playerColorInCurrentRound = WHITE;
		} else if (colorSequence.endsWith(WHITE.getColorAbbreviation())) {
			playerColorInCurrentRound = BLACK;
		} else if (colorSequence.endsWith(BLACK.getColorAbbreviation())) {
			playerColorInCurrentRound = WHITE;
		}

//		else {
//			log.warn("Randomly picking color for player {}",player);
//			if (Math.random() >= 0.5) {
//				playerColorInCurrentRound = WHITE;
//			} else {
//				playerColorInCurrentRound = BLACK;
//			}
//		}

		return playerColorInCurrentRound;

	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((username == null) ? 0 : username.hashCode());
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
		Player other = (Player) obj;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

}
