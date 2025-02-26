import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
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
import TimeListForFleet from "./TimeListForFleet";
import LocalIcon from "../../assets/icons";

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
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setBookedListByDate(formatDate(newDate));
  };
  let current_date = formatDate(new Date());
  console.log(current_date, "current_date");
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

  const {
    data: users,
    isLoading: userLoading,
    isError: userError,
  } = useUsersQuery("users");
  console.log(
    users?.data?.map((user) => user?.id),
    "users"
  );

  useEffect(() => {
    console.log("Fetching data for date:", formatDate(selectedDate));
    setBookedListByDate(formatDate(selectedDate));
  }, [selectedDate]);

  const bookedList = Array.isArray(FleetBookedList)
    ? FleetBookedList.flatMap((fleet) => fleet.data || [])
    : [];

  const handleBookingSelect = (booking) => {
    setSelectedBooking(booking);
  };
  return (
    <>
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center space-x-4 px-4 py-4 bg-white shadow-lg">
          <div className="flex justify-start items-center">
            <img
              src={weblogo}
              alt=""
              srcset=""
              width="110px"
              height="39.93px"
            />
            <h3 className="text-xl font-semibold">Booking Management</h3>
          </div>
          <div className="flex justify-start items-center">
            <span>U Aung</span>
            <img
              src={LocalIcon.ManagerProfile}
              alt=""
              className="cursor-pointer"
            />
          </div>
        </div>
        <div className="flex-1 flex">
          {/* Sidebar */}
          <aside className="w-[80px] bg-[#B6D26F] text-white p-4">
            <nav className="space-y-8 mt-10">
              <NavLink
                to="/approver-records"
                className={({ isActive }) =>
                  `block rounded p-2 transition ${
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
                  `block rounded p-2 transition ${
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
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <EditBookingForFleet
                  fleetBookedList={bookedList || []}
                  selectedBooking={selectedBooking}
                  setSelectedBooking={setSelectedBooking}
                />
              </div>

              {/* Right Column */}
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex flex-row justify-start items-center w-full h-auto mb-4 gap-2">
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={["DatePicker"]}
                      className="h-[20px]"
                    >
                      <DatePicker
                        label="Choose Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full"
                      />
                    </DemoContainer>
                  </LocalizationProvider> */}
                  <img
                    src={LocalIcon.Calendar}
                    alt="Calendar"
                    width={40}
                    height={40}
                  />
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="d, MMM yyyy"
                    customInput={
                      <input className="bg-transparent outline-none cursor-pointer" />
                    }
                    popperClassName="custom-datepicker"
                  />
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
