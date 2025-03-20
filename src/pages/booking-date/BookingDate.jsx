import React, { useEffect, useState } from "react";
import {
  useFacilityidQuery,
  useGetHolidaysQuery,
  useBookedListByDateQuery,
  useUsersQuery,
  useParticipantsQuery,
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
  const [selectedTime, setSelectedTime] = useState({
    hour: null,
    minute: null,
    period: "am",
  });
  const [loading, setLoading] = useState(true);

  const current_date = dayjs();
  const next_day = current_date.subtract(1, "day");
  const current_time = Number(dayjs().format("HH"));

  const {
    data: roomDetails,
    isLoading: roomLoading,
    isError,
  } = useFacilityidQuery(facilityByRoomId);
  const { data: user } = useParticipantsQuery(id);
  console.log("users", user);
  const { data: holidays } = useGetHolidaysQuery();

  const { data: bookedList } = useBookedListByDateQuery({
    facilityByRoomId,
    bookedListByDate,
  });

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");
  console.log(formatDate(selectedDate), "formatdateee");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 1 second
    }, 1000);
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
  console.log(selectedDate, "selectedDate");

  // Modal functionality for creating new bookings
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  console.log(bookings, "bookings");

  const addBooking = (newBooking) => {
    setBookings((prevBookings) => [...prevBookings, newBooking]);
    setIsModalOpen(false);
  };

  return (
    <div className="h-full w-full max-w-md relative p-4 bg-white">
      {loading ? (
        <div className="min-h-screen bg-white flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <>
          {roomDetails && (
            <>
              {/* Header Section */}
              <div className="sticky top-0 z-10 bg-white">
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
                  <img
                    src={roomDetails.icon}
                    alt=""
                    className="w-full h-[200px]"
                  />
                </div>

                {/* Date Picker Section */}
                <div>
                  <div className="flex flex-row justify-between items-center w-full h-auto mt-4 mb-4 z-50">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer
                        components={["DatePicker"]}
                        className="h-[20px]"
                      >
                        <DatePicker
                          label="Choose Date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          className="w-full"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              overflow: "hidden",
                              width: "100%", // Ensures it takes full width of the container
                              minWidth: "200px", // Default width for large screens
                              color: "#05445E",

                              "& .MuiOutlinedInput-input": {
                                padding: "4px 4px",
                              },
                            },
                            "& .MuiOutlinedInput-root:hover": {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#05445E",
                              },
                            },
                            "& .MuiOutlinedInput-root.Mui-focused": {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#05445E",
                              },
                            },

                            "@media (min-width: 425px)": {
                              "& .MuiOutlinedInput-root": {
                                minWidth: "320px", // Mobile
                              },
                            },
                          }}
                        />

                        <input
                          type="hidden"
                          name="datePickerHidden"
                          value={formatDate(selectedDate)}
                          className="bg-red-500"
                        />
                      </DemoContainer>
                    </LocalizationProvider>

                    <button
                      onClick={() => {
                        const now = new Date();
                        let hours = now.getHours();

                        let minutes = now.getMinutes();
                        minutes = Math.ceil(minutes / 15) * 15;
                        if (minutes === 60) {
                          minutes = 0;
                          hours += 1;
                        }

                        // // Convert to 12-hour format
                        const ampm = hours >= 12 ? "pm" : "am";
                        hours = hours % 12 || 12;
                        setSelectedTime({
                          hour: hours,
                          minute: minutes,
                          period: ampm,
                        });
                        setIsModalOpen(true);
                      }}
                      className={`bg-[#05445E] px-1 md:px-2 py-1 lg:py-2 text-white text-sm rounded-md hover:bg-[#05445E]/80 mt-[6px] ${
                        !selectedDay || holiday || facilityByRoomId === "8"
                          ? "cursor-not-allowed"
                          : ""
                      }`}
                    >
                      Book Now
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
                      <>
                        <label className="mb-4 text-[#05445E] text-sm">
                          {dayjs(selectedDate).format("dddd, MMMM D")}
                        </label>
                        <div className="border-b-[1px] border-[#05445E] w-full mb-4"></div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Box */}
              {isModalOpen &&
                selectedDay &&
                !holiday &&
                facilityByRoomId !== "8" && (
                  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md  rounded-lg shadow-lg relative">
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
                        selectedTime={selectedTime}
                        changeDate={formatDate(selectedDate)}
                      />
                    </div>
                  </div>
                )}

              <div
                className={
                  !selectedDay ||
                  holiday ||
                  selectedDate.isBefore(next_day, "day")
                    ? "date-list-container unavailable"
                    : "date-list-container"
                }
              >
                <DateList
                  changeRoom={facilityByRoomId}
                  changeDate={formatDate(selectedDate)}
                  selectedDay={selectedDay}
                  holiday={holiday}
                  current_date={formatDate(current_date)}
                  current_time={current_time}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookingDate;
