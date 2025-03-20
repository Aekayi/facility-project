import React, { useEffect, useRef, useState } from "react";

function BookedListForApprove({
  id,
  name,
  fromTime,
  toTime,
  note,
  book_date,
  facility_id,
  locations,
  book_by,
  participants,
  approved_by,
  status,
  left,
  bookings,
  facilityNames,
  bookedId,
  defaultHeight = 68,
}) {
  const itemRef = useRef(null);
  const [overflowing, setIsOverflowing] = useState(false);
  const [style, setStyle] = useState({
    top: 0,
    height: 0,
  });
  const [hovered, setHovered] = useState(false);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const normalizeTime = (time) => {
    const regex = /^(\d{1,2}):(\d{2})\s*([apAP][mM])$/;
    const match = time?.match(regex);
    if (!match) {
      console.error("Invalid time format:", time);
      return 0;
    }

    let [_, hour, minute, period] = match;
    hour = parseInt(hour, 10);
    minute = parseInt(minute, 10);

    if (period.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
    } else if (period.toLowerCase() === "am" && hour === 12) {
      hour = 0;
    }

    return hour * 60 + minute;
  };

  const getFormattedTime = (totalMinutes) => {
    let hours = Math.floor(totalMinutes / 60);
    let minutes = totalMinutes % 60;
    let period = hours >= 12 ? "PM" : "AM";

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const calculateAdjustedTime = (
    baseTime,
    adjustmentMinutes,
    isAdding = false
  ) => {
    let baseMinutes = normalizeTime(baseTime);
    let adjustedMinutes = isAdding
      ? baseMinutes + adjustmentMinutes
      : baseMinutes - adjustmentMinutes;
    return getFormattedTime(adjustedMinutes);
  };

  useEffect(() => {
    // if (itemRef.current) {
    //   // Check if the content is overflowing
    //   setIsOverflowing(
    //     itemRef.current.scrollWidth > itemRef.current.clientWidth
    //   );
    // }
    setTimeout(() => {
      const bookingTitle = document.getElementById(`booking-title-${id}`);
      //remove height of bookingTitle
      bookingTitle.style.height = "";
      const bookingContainer = document.getElementById(`booking-id-${id}`);
      const bookingTime = document.getElementById(`booking-time-${id}`);
      //get height of bookingContainer
      const bookingTitleHeight = bookingTitle?.clientHeight;
      const bookingContainerHeight = bookingContainer?.clientHeight;
      const bookingTimeHeight = bookingTime?.clientHeight;

      let availableTitleHeight = bookingContainerHeight - bookingTimeHeight;
      if (availableTitleHeight > bookingTitleHeight) {
        availableTitleHeight = bookingTitleHeight;
      }

      const newHeight = availableTitleHeight - (availableTitleHeight % 16);
      bookingTitle.style.height = `${newHeight}px`;
      console.log(
        bookingTitleHeight,
        bookingContainerHeight,
        bookingTimeHeight,
        availableTitleHeight,
        newHeight,
        id,
        "bookingTitleHeight"
      );
    }, 500);
  }, [name, fromTime, toTime, book_by]);

  useEffect(() => {
    const startTimeMinutes = normalizeTime(fromTime);
    const endTimeMinutes = normalizeTime(toTime);

    const startPosition = (startTimeMinutes / 60) * defaultHeight;
    console.log(startPosition, "startPosition");
    const endPosition = (endTimeMinutes / 60) * defaultHeight;
    console.log(endPosition, "endPosition");
    const height = Math.max(
      ((endTimeMinutes - startTimeMinutes) / 60) * defaultHeight,
      0
    );

    let departureDuration = 0;
    const departureTimes = locations
      ?.map((d) => d?.departure_time_format)
      .filter(Boolean);
    console.log(departureTimes, "departureTime");

    const departureTime = departureTimes[0]; // Get first valid departure time
    if (departureTime?.includes("min") && !departureTime?.includes("hr")) {
      // Only minutes present
      const match = departureTime?.match(/(\d+)\s*min/);
      if (match) {
        departureDuration = parseInt(match[1], 10); // Set minutes directly
      }
    } else if (
      departureTime?.includes("hr") &&
      !departureTime?.includes("min")
    ) {
      // Only hours present
      const match = departureTime?.match(/(\d+)\s*hr/);
      if (match) {
        departureDuration = parseInt(match[1], 10) * 60; // Convert hours to minutes
      }
    } else {
      // Both hours and minutes present
      const match = departureTime?.match(/(\d+)\s*hr\s*(\d+)\s*min/);
      if (match) {
        const hours = parseInt(match[1], 10) * 60;
        const minutes = parseInt(match[2], 10);
        departureDuration = hours + minutes;
      }
    }

    console.log(departureDuration, "departureDuration");

    const departureTop =
      startPosition - (departureDuration / 60) * defaultHeight;
    console.log(departureTop, "departureTop");

    let arrivalDuration = 0;

    const arrivalTimes = locations
      ?.map((d) => d?.return_time_format)
      .filter(Boolean);

    if (arrivalTimes?.length > 0) {
      const arrivalTime = arrivalTimes[0]; // Get the first valid return time

      if (arrivalTime?.includes("min") && !arrivalTime?.includes("hr")) {
        // Only minutes present
        const match = arrivalTime?.match(/(\d+)\s*min/);
        if (match) {
          arrivalDuration = parseInt(match[1], 10);
        }
      } else if (arrivalTime?.includes("hr") && !arrivalTime?.includes("min")) {
        // Only hours present
        const match = arrivalTime?.match(/(\d+)\s*hr/);
        if (match) {
          arrivalDuration = parseInt(match[1], 10) * 60;
        }
      } else {
        // Both hours and minutes present
        const match = arrivalTime?.match(/(\d+)\s*hr\s*(\d+)\s*min/);
        if (match) {
          const hours = parseInt(match[1], 10) * 60;
          const minutes = parseInt(match[2], 10);
          arrivalDuration = hours + minutes;
        }
      }
    }

    console.log(arrivalDuration, "arrivalDuration");

    const arrivalTop = endPosition;
    const arrivalHeight = (arrivalDuration / 60) * defaultHeight;

    // Calculate Departure Time
    const departureTimeDisplay = calculateAdjustedTime(
      fromTime,
      departureDuration,
      false
    );
    console.log(departureTimeDisplay, "Calculated Departure Time");

    // Calculate Arrival Time
    const arrivalTimeDisplay = calculateAdjustedTime(
      toTime,
      arrivalDuration,
      true
    );
    console.log(arrivalTimeDisplay, "Calculated Arrival Time");

    const overlappingBookings =
      bookings?.filter((booking) => {
        const startA = normalizeTime(booking.start_time);
        const endA = normalizeTime(booking.end_time);
        const startB = departureTimeDisplay;
        const endB = arrivalTimeDisplay;
        return (
          booking.book_date === book_date &&
          !(
            (endA <= startB || startA >= endB) // Arrival & Departure overlap check
          )
        );
      }) || [];

    console.log(overlappingBookings, id, "overlappingBookings");

    // Find index of the current booking in the overlapping list
    const bookingIndex = overlappingBookings.findIndex(
      (booking) => booking.id === id
    );
    console.log(bookingIndex, "index");

    // Adjust width percentage based on number of overlapping bookings
    const widthPercentage = overlappingBookings.length > 1 ? 80 : 100;

    // Calculate left offset for overlapping bookings
    const leftOffset =
      bookingIndex !== -1
        ? (bookingIndex * 50) / Math.max(1, overlappingBookings.length - 1)
        : 0;

    console.log(leftOffset, "leftOffset");

    setStyle({
      top: startPosition + 24,
      height,
      departureTop,
      arrivalTop,
      arrivalHeight,
      width: `${80}%`,
      // width: `${sortedBookings.length > 1 ? 80 : 100}%`,
      left: `${leftOffset}%`,
      position: "absolute",
      zIndex: hovered ? 5 : 1,
      boxShadow: hovered
        ? "0 4px 6px rgba(0, 0, 0, 0.5)"
        : "0 2px 4px rgba(0, 0, 0, 0.2)",
      transition: " 0.1s linear",
    });

    setDepartureTime(
      departureTimeDisplay
        ?.replace("PM", "pm")
        .replace("AM", "am")
        .replace(/^0/, "") || ""
    );
    setArrivalTime(
      arrivalTimeDisplay
        ?.replace("PM", "pm")
        .replace("AM", "am")
        .replace(/^0/, "") || ""
    );
  }, [fromTime, toTime, bookings]);

  return (
    <div>
      <div>
        {locations?.some(
          (d) => d?.departure_transport === 1 && d?.departure_time_format !== ""
        ) &&
          status === "booked" && (
            <div
              className="absolute  text-xs text-gray-700 bg-white bg-opacity-90 px-1 border border-b-0 border-dashed border-gray-400 rounded-[15px] rounded-b-none w-full shadow-md"
              style={{
                top: style.departureTop + 24,
                height: style.top - style.departureTop,
                borderLeft: "2px dashed gray",
                borderRight: "2px dashed gray",
                borderTop: "2px dashed gray",
                width: style.width,
                left: style.left,
                zIndex: style.zIndex,
                boxShadow: style.boxShadow,
                transition: style.transition,
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <p
                style={{
                  position: "absolute",
                  top: "5%",
                  left: "5px",
                  // transform: "translateY(-50%)",
                }}
              >
                {`Departure: ${departureTime}`}
              </p>
            </div>
          )}
      </div>
      <div
        id={`booking-id-${id}`}
        ref={itemRef}
        className={`px-2
         rounded-md cursor-pointer ${
           status === "booked" ? " bg-[#B6D26F]" : "bg-[#E3EEC7]"
         } }`}
        style={{
          ...style,
          position: "absolute",
          overflow: "hidden",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title={overflowing ? `${name} - ${fromTime} to ${toTime}` : ""}
      >
        <div className="text-left ">
          <span
            id={`booking-title-${id}`}
            className="font-medium text-xs block overflow-hidden"
          >
            {name}
          </span>
          <div id={`booking-time-${id}`} className="text-[12px] text-gray-700 ">
            {fromTime} to {toTime}
          </div>
        </div>
      </div>
      <div>
        {locations?.some(
          (d) => d?.return_transport === 1 && d?.return_time_format !== ""
        ) &&
          status === "booked" && (
            <div
              className="absolute text-xs text-gray-700 bg-white bg-opacity-90  py-1 border border-dashed border-t-0 border-gray-400 rounded-[15px] rounded-t-none w-full "
              style={{
                top: style.arrivalTop + 24,
                height: style.arrivalHeight,
                borderLeft: "2px dashed gray",
                borderRight: "2px dashed gray",
                borderBottom: "2px dashed gray",
                width: style.width,
                left: style.left,
                zIndex: style.zIndex,
                boxShadow: style.boxShadow,
                transition: style.transition,
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <p
                style={{
                  position: "absolute",
                  bottom: "5%",
                  transform: "translateY(-50%)",
                  left: "5px",
                }}
              >
                {`Arrival: ${arrivalTime}`}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

export default BookedListForApprove;
