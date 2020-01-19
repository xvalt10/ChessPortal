package application.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.web.socket.WebSocketSession;

import java.io.Serializable;

@JsonIgnoreProperties(value = { "session" })
public class Player implements Serializable {

	private String username;
	private boolean isPlaying;
	private boolean isSeeking;
	private int time;
	private int increment;
	private int minRatingForSeek;
	private int maxRatingForSeek;
	private transient WebSocketSession session;
	private int elo;

	public boolean isSeeking() {
		return isSeeking;
	}
	public void setSeeking(boolean isSeeking) {
		this.isSeeking = isSeeking;
	}
	public int getElo() {
		return elo;
	}
	public void setElo(int elo) {
		this.elo = elo;
	}
	public boolean isPlaying() {
		return isPlaying;
	}
	public void setPlaying(boolean isPlaying) {
		System.out.println("Setting playing status of user to: " +isPlaying);
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

	@Override
	public String toString(){
		return "isPlaying".concat(String.valueOf(isPlaying)).concat("Increment:").concat(String.valueOf(increment)).concat("Time:").concat(String.valueOf(time));
	}
	
	

}
