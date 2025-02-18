import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalIcon from "../../assets/icons";
import {
  useGetBookedSlotsQuery,
  useFacilitynamesQuery,
} from "../../apps/features/apiSlice";
import dayjs from "dayjs";
import { use } from "react";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import weblogo from "../../assets/weblogo.png";
import calendar from "../../assets/calendar.png";
import location from "../../assets/map-route.png";
import timeList from "../../assets/public/time.json";
import BookedListByFleet from "../../components/BookedListForManager/BookedListByFleet";

dayjs.extend(isSameOrAfter);

function BookingsForApprove() {
  const navigate = useNavigate();
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  let current_date = formatDate(new Date());

  const timeArr = timeList?.detailTime;
  console.log(timeArr, "time");

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
    <>
      <div className="flex flex-col h-screen w-full">
        <div className="flex justify-start items-center space-x-4 px-4 py-4 bg-white shadow-lg">
          <img src={weblogo} alt="" srcset="" width="110px" height="39.93px" />
          <h3 className="text-2xl font-semibold">Booking Management</h3>
        </div>
        <div className="flex-1 flex">
          {/* Sidebar */}
          <aside className="w-[80px] bg-[#B6D26F] text-white p-4">
            <nav className="space-y-8 mt-10">
              <a href="#" className="block rounded">
                <div className="p-2 rounded-md hover:bg-white hover:shadow-md transition">
                  <img
                    src={calendar}
                    alt=""
                    width="40"
                    height="40"
                    className="rounded-md"
                  />
                </div>
              </a>
              <a href="#" className="block rounded">
                <div className="p-2 rounded-md hover:bg-white hover:shadow-md transition">
                  <img
                    src={location}
                    alt=""
                    width="40"
                    height="40"
                    className="rounded-md"
                  />
                </div>
              </a>
            </nav>
          </aside>

          {/* Page Content */}
          <div className="flex justify-center items-center p-4 w-full">
            <div className="grid grid-cols-[30%_70%] gap-2 w-full">
              {/* Left Column */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <input
                    type="text"
                    value="Ko Pyae Phyo Fleet"
                    // onChange={(e) => setTitle(e.target.value)}
                    className="border-b border-gray-300 w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[20px]"
                  />
                </div>
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <img src={LocalIcon.Title} alt="" />
                  <input
                    type="text"
                    value="Meeting Title"
                    className="w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[14px]"
                  />
                </div>
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <img src={LocalIcon.Profile} alt="" />
                  <input
                    type="text"
                    value="Booked By- Min Min"
                    className="w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[14px]"
                  />
                </div>
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <img src={LocalIcon.Location} alt="" />
                  <input
                    type="text"
                    value="Location Name"
                    className="w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[14px]"
                  />
                </div>
                <div className="mb-4 flex flex-row items-start space-x-2">
                  <img src={LocalIcon.People} alt="" />
                  <ul className="text-[14px]">
                    <li>name 1</li>
                    <li>name 2</li>
                    <li>name 3</li>
                    <li>name 4</li>
                  </ul>
                </div>
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <img src={LocalIcon.Note} alt="" />
                  <input
                    type="text"
                    value="To Meet with client"
                    className="w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[14px]"
                  />
                </div>
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <img src={LocalIcon.Calendar} alt="" />
                  <input
                    type="date"
                    className="appearance-none bg-white border border-gray-300 text-gray-500 rounded-md py-[6px] pl-3 pr-10 focus:outline-none cursor-pointer text-[13px]"
                  />
                </div>
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <img src={LocalIcon.Time} alt="" />
                  <div className="flex space-x-4">
                    <input
                      type="time"
                      value="09:00"
                      className="border border-gray-300 rounded w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[13px]"
                    />
                    <input
                      type="time"
                      value="10:00"
                      className="border border-gray-300 rounded w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[13px]"
                    />
                  </div>
                </div>
                <div className="mb-4 flex flex-row items-start space-x-2">
                  <img src={LocalIcon.CarIcon} alt="" />
                  <div className="flex flex-col">
                    <label htmlFor="cars" className="text-[16px]">
                      Ferry
                    </label>
                    <select className="border border-gray-300 rounded-lg focus:outline-none text-gray-500 placeholder:text-gray-400 px-4 py-[6px] pr-4 mt-2 text-[12px]">
                      <option value="">Ko Pyae Phyo Fleet</option>
                      <option value="">Fleet 2</option>
                      <option value="">Taxi</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4 flex justify-between items-center space-x-2">
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      id="departure"
                      className="w-4 h-4 rounded focus:outline-none cursor-pointer"
                    />
                    <label
                      htmlFor="departure"
                      className="text-gray-700 cursor-pointer text-[13px]"
                    >
                      Departure
                    </label>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <label
                      htmlFor="departure-duration"
                      className="text-gray-700 cursor-pointer text-[13px]"
                    >
                      Duration
                    </label>
                    <select
                      name="departure-duration"
                      value=""
                      className="custom-dropdown overflow-auto border-[1px] border-gray-300 bg-white outline-none rounded-md p-1 focus:outline-none text-gray-500 text-[13px]"
                    >
                      {timeArr?.map((time, index) => (
                        <option
                          value={`${time.time}:${time.minute} ${time.period}`}
                          key={index}
                        >
                          {time.time}:{time.minute} {time.period}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4 flex justify-between items-center space-x-2">
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      id="arrival"
                      className="w-4 h-4 rounded focus:outline-none cursor-pointer"
                    />
                    <label
                      htmlFor="departure"
                      className="text-gray-700 cursor-pointer text-[13px]"
                    >
                      Arrival
                    </label>
                  </div>
                  <div className="flex justify-start items-center gap-2">
                    <label
                      htmlFor="arrival-duration"
                      className="text-gray-700 cursor-pointer text-[13px]"
                    >
                      Duration
                    </label>
                    <select
                      name="arrival-duration"
                      value=""
                      className="custom-dropdown overflow-auto border-[1px] border-gray-300 bg-white outline-none rounded-md p-1 focus:outline-none text-gray-500 text-[13px]"
                    >
                      {timeArr?.map((time, index) => (
                        <option
                          value={`${time.time}:${time.minute} ${time.period}`}
                          key={index}
                        >
                          {time.time}:{time.minute} {time.period}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4 flex justify-between items-center space-x-2">
                  <div className="flex justify-start items-center gap-2">
                    <input
                      type="checkbox"
                      id="arrival"
                      className="w-4 h-4 rounded focus:outline-none cursor-pointer"
                    />
                    <label
                      htmlFor="departure"
                      className="text-gray-700 cursor-pointer text-[13px]"
                    >
                      Approve
                    </label>
                  </div>
                </div>
                <div className="mb-4 flex flex-row items-center space-x-2">
                  <img src={LocalIcon.Edit2} alt="" />
                  <textarea
                    type="textarea"
                    value="Note"
                    // onChange={(e) => setNote(e.target.value)}
                    className="border border-gray-300 rounded-md w-full focus:outline-none p-2 text-gray-700 text-[13px]"
                  >
                    Remark
                  </textarea>
                </div>
                <div className="mb-4 flex flex-row justify-between items-center gap-2">
                  <button className="bg-[#FF7878] px-[10px] py-2 w-full rounded-[6px]">
                    Delete
                  </button>
                  <button className="bg-[#86E4AE] px-[10px] py-2 w-full rounded-[6px]">
                    Save
                  </button>
                </div>
              </div>

              {/* Right Column */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <BookedListByFleet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingsForApprove;
