import React, { forwardRef, useEffect, useRef, useState } from "react";

import PropTypes from "prop-types";
import { set } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { bookedRedx } from "../../apps/features/customSlice";
import { useUserbyIdQuery } from "../../apps/features/apiSlice";

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
}) => {
  const [time, setTime] = useState({
    fromTime: fromTime.toLowerCase(),
    toTime: toTime.toLowerCase(),
  });
  let defaultHeight = 50;

  const [style, setStyle] = useState({ top: 0, height: 0 });

  const prevData = useSelector(
    (state) => state?.bookedRedx?.bookedRedxRequest?.info
  );
  console.log(prevData, "prevData");

  const user = localStorage.getItem("persist:auth");
  const userData = JSON.parse(user);
  const {
    data: adminId,
    isLoading: adminIdLoading,
    isError: adminIdError,
  } = useUserbyIdQuery(userData?.id);
  console.log(adminId?.data?.id, "adminId");

  const approvedId = approved_by?.find((approver) => approver.id === adminId);
  console.log(approvedId, "approvedId");

  let element = document.getElementById(id);

  // const handelStartPosition = (time) => {
  //   var hour = parseInt(time[1], 10);
  //   var minute = parseInt(time[2], 10);
  //   var period = time[3].toLowerCase();

  //   if (period === "am") {
  //     if (hour === 12) {
  //       hour = 0;
  //     }
  //   } else {
  //     if (hour !== 12) {
  //       hour = hour + 12;
  //     }
  //   }

  //   let startPosition = hour * defaultHeight + (minute * defaultHeight) / 60;
  //   console.log(startPosition, "startPosition.......");

  //   return startPosition;
  // };

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

  const calculatePosition = (
    fromTime,
    toTime,
    defaultHeight,
    containerHeight
  ) => {
    const startTimeMinutes = normalizeTime(fromTime);
    const endTimeMinutes = normalizeTime(toTime);

    // Calculate the positions based on the default height per hour
    const startPosition = (startTimeMinutes / 60) * defaultHeight;
    console.log(startPosition, "startPositionnnnnnn");
    const endPosition = (endTimeMinutes / 60) * defaultHeight;
    console.log(endPosition, "endpositionnnnnnn");

    const height = Math.max(endPosition - startPosition, 0);
    console.log(height, "height....");

    // Ensure the item stays within the container boundaries
    // const clampedStart = Math.min(startPosition, containerHeight - height);
    // console.log(clampedStart, "clampedStart");

    return { y: startPosition, height };
  };

  useEffect(() => {
    const container = document.querySelector(".book-create-container");
    const containerHeight = container ? container.offsetHeight : 0;

    const { y, height } = calculatePosition(
      fromTime,
      toTime,
      defaultHeight,
      containerHeight
    );

    setStyle({ top: y, height });
    console.log(style, "style.....");
  }, [fromTime, toTime, defaultHeight]);

  return (
    <div
      className="booked-item p-3 mb-2 rounded-md shadow-md flex flex-col border-l-4 border-blue-500 bg-white min-h-[52px] cursor-pointer"
      style={{
        position: "absolute",
        top: style.top - 21,
        height: style.height,
        width: "100%",
      }}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
      </div>
      <p className="text-sm text-gray-600">
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
