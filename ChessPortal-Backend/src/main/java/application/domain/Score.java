package application.domain;

public class Score {
	
	String username;
	float points;
	float buchholz;
	float sonnebornBerger;
	
	public Score(String username) {
		this.username = username;
		// TODO Auto-generated constructor stub
	}
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public float getPoints() {
		return points;
	}
	public void setPoints(float points) {
		this.points = points;
	}
	public float getBuchholz() {
		return buchholz;
	}
	public void setBuchholz(float buchholz) {
		this.buchholz = buchholz;
	}
	public float getSonnebornBerger() {
		return sonnebornBerger;
	}
	public void setSonnebornBerger(float sonnebornBerger) {
		this.sonnebornBerger = sonnebornBerger;
	}

	
}
