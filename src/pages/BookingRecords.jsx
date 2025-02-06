import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LocalIcon from "../assets/icons";
import { useBookedListByUserQuery } from "../apps/features/apiSlice";
import dayjs from "dayjs";
import BookedRecord from "../components/BookedRecord/BookedRecord";
import Loading from "../components/loading/Loading";

function BookingRecords() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  let current_date = formatDate(new Date());
  const user = localStorage.getItem("persist:auth");
  const userData = JSON.parse(user);
  const id = userData?.id;
  console.log(id, "userdata");

  const {
    data: bookedListByUser,
    isLoading,
    isError,
  } = useBookedListByUserQuery({
    userId: id,
  });
  const bookedList = bookedListByUser?.data;
  const currentBookedList = bookedList
    ? bookedList?.filter((list) => list?.book_date === current_date)
    : [];
  console.log(currentBookedList, "curr");
  const upcomingBookedList = bookedList
    ? bookedList?.filter((list) => list?.book_date !== current_date)
    : [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 1 second
    }, 1000);
  }, []);

  return (
    <div className="h-full min-h-screen w-full max-w-md bg-white">
      {loading ? (
        <div className="w-full max-w-md bg-white min-h-screen flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center py-4 px-3">
            <h1 className="text-xl font-bold text-[#05445e]">
              Booking Records
            </h1>
            <button onClick={() => navigate("/")}>
              <img className="w-10 h-10" src={LocalIcon.Home} />
            </button>
          </div>
          {bookedList?.length > 0 ? (
            <>
              <div>
                <div className="py-4 px-3">
                  <div className="flex justify-between items-center bg-[#05445e] px-3 py-2 text-white">
                    Today Bookings <p>{currentBookedList.length}</p>
                  </div>
                </div>
                {currentBookedList?.length > 0 ? (
                  <ul>
                    {currentBookedList?.map((list, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          navigate(
                            `/${list?.facility_category?.name}/${list?.facility_id?.id}`
                          )
                        }
                        className="cursor-pointer"
                      >
                        <BookedRecord
                          title={list?.title}
                          icon={list?.facility_category?.icon}
                          needLocation={list?.facility_category?.needLocation}
                          name={list?.facility_id?.name}
                          book_date={list?.book_date}
                          startTime={list?.start_time}
                          endTime={list?.end_time}
                          status={list?.status}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex justify-center items-center">
                    You have no booking.
                  </div>
                )}
              </div>
              <div>
                <div className="py-4 px-3">
                  <div className="flex justify-between items-center bg-[#189ab4] px-3 py-2 text-white">
                    Upcoming Bookings <p>{upcomingBookedList.length}</p>
                  </div>
                </div>
                {upcomingBookedList?.length > 0 ? (
                  <ul>
                    {upcomingBookedList?.map((list, index) => (
                      <li
                        key={index}
                        onClick={() =>
                          navigate(
                            `/${list?.facility_category?.name}/${list?.facility_id?.id}`
                          )
                        }
                        className="cursor-pointer"
                      >
                        <BookedRecord
                          title={list?.title}
                          icon={list?.facility_category?.icon}
                          needLocation={list?.facility_category?.needLocation}
                          name={list?.facility_id?.name}
                          book_date={list?.book_date}
                          startTime={list?.start_time}
                          endTime={list?.end_time}
                          status={list?.status}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex justify-center items-center">
                    You have no booking.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              className="flex flex-col h-screen
         justify-center items-center"
            >
              <h3 className="text-lg font-bold text-[#05445e] mb-6">
                You have no booking.
              </h3>
              <button
                className="px-3 py-1 bg-[#05445e] text-white rounded-sm"
                onClick={() => navigate("/")}
              >
                Book Now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingRecords;
