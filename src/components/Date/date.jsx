import React, { useState } from "react";
import { useBookedListByDateQuery } from "../../apps/features/apiSlice";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";
import Booked from "../../pages/booking-date/booked";
import timeList from "../../assets/public/time.json";
import { Modal } from "@mui/material";
import BookingModal from "../Popup/BookingModal";
import Create from "../Popup/Create";
import EditModal from "../Popup/EditModal";
import { use } from "react";

const DateList = ({
  changeRoom,
  changeDate,
  selectedDay,
  holiday,
  current_date,
  current_time,
}) => {
  const { id, facilityByRoomId } = useParams();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState({
    hour: null,
    minute: null,
    period: "am",
  });
  const [hoveredTime, setHoveredTime] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const parentElement = e.currentTarget;
    const { top, left } = parentElement.getBoundingClientRect();
    const scrollTop = parentElement.scrollTop;
    const scrollLeft = parentElement.scrollLeft;
    const relativeY = e.clientY - top + scrollTop;
    const relativeX = e.clientX - left + scrollLeft;

    const slotHeight = 13;
    const totalminutes = Math.floor(relativeY / slotHeight) * 15;

    const hours = Math.floor(totalminutes / 60);
    const minutes = totalminutes % 60;
    const formattedTime = `${hours > 12 ? hours - 12 : hours || 12}:${String(
      minutes
    ).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
    setHoveredTime(formattedTime);
    setMousePosition({ x: relativeX, y: relativeY });
  };

  const time = timeList?.time;

  const {
    data: bookedList,
    isLoading,
    isError,
  } = useBookedListByDateQuery({
    facilityByRoomId,
    bookedListByDate: changeDate || dayjs().format("YYYY-MM-DD"),
  });
  const booked = bookedList?.data;

  const openModal = (booking, e) => {
    e.stopPropagation();
    const now = new Date();
    const bookingDateTime = new Date(
      `${booking.book_date} ${booking.start_time}`
    );

    if (bookingDateTime < now) {
      return;
    }

    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
    setEditModalOpen(false);
  };

  const openCreateModal = () => {
    setCreateModalOpen(true);
    setIsModalOpen(false);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
    setIsModalOpen(false);
  };

  const handleOpenEdit = (booking) => {
    const currentDate = dayjs();
    const bookingDate = dayjs(
      booking.book_date + " " + booking.start_time,
      "YYYY-MM-DD hh:mm A"
    );

    if (bookingDate.isBefore(currentDate)) {
      alert("You cannot edit a booking that is in the past.");
      return;
    }

    setSelectedBooking(booking);
    setEditModalOpen(true);
    setIsModalOpen(false);
  };

  if (isError) {
    return <p>Failed to load booked list. Please try again later.</p>;
  }

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
  const isSmallScreen = window.innerWidth <= 600;

  return (
    <>
      <div
        className="date-layout relative w-full border-gray-800 h-[1350px] pt-1 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <ul className={`absolute w-full h-full`}>
          {hoveredTime && (
            <div
              className={`absolute text-xs text-[#05445E] rounded-md pointer-events-none p-1 z-9999`}
              style={{
                top: isSmallScreen
                  ? `${mousePosition.y - 20}px`
                  : `${mousePosition.y + 5}px`,
                left: isSmallScreen
                  ? `${mousePosition.x - 50}px`
                  : `${mousePosition.x + 10}px`,
              }}
            >
              {hoveredTime}
            </div>
          )}
          {time?.map((slot, index) => {
            const returnData = [];
            const slotTime = parseTimeTo24Hour(slot.time);
            const amPm = slotTime >= 12 ? "pm" : "am";
            const currentHour = new Date().getHours();
            const currentMinute = new Date().getMinutes();
            const isPastDay = changeDate < current_date;

            for (let i = 0; i < 4; i++) {
              const slotMinute = i * 15; // 15-minute intervals (0, 15, 30, 45)
              const isPastTime =
                isPastDay ||
                (changeDate === current_date &&
                  (slotTime < currentHour ||
                    (slotTime === currentHour && slotMinute <= currentMinute)));

              const displayHour =
                slotTime === 0 ? 12 : slotTime > 12 ? slotTime - 12 : slotTime;
              returnData.push(
                <li
                  key={`${index}-${i}`}
                  className={`h-[14px] flex items-start justify-between relative ${
                    isPastTime || holiday || !selectedDay
                      ? " bg-red-80 opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  } `}
                  data-time={`${displayHour}:${slotMinute
                    .toString()
                    .padStart(2, "0")} ${amPm}`}
                  onClick={() => {
                    if (
                      !isPastTime &&
                      !holiday &&
                      selectedDay &&
                      facilityByRoomId !== "8"
                    ) {
                      openCreateModal();
                      setSelectedTime({
                        hour: slotTime === 12 ? 12 : slotTime % 12,
                        minute: i * 15,
                        period: amPm,
                      });
                    }
                  }}
                >
                  {i === 0 ? (
                    <>
                      <label
                        className={`text-sm px-2 transform -translate-y-[7px] ${
                          isPastTime ? "text-red-500" : "text-[#05445E]"
                        }`}
                      >
                        {slot.time}
                      </label>
                      <div
                        className={`flex-1 border-b-[0.5px] ml-2 ${
                          isPastTime ? "border-red-500" : "border-[#05445E66]"
                        }`}
                      ></div>
                    </>
                  ) : null}
                </li>
              );
            }

            return returnData;
          })}
        </ul>
        <div className="line absolute w-[1px] left-[80px] h-[1350px] bg-slate-300"></div>

        {booked?.map((item, index) => {
          if (
            item.start_time &&
            item.end_time &&
            item.facility_id.id === Number(changeRoom) &&
            item.book_date === changeDate &&
            item.status !== "cancelled"
          ) {
            return (
              <div
                key={index}
                className={`booked-item absolute left-20 w-4/5`}
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
                  setOpen={setIsModalOpen}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
      {createModalOpen && selectedDay && !holiday && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-md shadow-lg relative">
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
              facilityByRoomId={facilityByRoomId}
              id={id}
              onClose={closeCreateModal}
              selectedTime={selectedTime}
              changeDate={changeDate}
            />
          </div>
        </div>
      )}
      {console.log(selectedBooking, "selectedBooking")}
      {isModalOpen && (
        <div>
          {selectedBooking && (
            <BookingModal
              booking={selectedBooking}
              onClose={closeModal}
              onEdit={() => handleOpenEdit(selectedBooking)}
            />
          )}
        </div>
      )}
      {editModalOpen && (
        <EditModal booking={selectedBooking} onClose={closeModal} />
      )}
    </>
  );
};

export default DateList;
