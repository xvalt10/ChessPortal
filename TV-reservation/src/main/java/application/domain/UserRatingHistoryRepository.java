package application.domain;

import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import application.util.GameTimeType;

public interface UserRatingHistoryRepository extends CrudRepository<UserRatingHistory, Long> {
	
	List<UserRatingHistory> findByPlayerAndRatingTypeAndRatingTimestampAfter(Player player, GameTimeType gameTimeType, OffsetDateTime date);

}
