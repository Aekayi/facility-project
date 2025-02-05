import React from "react";
import { useFacilityidQuery } from "../../apps/features/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import LocalIcon from "../../assets/icons";
import BookingDate from "../booking-date/BookingDate";

const MeetingRoomById = (roomId, bookedDate) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError, error } = useFacilityidQuery(id);

  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch Meetingrooms"}</div>;
  }
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <>
      <div className="w-full max-w-md bg-white fixed ">
        {isLoading ? (
          <div className=" max-w-md bg-white min-h-screen flex justify-center items-center ">
            <Loading />
          </div>
        ) : (
          <>
            <div className="m-4">
              <div className="container flex justify-between bg-black bg-opacity-50 p-2  rounded-t-md">
                <button className="back-con" onClick={handleBack}>
                  <img
                    src={LocalIcon.BackColor}
                    style={{ width: "11px" }}
                    title="back"
                    alt="back"
                  />
                </button>
                <div className="text-xl font-semibold  text-center text-white">
                  {data?.name}
                </div>
              </div>
              <img
                src={data?.icon}
                alt="name"
                className="w-full h-[200px] rounded-md object-cover mb-4 me-4"
              />
            </div>
            <BookingDate roomId={roomId} bookedDate={bookedDate} />
          </>
        )}
      </div>
    </>
  );
};

export default MeetingRoomById;
