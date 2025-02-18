import React, { useState } from "react";
import { useFleetBookedListByDateQuery } from "../../apps/features/apiSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import Loading from "../loading/Loading";
import TimeListForFleet from "./TimeListForFleet";
import BookedListForApprove from "./BookedListForApprove";

function BookedListByFleet() {
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date")
      ? dayjs(searchParams.get("date"))
      : dayjs(new Date())
  );
  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setBookedListByDate(formatDate(newDate));
  };
  console.log(selectedDate, "selectedDateeeee");
  const [bookedListByDate, setBookedListByDate] = useState(
    dayjs(selectedDate).format("YYYY-MM-DD")
  );
  const current_time = Number(dayjs().format("HH"));
  const current_date = dayjs();
  const {
    data: fleetBookedList,
    isLoading,
    isError,
    error,
  } = useFleetBookedListByDateQuery({
    date: bookedListByDate,
  });

  const bookedList = Array.isArray(fleetBookedList)
    ? fleetBookedList.flatMap((fleet) => fleet.data || [])
    : [];

  console.log(bookedList, "Booked List");

  return (
    <div>
      <div className="flex flex-row justify-between items-center w-full h-auto mt-4 mb-4 z-50">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]} className="h-[20px]">
            <DatePicker
              label="Choose Date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-full"
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>
      <TimeListForFleet
        changeDate={formatDate(selectedDate)}
        current_date={formatDate(current_date)}
        current_time={current_time}
        bookedList={bookedList}
      />
    </div>
  );
}

export default BookedListByFleet;
