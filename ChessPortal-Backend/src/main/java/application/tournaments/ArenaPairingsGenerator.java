package application.tournaments;

import application.domain.Pairing;
import application.domain.Player;
import application.domain.Tournament;

import java.util.Collections;
import java.util.List;

public class ArenaPairingsGenerator implements PairingsGenerator{

    @Override
    public List<Pairing> generatePairings(Tournament tournament, int round) {
        if(round==1){
           return PairingHelper.generatePairingsForRoundOne(tournament.getPlayers());
        } else{
            return generatePairingsAfterRound1();
        }
    }

    public List<Pairing> generatePairingsAfterRound1(){
        return Collections.emptyList();
    }
}
