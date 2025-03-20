import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  useUserbyIdQuery,
  useBookedListByDateQuery,
} from "../../apps/features/apiSlice";
import { MdCheckCircle } from "react-icons/md";

const Booked = ({
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
  timeId,
  setCreateData,
  defaultHeight = 56,
}) => {
  const itemRef = useRef(null);
  const [overflowing, setIsOverflowing] = useState(false);
  const [style, setStyle] = useState({ top: 0, height: 0 });
  const [hovered, setHovered] = useState(false);
  const [pastBooking, setPastBooking] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdminApproved, setIsAdminApproved] = useState(false);
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");

  const user = localStorage.getItem("persist:auth");
  const userData = JSON.parse(user);
  const {
    data: adminData,
    isLoading: adminIdLoading,
    isError: adminIdError,
  } = useUserbyIdQuery(userData?.id);

  const { data: bookedList } = useBookedListByDateQuery({
    facilityByRoomId: facility_id?.id,
    bookedListByDate: book_date,
  });

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

  const overlappingBookings =
    bookedList?.data?.filter((booking) => {
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

  const widthPercentage = overlappingBookings.length > 1 ? 50 : 100;

  const leftOffset =
    bookingIndex != 0
      ? (bookingIndex * 50) / (overlappingBookings.length - 1)
      : 0;
  console.log(leftOffset, "leftOffset");

  useEffect(() => {
    if (itemRef.current) {
      // Check if the content is overflowing
      setIsOverflowing(
        itemRef.current.scrollWidth > itemRef.current.clientWidth
      );
    }
  }, [name, fromTime, toTime, book_by]);

  useEffect(() => {
    if (book_by?.id == adminData?.data?.id) {
      setIsUser(true);
    }

    const adminId = adminData?.data?.id;
    if (approved_by?.some((approver) => approver.id === adminId)) {
      setIsAdminApproved(true);
    }

    const startTimeMinutes = normalizeTime(fromTime);
    console.log(startTimeMinutes, "startTimeMinutes");
    const endTimeMinutes = normalizeTime(toTime);

    const startPosition = (startTimeMinutes / 60) * defaultHeight;
    const endPosition = (endTimeMinutes / 60) * defaultHeight;
    console.log(startPosition, "startPosition");
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

    setStyle({
      top: startPosition,
      height,
      departureTop,
      arrivalTop,
      arrivalHeight,
      width: `${widthPercentage}%`,
      left: `${leftOffset}%`,
      position: "absolute",
      zIndex: hovered ? 5 : 1,
      transition: "z-index 0.2s linear",
    });
    setDepartureTime(departureTimeDisplay);
    setArrivalTime(arrivalTimeDisplay);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    setPastBooking(endTimeMinutes <= currentMinutes);
  }, [
    fromTime,
    toTime,
    locations,
    status,
    defaultHeight,
    book_by,
    approved_by,
    adminData,
    widthPercentage,
    leftOffset,
    hovered,
  ]);

  return (
    <>
      <div>
        {locations?.some(
          (d) => d?.departure_transport === 1 && d?.departure_time_format !== ""
        ) &&
          status === "booked" && (
            <div
              className="absolute  text-xs text-gray-700 bg-white bg-opacity-90 px-1 border border-b-0 border-dashed border-gray-400 rounded-[15px] rounded-b-none w-full shadow-md"
              style={{
                top: style.departureTop,
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
                  top: "50%",
                  left: "20px",
                  transform: "translateY(-50%)",
                }}
              >
                {`Departure: ${departureTime}`}
              </p>
            </div>
          )}
      </div>
      <div
        className={`booked-item px-3 rounded-[4px] shadow-md flex flex-col border border-[#05445E] bg-white cursor-pointer`}
        ref={itemRef}
        style={{
          ...style,
          position: "absolute",
          boxSizing: "border-box",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          backgroundColor:
            status === "pending"
              ? "#d4f1f4"
              : status === "approved"
              ? "#d4f1f4"
              : isUser
              ? "#05445E"
              : "#fff",
        }}
        title={
          overflowing
            ? `${name} - ${fromTime} to ${toTime} [${book_by.name}]`
            : ""
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex justify-between items-center">
          <h4
            className={`${
              isUser ? "text-[#d4f1f4] font-normal" : "text-[#05445E]"
            } ${status === "pending" ? "text-black" : ""}`}
          >
            {name}
          </h4>
          {pastBooking && (
            <MdCheckCircle
              className={`w-4 h-4 ${
                isUser ? "text-[#d4f1f4]" : "text-[#05445E]"
              }`}
              title="completed"
            />
          )}
        </div>
        <p
          className={`text-[12px] ${
            isUser ? "text-[#d4f1f4]" : "text-[#05445E]"
          }  ${status === "pending" ? "text-black" : ""}`}
        >
          {fromTime} - {toTime} [{book_by.name}]
        </p>
      </div>
      <div>
        {locations?.some(
          (d) => d?.return_transport === 1 && d?.return_time_format !== ""
        ) &&
          status === "booked" && (
            <div
              className="absolute text-xs text-gray-700 bg-white bg-opacity-90  py-1 border border-dashed border-t-0 border-gray-400 rounded-[15px] rounded-t-none w-full"
              style={{
                top: style.arrivalTop,
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
                  bottom: "50%",
                  transform: "translateY(50%)",
                  left: "20px",
                }}
              >
                {/* {`Arrival: ${locations
                  ?.map((d) => d?.return_time_format)
                  .filter(Boolean)
                  .join(", ")}`} */}
                {`Arrival: ${arrivalTime}`}
              </p>
            </div>
          )}
      </div>
    </>
  );
};

Booked.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  fromTime: PropTypes.string.isRequired,
  toTime: PropTypes.string.isRequired,
  note: PropTypes.string,
  book_date: PropTypes.string.isRequired,
  facility_id: PropTypes.object.isRequired,
  locations: PropTypes.string,
  book_by: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  participants: PropTypes.arrayOf(PropTypes.object),
  approved_by: PropTypes.object,
  status: PropTypes.string.isRequired,
  timeId: PropTypes.number,
  setCreateData: PropTypes.func,
};

export default Booked;
