import React, { useEffect, useState } from "react";
import { useBookedListByDateQuery } from "../../apps/features/apiSlice";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import Booked from "../../pages/booking-date/booked";
import { useDispatch, useSelector } from "react-redux";
import timeList from "../../assets/public/time.json";
import { bookedRedx } from "../../apps/features/customSlice";
import { Modal } from "@mui/material";
import BookingModal from "../Popup/BookingModal";
import Create from "../Popup/Create";

const DateList = ({
  changeRoom,
  changeDate,
  selectedDay,
  current_date,
  current_time,
}) => {
  const { id, facilityByRoomId } = useParams();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [popupId, setPopupId] = useState();
  const [createTime, setCreateTime] = useState({
    fromTime: "12:00 am",
    toTime: "1:00 am",
  });

  const [createData, setCreateData] = useState();
  const [triggerTimeout, setTriggerTimeout] = useState(false);
  const [timeId, setTimeId] = useState();
  const time = timeList?.time;

  const number_of_times = time.length;
  const dispatch = useDispatch();

  const {
    data: bookedList = [],
    isLoading,
    isError,
  } = useBookedListByDateQuery({
    facilityByRoomId,
    bookedListByDate: changeDate || dayjs().format("YYYY-MM-DD"),
  });

  console.log(bookedList, "bookedList");

  const bookedRedxList = useSelector(
    (state) => state?.bookedRedx?.bookedRedxRequest?.info
  );
  console.log("bookedRedxListttttttt", bookedRedxList);

  useEffect(() => {
    bookedList?.data?.forEach((list) => {
      if (list.status !== "cancelled") {
        if (
          !bookedRedxList ||
          !bookedRedxList.some((redList) => redList.id === list.id)
        ) {
          dispatch(bookedRedx?.actions.setData(list));
          console.log("list.....", list);
        } else if (
          bookedRedxList === null ||
          Object.keys(bookedRedxList).length === 0
        ) {
          dispatch(bookedRedx?.actions.setData(list));
        }
      }
    });
  }, [changeDate, bookedList, bookedRedxList, dispatch]);

  useEffect(() => {
    if (createData) {
      setTimeout(() => {
        setTriggerTimeout(false);
      }, 3000);
      setTriggerTimeout(true);
    }
  }, [createData]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Failed to load booked list. Please try again later.</p>;
  }

  const detailTime = [
    { id: 0, time: "12:00 AM" },
    { id: 1, time: "12:15 AM" },
    { id: 2, time: "12:30 AM" },
    { id: 3, time: "12:45 AM" },
    { id: 4, time: "01:00 AM" },
    { id: 5, time: "01:15 AM" },
    { id: 6, time: "01:30 AM" },
    { id: 7, time: "01:45 AM" },
    { id: 8, time: "02:00 AM" },
    { id: 9, time: "02:15 AM" },
    { id: 10, time: "02:30 AM" },
    { id: 11, time: "02:45 AM" },
    { id: 12, time: "03:00 AM" },
    { id: 13, time: "03:15 AM" },
    { id: 14, time: "03:30 AM" },
    { id: 15, time: "03:45 AM" },
    { id: 16, time: "04:00 AM" },
    { id: 17, time: "04:15 AM" },
    { id: 18, time: "04:30 AM" },
    { id: 19, time: "04:45 AM" },
    { id: 20, time: "05:00 AM" },
    { id: 21, time: "05:15 AM" },
    { id: 22, time: "05:30 AM" },
    { id: 23, time: "05:45 AM" },
    { id: 24, time: "06:00 AM" },
    { id: 25, time: "06:15 AM" },
    { id: 26, time: "06:30 AM" },
    { id: 27, time: "06:45 AM" },
    { id: 28, time: "07:00 AM" },
    { id: 29, time: "07:15 AM" },
    { id: 30, time: "07:30 AM" },
    { id: 31, time: "07:45 AM" },
    { id: 32, time: "08:00 AM" },
    { id: 33, time: "08:15 AM" },
    { id: 34, time: "08:30 AM" },
    { id: 35, time: "08:45 AM" },
    { id: 36, time: "09:00 AM" },
    { id: 37, time: "09:15 AM" },
    { id: 38, time: "09:30 AM" },
    { id: 39, time: "09:45 AM" },
    { id: 40, time: "10:00 AM" },
    { id: 41, time: "10:15 AM" },
    { id: 42, time: "10:30 AM" },
    { id: 43, time: "10:45 AM" },
    { id: 44, time: "11:00 AM" },
    { id: 45, time: "11:15 AM" },
    { id: 46, time: "11:30 AM" },
    { id: 47, time: "11:45 AM" },
    { id: 48, time: "12:00 PM" },
    { id: 49, time: "12:15 PM" },
    { id: 50, time: "12:30 PM" },
    { id: 51, time: "12:45 PM" },
    { id: 52, time: "01:00 PM" },
    { id: 53, time: "01:15 PM" },
    { id: 54, time: "01:30 PM" },
    { id: 55, time: "01:45 PM" },
    { id: 56, time: "02:00 PM" },
    { id: 57, time: "02:15 PM" },
    { id: 58, time: "02:30 PM" },
    { id: 59, time: "02:45 PM" },
    { id: 60, time: "03:00 PM" },
    { id: 61, time: "03:15 PM" },
    { id: 62, time: "03:30 PM" },
    { id: 63, time: "03:45 PM" },
    { id: 64, time: "04:00 PM" },
    { id: 65, time: "04:15 PM" },
    { id: 66, time: "04:30 PM" },
    { id: 67, time: "04:45 PM" },
    { id: 68, time: "05:00 PM" },
    { id: 69, time: "05:15 PM" },
    { id: 70, time: "05:30 PM" },
    { id: 71, time: "05:45 PM" },
    { id: 72, time: "06:00 PM" },
  ];

  const openModal = (booking, e) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
    setIsModalOpen(false);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setIsModalOpen(false);
  };
  const addBooking = (newBooking) => {
    setBookings((prevBookings) => [...prevBookings, newBooking]);
    openCreateModal(false); // Close the modal after adding a booking
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
      hours = 0; // Midnight case
    } else if (period.toUpperCase() === "PM" && hours !== 12) {
      hours += 12; // Convert PM to 24-hour format
    }

    return hours; // Return only the hours for comparison
  };

  return (
    <>
      <div className="date-list-container relative w-full border-t-[1px] h-[500px] overflow-y-auto">
        <ul className="absolute w-full">
          {time?.map((slot, index) => {
            const slotTime = parseTimeTo24Hour(slot.time);
            const currentHour = new Date().getHours();
            const isPastDay = changeDate < current_date;
            console.log(isPastDay, "isPastDay....");

            const isPastTime =
              isPastDay ||
              (changeDate === current_date && slotTime < currentHour);
            console.log(isPastTime, "isPastTime");

            return (
              <li
                key={index}
                className={`min-h-[52px] w-full border-b-[1px] border-slate-400 flex items-start ${
                  isPastTime
                    ? "unavailable-li bg-gray-100 opacity-50  pointer-events-none border-b-[1px] border-[#e0e0e0]"
                    : "date-list cursor-pointer"
                }`}
                data-time={slot.time}
                onClick={!isPastTime ? openCreateModal : null}
              >
                <label className={isPastTime ? "text-gray-400" : ""}>
                  {slot.time}
                </label>
              </li>
            );
          })}
        </ul>

        {bookedRedxList?.map((item, index) => {
          if (
            item.start_time &&
            item.end_time &&
            item.facility_id.id === Number(changeRoom) &&
            item.book_date === changeDate &&
            item.status !== "cancelled"
          ) {
            // Find the index of the start time in the time list
            const startTimeIndex = detailTime.findIndex(
              (slot) => slot.time === item.start_time
            );
            console.log(startTimeIndex, "startTimeIndex");

            // Calculate the height of the booked item based on duration
            const endTimeIndex = detailTime.findIndex(
              (slot) => slot.time === item.end_time
            );
            console.log(endTimeIndex, "endTimeIndex");

            // Calculate the top position based on the startTimeIndex
            const topPosition = startTimeIndex;
            console.log(topPosition, "topPosition");

            const height = (endTimeIndex - startTimeIndex) * 52 || 52;
            console.log(height, "height");

            return (
              <div
                key={index}
                className={`booked-item absolute left-16 w-3/4`}
                style={{
                  top: `${topPosition}px`,
                  // height: `${height}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(item, e);
                }}
              >
                <Booked
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
                  setCreateData={setCreateData}
                  setOpen={setOpen}
                  setOpenShow={setOpenShow}
                  setPopupId={setPopupId}
                  timeId={timeId}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
      {createModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white  rounded-lg shadow-lg relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="size-6"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <Create
              addBooking={addBooking}
              facilityByRoomId={facilityByRoomId}
              id={id}
              onClose={closeCreateModal}
            />
          </div>
        </div>
      )}
      {isModalOpen && (
        <div>
          {selectedBooking ? (
            <BookingModal booking={selectedBooking} onClose={closeModal} />
          ) : (
            <p>No booking selected.</p>
          )}
        </div>
      )}
    </>
  );
};

export default DateList;
