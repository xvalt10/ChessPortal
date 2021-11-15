package application.tournaments;

import application.domain.*;
import application.sockets.UserSessionHandler;
import application.util.TournamentState;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import javax.json.JsonObject;
import javax.json.spi.JsonProvider;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
public class SimulHandler extends TournamentHandler {

    public SimulHandler(UserSessionHandler userSessionHandler, @Qualifier("tournamentScheduler")ThreadPoolTaskScheduler taskScheduler) {
        super(userSessionHandler, taskScheduler);
    }

    public void scheduleNewSimul(String simulName, int time, int increment, LocalDateTime utcStartTime, int maxNumberOfOponents, Player organizer) {

        Simul simul = new Simul(simulName, time, increment, utcStartTime, maxNumberOfOponents, organizer);
        super.tournaments.put(simul.getId(), simul);

        Date convertedDate = Date.from(utcStartTime.plusSeconds(OffsetDateTime.now().getOffset().getTotalSeconds())
                .atZone(ZoneId.systemDefault()).toInstant());

        super.tournamentScheduler.schedule(() -> startSimul(simul), convertedDate);

    }



    public void startSimulGames(Simul simul) {
        simul.setCurrentRound(1);
        Player playerWithBye = null;
        List<Pairing> pairings = new ArrayList<>();
        sendTournamentActionMessageToPlayer(simul.getId(), simul.getSimulOrganizer(), "simulStart");
        for (Player opponent: simul.getPlayers()) {
            Pairing pairing = new Pairing();
            pairing.setWhitePlayer(simul.getSimulOrganizer());
            pairing.setBlackPlayer(opponent);

            String gameId = userSessionHandler.startGame(pairing.getWhitePlayer(), pairing.getBlackPlayer(),
                        simul.getTime() * 60_000, simul.getIncrement() * 1000);
            simul.getGameIds().add(gameId);
            pairing.setGameId(gameId);
            pairings.add(pairing);
        }
        simul.getPairings().addAll(pairings);
    }

    public void startSimul(Simul simul) {
        int numberOfRounds = 1;
        Map<String, Score> scores = simul.getScores();
        List<String> playerNames = simul.getPlayers().stream().map(Player::getUsername)
                .collect(Collectors.toList());
        playerNames.forEach(playerName -> scores.put(playerName, new Score(playerName)));
        if (simul.getPlayers().size() > 0) {
            simul.setState(TournamentState.STARTED);
            startSimulGames(simul);
        } else {
            simul.setState(TournamentState.FINISHED);
        }
    }

    public Tournament getTournament(String tournamentId) {
        System.out.println("Calling simulhandler");
        return super.tournaments.get(tournamentId);
    }

}
