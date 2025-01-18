import React, { useEffect, useState } from "react";
import {
  useFacilityidQuery,
  useGetHolidaysQuery,
  useBookedListByDateQuery,
  useUsersQuery,
} from "../../apps/features/apiSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import LocalIcon from "../../assets/icons";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import Create from "../../components/Popup/Create";
import Loading from "../../components/loading/Loading";
import SquareLoader from "../../assets/icons/Square Loader.gif";
import DateList from "../../components/Date/date";
const BookingDate = () => {
  const { id, facilityByRoomId } = useParams();
  console.log("facilityByRoomId", facilityByRoomId);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date")
      ? dayjs(searchParams.get("date"))
      : dayjs(new Date())
  );
  const [bookedListByDate, setBookedListByDate] = useState(
    dayjs(selectedDate).format("YYYY-MM-DD")
  );
  const [selectedDay, setSelectedDay] = useState(false);
  const [holiday, setHoliday] = useState(false);
  const [holidayName, setHolidayName] = useState(null);

  const current_date = dayjs();
  const next_day = current_date.subtract(1, "day");
  const current_time = Number(dayjs().format("HH"));

  const { data: roomDetails } = useFacilityidQuery(facilityByRoomId);
  const { data: user } = useUsersQuery(id);
  console.log("users", user);
  const { data: holidays } = useGetHolidaysQuery();

  const { data: bookedList } = useBookedListByDateQuery({
    facilityByRoomId,
    bookedListByDate,
  });

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

  useEffect(() => {
    const formattedSelectedDate = formatDate(selectedDate);

    const filteredHolidays = holidays?.filter(
      (holiday) => formatDate(holiday.day) === formattedSelectedDate
    );
    const isHoliday = filteredHolidays?.length > 0;
    const holidayNames = filteredHolidays?.map((holiday) => holiday.name);

    setHoliday(isHoliday);
    setHolidayName(holidayNames);

    const dayName = dayjs(selectedDate).format("dddd");
    const isAvailableDay = roomDetails?.availableDays?.includes(dayName);
    setSelectedDay(isAvailableDay);
  }, [selectedDate, holidays, roomDetails]);

  useEffect(() => {
    const scrollTime = dayjs(selectedDate).format("h A");
    const element = document.querySelector(`[data-time="${scrollTime}"]`);
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  }, [selectedDate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setBookedListByDate(formatDate(newDate));
  };

  // Modal functionality for creating new bookings
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  console.log(bookings, "bookings");

  const addBooking = (newBooking) => {
    setBookings((prevBookings) => [...prevBookings, newBooking]);
    setIsModalOpen(false); // Close the modal after adding a booking
  };

  return (
    <div className="h-full w-2/3 max-w-md relative p-4">
      {roomDetails ? (
        <div>
          {/* Header Section */}
          <div className="relative">
            <div className="absolute flex justify-between items-center bg-black bg-opacity-50 w-full p-2">
              <button className="back-con" onClick={handleBack}>
                <img
                  src={LocalIcon.BackColor}
                  style={{ width: "11px" }}
                  title="back"
                  alt="back"
                />
              </button>
              <h1 className="text-white">{roomDetails.name}</h1>
            </div>
            <img src={roomDetails.icon} alt="" />
          </div>

          {/* Date Picker Section */}
          <div>
            <div className="flex flex-row justify-between items-center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Choose Date"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                  <input
                    type="hidden"
                    name="datePickerHidden"
                    value={formatDate(selectedDate)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white text-sm py-2 px-2 rounded-md hover:bg-blue-600"
              >
                Book New
              </button>
            </div>

            {/* Feedback Messages */}
            <div>
              {holiday ? (
                <label className="text-red-500 mt-4 mb-2">
                  This day is "{holidayName}".
                </label>
              ) : !selectedDay ? (
                <label className="text-red-500 mt-4">
                  Not available on this day.
                </label>
              ) : selectedDate.isBefore(next_day, "day") ? (
                <label className="text-red-500 mt-4">
                  The selected date is in the past.
                </label>
              ) : (
                <label>{dayjs(selectedDate).format("dddd, MMMM D")}</label>
              )}
            </div>
          </div>

          {/* Modal Box */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white  rounded-lg shadow-lg relative">
                <button
                  onClick={() => setIsModalOpen(false)}
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
                  onClose={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          )}

          <div
            className={
              !selectedDay || holiday || selectedDate.isBefore(next_day, "day")
                ? "date-list-container unavailable"
                : "date-list-container"
            }
          >
            <DateList
              changeRoom={facilityByRoomId}
              changeDate={formatDate(selectedDate)}
              selectedDay={selectedDay}
              current_date={formatDate(current_date)}
              current_time={current_time}
            />
          </div>
        </div>
      ) : (
        <div className="container flex justify-center items-center h-full m-auto">
          <img src={SquareLoader} alt="" srcset="" width={100} height={100} />
        </div>
      )}
    </div>
  );
};

export default BookingDate;
