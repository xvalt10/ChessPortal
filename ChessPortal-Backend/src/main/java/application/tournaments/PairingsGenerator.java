package application.tournaments;

import java.util.List;

import application.domain.Pairing;
import application.domain.Tournament;

public interface PairingsGenerator {
	
	List<Pairing> generatePairings(Tournament tournament, int round);

}
