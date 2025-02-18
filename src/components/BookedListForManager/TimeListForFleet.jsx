import React from "react";
import timeList from "../../assets/public/time.json";
import BookedListForApprove from "./BookedListForApprove";
import { useFacilitynamesQuery } from "../../apps/features/apiSlice";

function TimeListForFleet({
  changeDate,
  current_date,
  current_time,
  bookedList,
}) {
  const {
    data: facilityNames,
    isError,
    isLoading,
  } = useFacilitynamesQuery("Fleet");
  console.log(facilityNames?.data, "facilityNames");
  const booked = bookedList;
  console.log(booked, "bookedddd");
  const time = timeList.time;
  const fleets = ["Ko Pyae Phyo Fleet", "Fleet 2", "Taxi"];

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
      hours = 0; // Midnight case
    } else if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12; // Convert PM to 24-hour format
    }

    // return hours; // Return only the hours for comparison
    return `${String(hours).padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="date-layout relative w-full border-gray-800 h-[1500px] pt-1 overflow-hidden">
        <div className="grid grid-cols-3 text-center font-semibold ml-20">
          {facilityNames?.data?.map((fleet, index) => (
            <div key={index}>{fleet?.name}</div>
          ))}
        </div>
        <ul className={`absolute w-full h-full`}>
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
                    (slotTime === currentHour && slotMinute <= currentMinute)));
              // const displayHour =
              //   slotTime === 0 ? 12 : slotTime > 12 ? slotTime - 12 : slotTime;
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
                      <div className={`flex-1 border-b-[0.5px] ml-2 `}></div>
                    </>
                  ) : null}
                </li>
              );
            }

            return returnData;
          })}
        </ul>
        <div className="line absolute w-[1px] left-[70px] h-[1500px] bg-slate-300"></div>
        <div className="line absolute w-[1px] left-[290px] h-[1500px] bg-slate-300"></div>
        <div className="line absolute w-[1px] left-[520px] h-[1500px] bg-slate-300"></div>
        <div className="line absolute w-[1px] left-[725px] h-[1500px] bg-slate-300"></div>

        {booked?.map((item, index) => {
          if (
            item?.book_date === changeDate &&
            item?.start_time &&
            item?.end_time &&
            item?.status === "pending"
          ) {
            const convertToMinutes = (time) => {
              const [hour, minute, period] = time
                .match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i)
                .slice(1);
              let hours = parseInt(hour, 10);
              let minutes = parseInt(minute, 10);

              if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
              if (period.toUpperCase() === "AM" && hours === 12) hours = 0;

              return hours * 60 + minutes;
            };

            const startMinutes = convertToMinutes(item.start_time);
            const endMinutes = convertToMinutes(item.end_time);
            const duration = endMinutes - startMinutes;

            // UI adjustments
            const slotHeight = 14;
            const topPosition = (startMinutes / 15) * slotHeight;
            const bookingHeight = (duration / 15) * slotHeight;

            const fleetIndex = facilityNames?.data?.filter(
              (fleet) => fleet?.id === item?.facility_id?.id
            );
            console.log(
              fleetIndex?.map((fleet) => fleet?.id),
              "fleetindexssss"
            );
            // const fleetLeftPositions = [70, 290, 520];
            return (
              <div key={index} className="absolute rounded-md left-20">
                <BookedListForApprove
                  id={item?.id}
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
                  fleetIndex={fleetIndex}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default TimeListForFleet;
