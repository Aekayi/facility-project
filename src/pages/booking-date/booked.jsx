import React, { forwardRef, useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import { set } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useUserbyIdQuery } from "../../apps/features/apiSlice";
import { MdApproval, MdCheckCircle } from "react-icons/md";

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
  const [time, setTime] = useState({
    fromTime: fromTime.toLowerCase(),
    toTime: toTime.toLowerCase(),
  });

  const [style, setStyle] = useState({ top: 0, height: 0 });
  const [pastBooking, setPastBooking] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isAdminApproved, setIsAdminApproved] = useState(false);

  const prevData = useSelector(
    (state) => state?.bookedRedx?.bookedRedxRequest?.info
  );

  const user = localStorage.getItem("persist:auth");
  const userData = JSON.parse(user);
  const {
    data: adminData,
    isLoading: adminIdLoading,
    isError: adminIdError,
  } = useUserbyIdQuery(userData?.id);

  let element = document.getElementById(id);

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

    return hour * 60 + minute; // Total minutes from midnight
  };

  useEffect(() => {
    if (book_by?.id == adminData?.data?.id) {
      setIsUser(true);
    }

    const adminId = adminData?.data?.id;
    if (approved_by?.some((approver) => approver.id === adminId)) {
      setIsAdminApproved(true);
    }

    const startTimeMinutes = normalizeTime(fromTime);
    const endTimeMinutes = normalizeTime(toTime);

    const startPosition = (startTimeMinutes / 60) * defaultHeight;
    const height = Math.max(
      ((endTimeMinutes - startTimeMinutes) / 60) * defaultHeight,
      0
    );

    setStyle({
      top: startPosition,
      height,
    });
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    setPastBooking(endTimeMinutes <= currentMinutes);
  }, [fromTime, toTime, defaultHeight, book_by, approved_by, adminData]);

  return (
    <div
      className={`booked-item px-3 rounded-md shadow-md flex flex-col border border-[#05445E] bg-white min-h-[30px] cursor-pointer`}
      style={{
        ...style,
        position: "absolute",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor:
          status === "pending"
            ? "#d4f1f4"
            : status === "approved"
            ? "#d4f1f4"
            : isUser
            ? "#05445E"
            : "#fff",
      }}
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
