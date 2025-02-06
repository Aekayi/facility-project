import dayjs from "dayjs";
import React from "react";

function BookedRecord({
  title,
  icon,
  needLocation,
  name,
  book_date,
  startTime,
  endTime,
  status,
}) {
  const date = dayjs(book_date).format("ddd D MMMM");

  return (
    <div className="flex justify-start items-center space-x-4 px-3 py-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-[#05445E]"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
        />
      </svg>

      <div>
        <p className="text-sm text-gray-400">
          {date} ({startTime} - {endTime})
        </p>
        <h3 className="text-xl text-[#05445E] font-bold">
          {title} | {name}
        </h3>
        <p className="text-blue-400">{status}</p>
      </div>
    </div>
  );
}

export default BookedRecord;
