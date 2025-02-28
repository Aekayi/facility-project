import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  useFacilitynamesQuery,
  useFleetBookedListByDateQuery,
} from "../../apps/features/apiSlice";
import dayjs from "dayjs";
import { use } from "react";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weblogo from "../../assets/weblogo.png";
import calendar from "../../assets/calendar.png";
import location from "../../assets/map-route.png";
import ListsInMap from "../../components/BookedListForManager/ListsInMap";
import ProfileSetting from "../../components/BookedListForManager/ProfileSetting";
import { useSelector } from "react-redux";

dayjs.extend(isSameOrAfter);

function ReservationMap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mapLoaded, setMapLoaded] = useState(false);
  const containerStyle = {
    width: "100%",
    height: "250px",
  };

  const center = {
    lat: 16.8409, // Default latitude (Yangon, Myanmar)
    lng: 96.1735, // Default longitude
  };
  const [selectedLocation, setSelectedLocation] = useState(center);

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

  useEffect(() => {
    console.log("Fetching data for date:", formatDate(selectedDate));
    setBookedListByDate(formatDate(selectedDate));
  }, [selectedDate]);

  const bookedList = Array.isArray(FleetBookedList)
    ? FleetBookedList.flatMap((fleet) => fleet.data || [])
    : [];

  const loginUser = useSelector((state) => state.auth.role);
  console.log(loginUser, "loginUser");
  const username = loginUser[0]?.name;

  return (
    <>
      <div className="flex flex-col h-full min-h-screen w-full">
        <div className="flex justify-between items-center px-4 bg-white shadow-lg">
          <div className="flex justify-start items-center gap-2">
            <img
              src={weblogo}
              alt=""
              srcset=""
              width="110px"
              height="39.93px"
            />
            <h3 className="text-xl font-semibold">Reservation In Map</h3>
          </div>
          <div className="flex justify-start items-center gap-2">
            <span>{username}</span>
            <ProfileSetting />
          </div>
        </div>
        <div className="flex-1 flex">
          {/* Sidebar */}
          <aside className="w-[80px] bg-[#B6D26F] text-white p-4 h-[1050px] min-h-screen">
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
          <div className="flex justify-center items-center px-4 w-full">
            <ListsInMap />
          </div>
        </div>
      </div>
    </>
  );
}

export default ReservationMap;
