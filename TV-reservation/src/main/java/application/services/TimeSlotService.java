package application.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import application.domain.Timeslot;
import application.domain.TimeSlotRepository;
import application.domain.Useraccount;
import application.domain.UserAccountRepository;

@RestController
@RequestMapping("/Reservation")
public class TimeSlotService {

	private final TimeSlotRepository timeSlotRepository;
	private final UserAccountRepository userAccountRepository;

	@Autowired
	TimeSlotService(TimeSlotRepository timeSlotRepository, UserAccountRepository userAccountRepository) {
		this.timeSlotRepository = timeSlotRepository;
		this.userAccountRepository = userAccountRepository;

	}

	@RequestMapping(method = RequestMethod.GET)
	private List<Timeslot> getCurrentTimeSlots() {

		return this.timeSlotRepository.findAll();

	}

	@RequestMapping(method = RequestMethod.PUT, value = "{slotId}/{userId}")
	private Timeslot reserveTimeSlot(@PathVariable Long slotId, @PathVariable Long userId,
			HttpServletResponse response) {
		Timeslot timeslot = timeSlotRepository.findById(slotId).orElseThrow(IllegalArgumentException::new);
		Useraccount userAccount = userAccountRepository.findById(userId).orElseThrow(IllegalArgumentException::new);

		userAccount.setAccountbalance(userAccount.getAccountbalance().subtract(timeslot.getPrice()));
		if (userAccount.getAccountbalance().compareTo(new BigDecimal(0)) < 0) {
			throw new InsufficientFundsException();
		}
		userAccountRepository.save(userAccount);
		timeslot.setUserAccount(userAccount);

		return timeSlotRepository.save(timeslot);

	}

	@RequestMapping(method = RequestMethod.GET, value = "uniqueDates")
	private List<String> getUniqueDates() {
		List<String> uniqueDates = new ArrayList<String>();
		Calendar calendar=Calendar.getInstance();
		String dateString;
		List<Timeslot> timeslots = timeSlotRepository.findAll();
		for (Iterator<Timeslot> iterator = timeslots.iterator(); iterator.hasNext();) {
			
			calendar.setTimeInMillis(iterator.next().getStartTime().getTime());

			
			int mMonth = calendar.get(Calendar.MONTH)+1;
			int mDay = calendar.get(Calendar.DAY_OF_MONTH);
			dateString = String.valueOf(mDay).concat(".").concat(String.valueOf(mMonth));
			if(!uniqueDates.contains(dateString)){
				uniqueDates.add(dateString);
			}

		}
		return uniqueDates;

	}

	@ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
	class InsufficientFundsException extends RuntimeException {

		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;

		public InsufficientFundsException() {
			super("The sum to be paid exceeds your account balance.");
		}
	}

}
