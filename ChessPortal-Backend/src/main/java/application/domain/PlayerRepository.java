package application.domain;

import org.springframework.data.repository.CrudRepository;

public interface PlayerRepository extends CrudRepository<Player, Long> {
	
	Player findByUsername(String username);

}
