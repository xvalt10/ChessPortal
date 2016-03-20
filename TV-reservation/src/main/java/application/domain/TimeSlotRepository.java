package application.domain;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<Timeslot, Long>{
	void deleteByStartTimeBefore(Date date);
}
