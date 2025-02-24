import { useFacilitynamesQuery } from "../../apps/features/apiSlice";

export default function BookingManagement({
  bookedList,
  onBookingSelect,
  changeDate,
  current_date,
  current_time,
}) {
  console.log(bookedList, "bookedList");
  const {
    data: facilityNames,
    isError,
    isLoading,
  } = useFacilitynamesQuery("Fleet");
  console.log(facilityNames, "facccccc");

  const parseTime = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  };

  const calculateTopPosition = (startTime) => {
    const { hours, minutes } = parseTime(startTime);
    return (hours * 60 + minutes) / 15; // Each 15-min interval = 1 unit
  };

  const calculateHeight = (startTime, endTime) => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const duration =
      end.hours * 60 + end.minutes - (start.hours * 60 + start.minutes);
    return duration / 15; // Each 15-min interval = 1 unit
  };

  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const period = hour < 12 ? "AM" : "PM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMin = min === 0 ? "00" : min;

      // Add both hour and minute as properties
      timeSlots.push({
        time: `${displayHour}:${displayMin} ${period}`,
        hour: hour, // Store the full hour for calculations
        minutes: min, // Store minutes
      });
    }
  }

  const getBooking = (hour, minutes, fleetName) => {
    return bookedList?.find((booking) => {
      if (booking?.facility_id?.name !== fleetName) return false;

      // Convert start & end times from API to usable values
      const { hours: startHour, minutes: startMin } = parseTime(
        booking.start_time
      );
      console.log({ hours: startHour, minutes: startMin }, "dddd");
      const { hours: endHour, minutes: endMin } = parseTime(booking.end_time);
      console.log({ hours: endHour, minutes: endMin }, "ffff");

      const startTotalMins = startHour * 60 + startMin;
      console.log(startTotalMins, "startttt");
      const endTotalMins = endHour * 60 + endMin;
      const slotTotalMins = hour * 60 + minutes; // Now using hour and minutes directly
      console.log(slotTotalMins, "slotttt");

      // Check if time slot falls within the booking's time range
      return slotTotalMins >= startTotalMins && slotTotalMins < endTotalMins;
    });
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="table-fixed w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border border-gray-300 w-12"></th>
            {facilityNames?.data?.map((fleet, index) => (
              <th key={index} className="border border-gray-300 w-[1/3] ">
                {fleet?.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots
            .filter((slot) => slot.minutes === 0)
            .map((slot, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {/* Time Column */}
                <td className="border border-gray-300 h-16 ">{slot.time}</td>
                {/* Fleet Columns */}
                {facilityNames?.data?.map((fleet, fleetIndex) => {
                  const booking = getBooking(
                    slot.hour,
                    slot.minutes,
                    fleet?.name
                  );

                  return (
                    <td
                      key={fleetIndex}
                      className="border border-gray-300 text-center"
                    >
                      {booking ? (
                        <div className="p-2 bg-blue-500 text-white rounded-lg cursor-pointer">
                          {booking.title}
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
