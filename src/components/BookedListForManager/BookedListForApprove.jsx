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
  fleetIndex,
  defaultHeight = 60,
}) {
  const [style, setStyle] = useState({ top: 0, height: 0, left: 0 });

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
    console.log(startTimeMinutes, "startTimeMinutesssss");
    const endTimeMinutes = normalizeTime(toTime);

    const startPosition = (startTimeMinutes / 60) * defaultHeight;
    console.log(startPosition, "startPosition");
    const height = Math.max(
      ((endTimeMinutes - startTimeMinutes) / 60) * defaultHeight,
      0
    );
    setStyle({
      top: startPosition + 45,
      height,
      left: "40px",
    });
  }, [fromTime, toTime, fleetIndex]);

  return (
    <div
      className={`px-3 rounded-md shadow-md ${
        status === "pending" ? "bg-[#B6D26F]" : "bg-yellow-200"
      }`}
      style={{ ...style, position: "absolute" }}
    >
      <div className="font-semibold">{name || "Booking"}</div>
      <div className="text-sm text-gray-700">
        {fromTime} - {toTime}
      </div>
    </div>
  );
}

export default BookedListForApprove;
