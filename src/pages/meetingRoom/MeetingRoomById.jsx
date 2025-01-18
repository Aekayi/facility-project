import React from "react";
import { useFacilityidQuery } from "../../apps/features/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import LocalIcon from "../../assets/icons";
import BookingDate from "../booking-date/bookingDate";

const MeetingRoomById = (roomId, bookedDate) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError, error } = useFacilityidQuery(id);
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch Meetingrooms"}</div>;
  }
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className=" h-full w-2/3 max-w-md bg-white  ">
      <div className="m-4 relative">
        <div className="container flex justify-between bg-black bg-opacity-50 p-2 absolute rounded-t-md">
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
    </div>
  );
};

export default MeetingRoomById;
