import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalIcon from "../../assets/icons";
import {
  useGetBookedSlotsQuery,
  useFacilitynamesQuery,
} from "../../apps/features/apiSlice";
import dayjs from "dayjs";
import { use } from "react";
import BookedRecordForApproval from "./BookedRecordForApproval";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

function BookingsForApprove() {
  const navigate = useNavigate();
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  let current_date = formatDate(new Date());

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const {
    data: facilitynames,
    isLoading: facilityLoading,
    isError: facilityError,
  } = useFacilitynamesQuery("Fleet");
  console.log(facilitynames, "facilityname");

  const {
    data: bookedSlots,
    isLoading,
    isError,
  } = useGetBookedSlotsQuery({ id: selectedFacilityId });
  const currentBookedList = bookedSlots?.data?.filter((list) =>
    dayjs(list?.book_date)?.isSameOrAfter(current_date, "day")
  );
  const pendingBookedList = currentBookedList?.filter(
    (list) => list?.status === "pending"
  );
  console.log(pendingBookedList, "pending");

  return (
    <div className="h-full min-h-screen w-full max-w-md bg-white">
      <div className="flex justify-between items-center py-4 px-3">
        <h1 className="text-xl font-bold text-[#05445e]">
          Booking Records For Fleet
        </h1>
        <button onClick={() => navigate("/")}>
          <img className="w-10 h-10" src={LocalIcon.Home} />
        </button>
      </div>

      <div className="px-3 py-2">
        <label
          htmlFor="fleet"
          className="block text-sm font-medium text-gray-700"
        >
          Select Fleet:
        </label>
        <select
          id="fleet"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={selectedFacilityId || ""}
          onChange={(e) => setSelectedFacilityId(e.target.value)}
        >
          <option value="" disabled>
            Select a Fleet
          </option>
          {facilitynames?.data?.map((facility) => (
            <option key={facility.id} value={facility.id}>
              {facility.name}
            </option>
          ))}
        </select>
      </div>

      {pendingBookedList?.length > 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          {pendingBookedList?.map((list) => (
            <ul>
              <li>
                <BookedRecordForApproval
                  title={list?.title}
                  name={list?.facility_id?.name}
                  locations={list?.locations}
                  book_date={list?.book_date}
                  startTime={list?.start_time}
                  endTime={list?.end_time}
                  status={list?.status}
                />
              </li>
            </ul>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold text-[#05445e]">
            No Bookings For Approval
          </h1>
        </div>
      )}
    </div>
  );
}

export default BookingsForApprove;
