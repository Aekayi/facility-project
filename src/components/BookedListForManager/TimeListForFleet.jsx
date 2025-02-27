import React, { useCallback, useEffect, useState } from "react";
import timeList from "../../assets/public/time.json";
import BookedListForApprove from "./BookedListForApprove";
import {
  useFacilitynamesQuery,
  useBookingDetailsQuery,
} from "../../apps/features/apiSlice";

function TimeListForFleet({
  changeDate,
  current_date,
  bookedList,
  onBookingSelect,
}) {
  console.log(bookedList, "bookedList");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const {
    data: facilityNames,
    isError,
    isLoading,
  } = useFacilitynamesQuery("Fleet");

  const booked = Array.isArray(bookedList)
    ? bookedList.flatMap((fleet) => fleet.data || [])
    : [];
  console.log(booked, "bookedddd");
  const time = timeList.time;

  useEffect(() => {
    if (!bookedList || bookedList?.length === 0) return;
    const firstBooking = bookedList[0]?.data[0];
    console.log(firstBooking, "firstBooking");

    if (!selectedBooking && firstBooking) {
      setSelectedBooking(firstBooking);
      onBookingSelect(firstBooking);
    } else {
      setSelectedBooking(null);
      onBookingSelect;
    }
  }, [changeDate, bookedList, onBookingSelect]);

  const handleBookingClick = (booking) => {
    setSelectedBooking((prev) => (prev?.id === booking.id ? prev : booking));
    onBookingSelect(booking);
  };

  const parseTimeTo24Hour = (time) => {
    const match = time.match(/^(\d{1,2})(?::(\d{2}))?\s?(AM|PM)$/i);
    if (!match) {
      console.error(`Invalid time format: ${time}`);
      return null;
    }

    let [_, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes || "0", 10);

    if (period.toUpperCase() === "AM" && hours === 12) {
      hours = 0;
    } else if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12;
    }

    return `${String(hours).padStart(2, "0")}`;
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div>
      <div className="date-layout relative w-full border-gray-800 h-[1600px] pt-1">
        <div className="grid grid-cols-[50px_repeat(3,1fr)] gap-2  text-center py-2">
          <div className="text-left px-2"></div>
          {facilityNames?.data?.map((fleet, index) => (
            <>
              <div
                key={index}
                className="border-l border-gray-400 h-[1600px] z-0"
              >
                {fleet?.name}
              </div>
              <ul className={`absolute w-full h-full mt-6`}>
                {time?.map((slot, index) => {
                  const returnData = [];
                  const slotTime = parseTimeTo24Hour(slot.time);
                  const currentHour = new Date().getHours();
                  const currentMinute = new Date().getMinutes();
                  const isPastDay = changeDate < current_date;
                  for (let i = 0; i < 4; i++) {
                    const slotMinute = String(i * 15).padStart(2, "0");
                    const isPastTime =
                      isPastDay ||
                      (changeDate === current_date &&
                        (slotTime < currentHour ||
                          (slotTime === currentHour &&
                            slotMinute <= currentMinute)));

                    returnData.push(
                      <li
                        key={`${index}-${i}`}
                        className={`min-h-[15px] flex items-start justify-between relative `}
                      >
                        {i === 0 ? (
                          <>
                            <label
                              className={`text-sm px-2 transform -translate-y-[7px] `}
                            >
                              {slot.time}
                            </label>
                            <div
                              className={`flex-1 border-b-[0.5px] border-gray-400 ml-2 `}
                            ></div>
                          </>
                        ) : null}
                      </li>
                    );
                  }
                  return returnData;
                })}
              </ul>
              {booked
                ?.filter((item) => item?.facility_id?.id === fleet?.id)
                ?.map((item, index, facilityBookings) => {
                  if (
                    (item?.book_date === changeDate &&
                      item?.start_time &&
                      item?.end_time &&
                      item?.status === "pending") ||
                    item?.status === "booked"
                  ) {
                    const fleetIndex = facilityNames?.data?.findIndex(
                      (f) => f.id === fleet?.id
                    );
                    console.log(fleetIndex, "fleetIndex");

                    const columnWidth = 90 / facilityNames?.data?.length;
                    const baseLeftPosition = `${
                      fleetIndex * columnWidth + columnWidth / 3
                    }`;
                    return (
                      <div
                        key={index}
                        className={`absolute rounded-md cursor-pointer`}
                        style={{
                          left: `${baseLeftPosition}%`,
                          // zIndex: 30,
                          width: `${columnWidth - 10}%`,
                        }}
                        onClick={() => handleBookingClick(item)}
                      >
                        <BookedListForApprove
                          id={item?.id}
                          bookedId={booked?.map((item) => item?.id)}
                          name={item?.title}
                          fromTime={item?.start_time}
                          toTime={item?.end_time}
                          note={item?.note}
                          book_date={item?.book_date}
                          facility_id={item?.facility_id}
                          locations={item?.locations}
                          book_by={item?.book_by}
                          participants={item?.participants}
                          approved_by={item?.approved_by}
                          status={item?.status}
                          bookings={facilityBookings}
                          facilityNames={facilityNames}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimeListForFleet;
