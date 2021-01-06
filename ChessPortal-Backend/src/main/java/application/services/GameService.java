package application.services;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import application.domain.Game;
import application.domain.GameRDTO;
import application.domain.GameRepository;
import application.domain.Player;
import application.domain.PlayerRepository;

@RestController
@RequestMapping("/games")
public class GameService {

	@Autowired
	GameRepository gameRepository;

	@Autowired
	PlayerRepository playerRepository;

	@RequestMapping(method = RequestMethod.GET, value = "{username}")
	public GameRDTO getGamesByUsername(@PathVariable String username) {
		
		Player player = playerRepository.findByUsername(username);
		if (player == null) {
			return null;
		} else {
			List<Game> games = gameRepository.findByWhitePlayerOrBlackPlayer(player, player)
					.stream()
					.sorted(Comparator.comparing(Game::getGameTimestamp).reversed())
					.collect(Collectors.toList());
			return new GameRDTO(games, username);
		}
	}

}
