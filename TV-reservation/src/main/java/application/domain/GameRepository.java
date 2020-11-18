package application.domain;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

public interface GameRepository extends CrudRepository<Game, String> {
	
	List<Game> findByWhitePlayerOrBlackPlayer(Player whitePlayer, Player blackPlayer);

}
