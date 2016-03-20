package application.services;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;

import javax.ejb.Schedule;
import javax.ejb.Stateless;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import application.domain.Timeslot;
import application.domain.TimeSlotRepository;

@Component
@Transactional
public class ScheduledJobs {
	
	@Autowired
	TimeSlotRepository timeslotRepository;
	
	@Scheduled(cron="0 0/1 * * * *")
	public void deletePastTimeSlots(){
		if (timeslotRepository.findAll().size()==0){
			addNewTimeSlots();
		}
		System.out.println("Executing timer service:");
		timeslotRepository.deleteByStartTimeBefore(new Date());
		
		
	}

	//@Scheduled(cron="0 26 9 * * *")
	public void addNewTimeSlots(){
		System.out.println("Adding timeslots");
		
		Calendar currentDate = Calendar.getInstance();
		Calendar timeslotStartDate = Calendar.getInstance();
		Calendar timeslotEndDate = Calendar.getInstance();
		currentDate.setTime(new Date());
		
		int day=currentDate.get(Calendar.DAY_OF_MONTH);
		int month=currentDate.get(Calendar.MONTH);
		int year = currentDate.get(Calendar.YEAR);
		
		timeslotStartDate.set(Calendar.DAY_OF_MONTH, day);
		timeslotStartDate.set(Calendar.MONTH, month);
		timeslotStartDate.set(Calendar.YEAR, year);
		
		timeslotEndDate.set(Calendar.DAY_OF_MONTH, day);
		timeslotEndDate.set(Calendar.MONTH, month);
		timeslotEndDate.set(Calendar.YEAR, year);
		
		for(int hour =6; hour<=22; hour++){	
			for (int court = 1;court<=4;court++){
				Timeslot slot = new Timeslot();
				timeslotStartDate.set(Calendar.HOUR_OF_DAY, hour);
				timeslotStartDate.set(Calendar.MINUTE, 0);
				
				timeslotEndDate.set(Calendar.HOUR_OF_DAY, hour);
				timeslotEndDate.set(Calendar.MINUTE, 30);
				
				slot.setCourtnumber(court);
				slot.setStartTime(new Timestamp(timeslotStartDate.getTimeInMillis()));
				slot.setEndTime(new Timestamp(timeslotEndDate.getTimeInMillis()));
				slot.setPrice(hour <=15?new BigDecimal(12):new BigDecimal(17));
				
				timeslotRepository.save(slot);
				
				Timeslot slot2 = new Timeslot();
				timeslotStartDate.set(Calendar.HOUR_OF_DAY, hour);
				timeslotStartDate.set(Calendar.MINUTE, 30);
				
				timeslotEndDate.set(Calendar.HOUR_OF_DAY, hour+1);
				timeslotEndDate.set(Calendar.MINUTE, 0);
				
				slot2.setCourtnumber(court);
				slot2.setStartTime(new Timestamp(timeslotStartDate.getTimeInMillis()));
				slot2.setEndTime(new Timestamp(timeslotEndDate.getTimeInMillis()));
				slot2.setPrice(hour <=15?new BigDecimal(12):new BigDecimal(17));
				
				timeslotRepository.save(slot2);
			}
		}
	
		
	}
}
