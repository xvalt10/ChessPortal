package application.util;

public enum GameColor {	
	
	WHITE("w"),BLACK("b"),BYE("bye");
	
	private String colorAbbreviation;
	
	GameColor(String colorAbbreviation) {
		this.colorAbbreviation = colorAbbreviation;
	}

	public String getColorAbbreviation() {
		return colorAbbreviation;
	}

	
}
