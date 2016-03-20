angular.module('reservationFilters', []).filter('timeSlotFilter', function() {
	function filterSlots(timeslots, selectedDate) {

		if (typeof timeslots == 'undefined') {
			console.log("timeslots undefined");
			return;
		}
		console.log(timeslots);
		var filteredtimeslots = [];

		for (var i = 0; i <= timeslots.length - 1; i++) {

			var startDate = new Date(timeslots[i].startTime);
			var dayOfMonth = startDate.getDate();
			var month = startDate.getMonth() + 1;
			var dateString = dayOfMonth + '.' + month;

			if (dateString == selectedDate) {
				filteredtimeslots.push(timeslots[i]);
			}
		}
		
		return filteredtimeslots;

	}
	;
	filterSlots.$stateful = true;
	return filterSlots;
});