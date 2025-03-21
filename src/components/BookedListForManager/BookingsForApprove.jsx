import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {
  useFacilitynamesQuery,
  useFleetBookedListByDateQuery,
  useUsersQuery,
} from "../../apps/features/apiSlice";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weblogo from "../../assets/weblogo.png";
import calendar from "../../assets/calendar.png";
import location from "../../assets/map-route.png";
import EditBookingForFleet from "./EditBookingForFleet";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IconButton, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TimeListForFleet from "./TimeListForFleet";
import LocalIcon from "../../assets/icons";
import { useSelector } from "react-redux";
import ProfileSetting from "./ProfileSetting";
import Loading from "../loading/Loading";
import { ref } from "yup";

dayjs.extend(isSameOrAfter);

function BookingsForApprove() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date")
      ? dayjs(searchParams.get("date"))
      : dayjs(new Date())
  );
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookedListByDate, setBookedListByDate] = useState(
    dayjs(selectedDate).format("YYYY-MM-DD")
  );
  const [loading, setLoading] = useState(false);
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setBookedListByDate(formatDate(newDate));
  };
  const handlePrevDay = () => {
    setSelectedDate((prev) => prev.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => prev.add(1, "day"));
  };
  let current_date = formatDate(new Date());
  const current_time = Number(dayjs().format("HH"));

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  const {
    data: facilitynames,
    isLoading: facilityLoading,
    isError: facilityError,
  } = useFacilitynamesQuery("Fleet");
  console.log(facilitynames, "facilityname");

  const {
    data: FleetBookedList,
    isLoading,
    isError,
  } = useFleetBookedListByDateQuery({
    date: formatDate(selectedDate),
  });

  const loginUser = useSelector((state) => state.auth.role);
  const username = loginUser[0]?.name;

  useEffect(() => {
    console.log("Fetching data for date:", formatDate(selectedDate));
    setBookedListByDate(formatDate(selectedDate));
  }, [selectedDate]);

  const bookedList = Array.isArray(FleetBookedList)
    ? FleetBookedList.flatMap((fleet) => fleet.data || [])
    : [];

  const handleBookingSelect = (booking) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSelectedBooking(booking);
    }, 1000);
  };
  const handleLogoClick = () => {
    navigate("/");
  };
  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center px-4 bg-white shadow-lg">
          <div className="flex justify-start items-center gap-2">
            <img
              src={weblogo}
              alt=""
              srcset=""
              width="110px"
              height="39.93px"
              onClick={handleLogoClick}
              className="cursor-pointer"
            />
            <h3 className="text-xl font-semibold">Booking Management</h3>
          </div>
          <div className="flex justify-start items-center gap-2">
            <span>{username}</span>
            <ProfileSetting />
          </div>
        </div>
        <div className="flex-1 flex">
          {/* Sidebar */}
          <aside className="w-[80px] bg-[#B6D26F] text-white p-4">
            <nav className="space-y-8 mt-10">
              <NavLink
                to="/approver-records"
                className={({ isActive }) =>
                  `block rounded-lg p-2 transition ${
                    isActive
                      ? "bg-white shadow-md"
                      : "hover:bg-white hover:shadow-md"
                  }`
                }
              >
                <img
                  src={calendar}
                  alt=""
                  width="40"
                  height="40"
                  className="rounded-md"
                />
              </NavLink>
              <NavLink
                to="/reservation-map"
                className={({ isActive }) =>
                  `block rounded-lg p-2 transition ${
                    isActive
                      ? "bg-white shadow-md"
                      : "hover:bg-white hover:shadow-md"
                  }`
                }
              >
                <img
                  src={location}
                  alt=""
                  width="40"
                  height="40"
                  className="rounded-md"
                />
              </NavLink>
            </nav>
          </aside>

          {/* Page Content */}
          <div className="flex justify-center items-center p-4 w-full">
            <div className="grid grid-cols-[30%_70%] gap-2 w-full">
              {/* Left Column */}
              <div className="bg-white p-4 rounded-lg shadow-lg">
                {loading ? (
                  <div className="flex justify-center items-center h-screen">
                    <Loading />
                  </div>
                ) : selectedBooking ? (
                  <EditBookingForFleet
                    fleetBookedList={bookedList || []}
                    selectedBooking={selectedBooking}
                    setSelectedBooking={setSelectedBooking}
                  />
                ) : (
                  <>
                    <div className="flex flex-col justify-start items-start">
                      <span className="text-[20px] font-normal">Manage</span>
                      <span className="text-[30px] font-bold">Booking</span>
                    </div>
                    <div className="flex flex-col justify-center items-center h-screen space-y-4">
                      <img
                        src={LocalIcon.Group}
                        alt="Group"
                        width={"357.16px"}
                        height={"297.45px"}
                      />
                      <span className="flex justify-center items-center w-full text-center text-[16px]">
                        Choose the booking you wish to manage
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column */}
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-row justify-start items-center w-full h-auto gap-2">
                  <img
                    src={LocalIcon.Calendar}
                    alt="Calendar"
                    width={40}
                    height={40}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack direction="row" alignItems="center">
                      <DatePicker
                        value={selectedDate}
                        onChange={handleDateChange}
                        format="DD, MMM YYYY"
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          // "& .MuiInputAdornment-root": {
                          //   display: "none",
                          // },
                          "& .MuiOutlinedInput-root": {
                            padding: "2px",
                            width: "160px",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiInputBase-root": {
                            height: "20px",
                            minWidth: "100px",
                          },
                        }}
                      />
                      <IconButton onClick={handlePrevDay}>
                        <ChevronLeft />
                      </IconButton>
                      <IconButton onClick={handleNextDay}>
                        <ChevronRight />
                      </IconButton>
                    </Stack>
                  </LocalizationProvider>
                </div>
                <div className="border-t border-gray-800 mb-4"></div>

                <div className="h-screen overflow-y-auto">
                  <TimeListForFleet
                    bookedList={FleetBookedList || []}
                    onBookingSelect={handleBookingSelect}
                    changeDate={bookedListByDate}
                    current_date={current_date}
                    current_time={current_time}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingsForApprove;
