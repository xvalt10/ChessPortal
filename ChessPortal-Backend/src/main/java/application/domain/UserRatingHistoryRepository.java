package application.domain;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import application.util.TimeControl;

public interface UserRatingHistoryRepository extends CrudRepository<UserRatingHistory, Long> {
	
	List<UserRatingHistory> findByPlayerAndRatingTypeAndRatingTimestampAfter(Player player, TimeControl gameTimeType, OffsetDateTime date);

}
