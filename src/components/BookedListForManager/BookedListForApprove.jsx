import React, { useEffect, useState } from "react";

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
  defaultHeight = 65,
}) {
  console.log(bookings, "bookings");

  const [style, setStyle] = useState({
    top: 0,
    height: 0,
  });
  const [hovered, setHovered] = useState(false);

  const normalizeTime = (time) => {
    const regex = /^(\d{1,2}):(\d{2})\s*([apAP][mM])$/;
    const match = time.match(regex);
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
  useEffect(() => {
    const startTimeMinutes = normalizeTime(fromTime);
    const endTimeMinutes = normalizeTime(toTime);

    const startPosition = (startTimeMinutes / 60) * defaultHeight;
    const height = Math.max(
      ((endTimeMinutes - startTimeMinutes) / 60) * defaultHeight,
      0
    );

    let departureDuration = 0;
    const departureTimes = locations
      ?.map((d) => d?.departure_time_format)
      .filter(Boolean);

    if (departureTimes?.length > 0) {
      const match = departureTimes[0].match(/(\d+)\s*hr\s*(\d*)/);
      if (match) {
        departureDuration =
          parseInt(match[1], 10) * 60 + (parseInt(match[2], 10) || 0);
      }
    }

    const departureTop =
      startPosition - (departureDuration / 60) * defaultHeight;
    console.log(departureTop, "departureTop");

    let arrivalDuration = 0;
    const arrivalTimes = locations
      ?.map((d) => d?.return_time_format)
      .filter(Boolean);

    if (arrivalTimes?.length > 0) {
      const match = arrivalTimes[0].match(/(\d+)\s*hr\s*(\d*)/);
      if (match) {
        arrivalDuration =
          parseInt(match[1], 10) * 60 + (parseInt(match[2], 10) || 0);
      }
    }
    const startPositionForArrival = (endTimeMinutes / 60) * defaultHeight;
    const arrivalTop =
      startPositionForArrival -
      (arrivalDuration / 60) * defaultHeight +
      (arrivalDuration / 60) * defaultHeight;

    const overlappingBookings =
      bookings?.filter((booking) => {
        const startA = normalizeTime(booking.start_time);
        const endA = normalizeTime(booking.end_time);
        const startB = normalizeTime(fromTime);
        const endB = normalizeTime(toTime);

        return (
          booking.book_date === book_date && !(endA <= startB || startA >= endB)
        );
      }) || [];
    console.log(overlappingBookings, id, "overlappingBookings");

    const bookingIndex = overlappingBookings.findIndex(
      (booking) => booking.id === id
    );
    console.log(bookingIndex, "index");

    const widthPercentage = overlappingBookings.length > 1 ? 80 : 100;

    const leftOffset =
      bookingIndex != 0
        ? (bookingIndex * 50) / (overlappingBookings.length - 1)
        : 0;
    console.log(leftOffset, "leftOffset");

    setStyle({
      top: startPosition + 24,
      height,
      departureTop,
      arrivalTop,
      width: `${widthPercentage}%`,
      left: `${leftOffset}%`,
      position: "absolute",
      zIndex: hovered ? 50 : 1,
      boxShadow: hovered ? "0 4px 6px rgba(0, 0, 0, 0.5)" : "none",
      transition: "z-index 0.1s linear",
    });
  }, [fromTime, toTime, bookings]);
  console.log(
    Math.abs(style.top - style.arrivalTop),
    "style.top-style.arrivalTop"
  );
  console.log(style.top - style.departureTop, "styleeeee");

  return (
    <div>
      {/* Booking details */}
      <div>
        {locations?.some((d) => d?.departure_transport === 1) &&
          status === "booked" && (
            <div
              className="absolute  text-xs text-gray-700 bg-white bg-opacity-90 px-1 border border-b-0 border-dashed border-gray-400 rounded-[15px] rounded-b-none w-full"
              style={{
                top: style.departureTop + 24,
                height: style.top - style.departureTop,
                borderLeft: "2px dashed gray", // Vertical line
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
              {`Departure: ${locations
                ?.map((d) => d?.departure_time_format)
                .filter(Boolean)
                .join(", ")}`}
            </div>
          )}
      </div>
      <div
        className={`px-2
         rounded-md shadow-md cursor-pointer ${
           status === "booked" ? " bg-[#B6D26F]" : "bg-[#E3EEC7]"
         } }`}
        style={{ ...style, position: "absolute" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div>
          <span className="font-sm">{name || "Booking"}</span>
          <div className="text-xs text-gray-700">
            {fromTime} - {toTime}
          </div>
        </div>
      </div>
      <div>
        {locations?.some((d) => d?.return_transport === 1) &&
          status === "booked" && (
            <div
              className="absolute text-xs text-gray-700 bg-white bg-opacity-90  py-1 border border-dashed border-t-0 border-gray-400 rounded-[15px] rounded-t-none w-full "
              style={{
                top: style.arrivalTop + 24,
                height: style.top - style.departureTop - 24,
                borderLeft: "2px dashed gray",
                borderRight: "2px dashed gray",
                borderBottom: "2px dashed gray",
                width: style.width,
                left: style.left,
                zIndex: style.zIndex,
                boxShadow: style.boxShadow,
                transition: style.transition,
              }}
            >
              <p
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {`Arrival: ${locations
                  ?.map((d) => d?.return_time_format)
                  .filter(Boolean)
                  .join(", ")}`}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}

export default BookedListForApprove;
