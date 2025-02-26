import React, { useEffect, useState } from "react";
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
  defaultHeight = 50,
}) => {
  console.log(id, "iddddd");
  const [style, setStyle] = useState({ top: 0, height: 0 });
  const [hovered, setHovered] = useState(false);
  const [pastBooking, setPastBooking] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdminApproved, setIsAdminApproved] = useState(false);

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
  // console.log(bookedList, "bookedList");

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

  const overlappingBookings =
    bookedList?.data?.filter((booking) => {
      const startA = normalizeTime(booking.start_time);
      const endA = normalizeTime(booking.end_time);
      const startB = normalizeTime(fromTime);
      const endB = normalizeTime(toTime);

      return (
        booking.book_date === book_date &&
        !(
          endA <= startB || // booking ends before this booking starts
          startA >= endB
        )
      );
    }) || [];
  console.log(overlappingBookings, id, "overlappingBookings");

  const bookingIndex = overlappingBookings.findIndex(
    (booking) => booking.id === id
  );
  console.log(bookingIndex, "index");

  // const widthPercentage = 100 / overlappingBookings.length;
  // console.log(widthPercentage, "widthhhh");

  const widthPercentage = overlappingBookings.length > 1 ? 50 : 100;

  const leftOffset =
    bookingIndex != 0
      ? (bookingIndex * 50) / (overlappingBookings.length - 1)
      : 0;
  console.log(leftOffset, "leftOffset");

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
    console.log(startPosition, "startPosition");
    const height = Math.max(
      ((endTimeMinutes - startTimeMinutes) / 60) * defaultHeight,
      0
    );

    setStyle({
      top: startPosition,
      height,
      width: `${widthPercentage}%`,
      left: `${leftOffset}%`,
      position: "absolute",
      zIndex: hovered ? 50 : 1,
      transition: "z-index 0.2s linear",
    });
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    setPastBooking(endTimeMinutes <= currentMinutes);
  }, [
    fromTime,
    toTime,
    defaultHeight,
    book_by,
    approved_by,
    adminData,
    widthPercentage,
    leftOffset,
    hovered,
  ]);

  return (
    <div
      className={`booked-item px-3 rounded-md shadow-md flex flex-col border border-[#05445E] bg-white min-h-[30px] cursor-pointer`}
      style={{
        ...style,
        position: "absolute",
        // width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        backgroundColor:
          status === "pending"
            ? "#d4f1f4"
            : status === "approved"
            ? "#d4f1f4"
            : isUser
            ? "#05445E"
            : "#fff",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-center">
        <h4
          className={`font-bold ${
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
        className={`text-sm ${isUser ? "text-[#d4f1f4]" : "text-[#05445E]"}  ${
          status === "pending" ? "text-black" : ""
        }`}
      >
        {fromTime} - {toTime} [{book_by.name || book_by.email || "Unknown"}]
      </p>
    </div>
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
