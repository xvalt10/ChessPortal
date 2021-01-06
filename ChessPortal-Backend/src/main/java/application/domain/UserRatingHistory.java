package application.domain;

import java.time.OffsetDateTime;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import application.util.TimeControl;

@Entity
public class UserRatingHistory {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long ratingHistoryId;
	
	@Enumerated(EnumType.STRING)
	private TimeControl ratingType;
	
	@OneToOne
	@JoinColumn(name="user_id")	
	//@JsonBackReference
	private Player player;
	
	private int userRating;
	
	private OffsetDateTime ratingTimestamp;

	public Long getRatingHistoryId() {
		return ratingHistoryId;
	}

	public void setRatingHistoryId(Long ratingHistoryId) {
		this.ratingHistoryId = ratingHistoryId;
	}

	public TimeControl getRatingType() {
		return ratingType;
	}

	public void setRatingType(TimeControl ratingType) {
		this.ratingType = ratingType;
	}

	public Player getPlayer() {
		return player;
	}

	public void setPlayer(Player player) {
		this.player = player;
	}

	public int getUserRating() {
		return userRating;
	}

	public void setUserRating(int userRating) {
		this.userRating = userRating;
	}

	public OffsetDateTime getRatingTimestamp() {
		return ratingTimestamp;
	}

	public void setRatingTimestamp(OffsetDateTime ratingTimestamp) {
		this.ratingTimestamp = ratingTimestamp;
	}
	
	

}
