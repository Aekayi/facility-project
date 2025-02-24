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
  defaultHeight = 65,
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
    const endTimeMinutes = normalizeTime(toTime);

    const startPosition = (startTimeMinutes / 60) * defaultHeight;
    const height = Math.max(
      ((endTimeMinutes - startTimeMinutes) / 60) * defaultHeight,
      0
    );
    setStyle({
      top: startPosition + 24,
      height,
      left: 40,
    });
  }, [fromTime, toTime]);

  return (
    <div
      className={`px-6 rounded-md shadow-md cursor-pointer ${
        status === "pending" ? "bg-[#E3EEC7]" : "bg-[#B6D26F]"
      }`}
      style={{ ...style, position: "absolute" }}
    >
      <span className="font-sm">{name || "Booking"}</span>
      <div className="text-xs text-gray-700">
        {fromTime} - {toTime}
      </div>
    </div>
  );
}

export default BookedListForApprove;
