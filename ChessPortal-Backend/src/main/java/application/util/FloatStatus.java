package application.util;

public enum FloatStatus {

	DOWN(-2), DOWNPREV(-1), NONE(0), UPPREV(1), UP(2);

	int status;

	FloatStatus(int status) {
		this.status = status;
	}

	public int getStatus() {
		return status;
	}

}
