package application.tournaments;

import application.domain.Pairing;
import application.domain.Player;
import application.util.FloatStatus;
import application.util.GameColor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.stream.Collectors;

import static application.util.GameColor.BLACK;
import static application.util.GameColor.WHITE;

public class PairingHelper {

    private static final Logger log = LoggerFactory.getLogger(PairingHelper.class);

    public static List<Pairing> generatePairingsForRoundOne(List<Player> tournamentPlayers) {
        List<Pairing> pairings = new ArrayList<>();
        for (Player player : tournamentPlayers) {
            if (player.isAlreadyPaired()) {
                continue;
            }
            List<Player> candidateOpponents = tournamentPlayers.stream()
                    .filter(player2 -> !player.getUsername().equals(player2.getUsername()))
                    .filter(player2 -> !player2.isAlreadyPaired()).collect(Collectors.toList());

            Player opponent = candidateOpponents.get(candidateOpponents.size() - 1);
            GameColor playerColorInThisRound;

            if (Math.random() >= 0.5) {
                playerColorInThisRound = WHITE;
            } else {
                playerColorInThisRound = BLACK;
            }

            Pairing pairing = createPairing(1, player, opponent, playerColorInThisRound);
            pairings.add(pairing);
        }
        return pairings;
    }

    public static Pairing createPairing(int round, Player player, Player oponent, GameColor playerColor) {

        player.setAlreadyPaired(true);
        player.getPreviousOponents().add(oponent);

        oponent.setAlreadyPaired(true);
        oponent.getPreviousOponents().add(player);

        if (oponent.getPoints() > player.getPoints()) {
            player.setFloatStatus(FloatStatus.UP);
            oponent.setFloatStatus(FloatStatus.DOWN);
        } else if (oponent.getPoints() < player.getPoints()) {
            player.setFloatStatus(FloatStatus.DOWN);
            oponent.setFloatStatus(FloatStatus.UP);
        } else {
            player.setFloatStatus(FloatStatus.NONE);
            oponent.setFloatStatus(FloatStatus.NONE);
        }

        Pairing pairing = new Pairing();

        switch (playerColor) {
            case WHITE:
                pairing.setWhitePlayer(player);
                pairing.setBlackPlayer(oponent);

                player.addColorToColorSequence(WHITE.getColorAbbreviation());
                oponent.addColorToColorSequence(BLACK.getColorAbbreviation());

                player.setColorBalance(player.getColorBalance() + 1);
                oponent.setColorBalance(oponent.getColorBalance() - 1);
                break;
            case BLACK:
                pairing.setWhitePlayer(oponent);
                pairing.setBlackPlayer(player);

                oponent.addColorToColorSequence(WHITE.getColorAbbreviation());
                player.addColorToColorSequence(BLACK.getColorAbbreviation());

                oponent.setColorBalance(oponent.getColorBalance() + 1);
                player.setColorBalance(player.getColorBalance() - 1);
                break;
            case BYE:
                break;
        }

        pairing.setRound(round);
        log.info("Round {} - Pairing: {}", round, pairing);
        return pairing;
    }

    public static List<ScoreGroup> groupPlayersByTheirScores(List<Player> players) {
        List<ScoreGroup> scoregroups = new ArrayList<>();
        Map<Float, List<Player>> playersGroupedByPoints = players.stream()
                .collect(Collectors.groupingBy(tplayer -> tplayer.getPoints(), TreeMap::new, Collectors.toList()));
        scoregroups = playersGroupedByPoints.entrySet().stream()
                .map(entry -> new ScoreGroup(entry.getKey(), entry.getValue())).collect(Collectors.toList());
        Collections.reverse(scoregroups);
        return scoregroups;
    }
}
