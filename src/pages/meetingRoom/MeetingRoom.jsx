import React from "react";
import SettingBox from "../../components/SettingBox";
import { useMeetingroomsQuery } from "../../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import LocalIcon from "../../assets/icons";

const MeetingRoom = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useMeetingroomsQuery();
  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch Meetingrooms"}</div>;
  }
  const handleBack = () => {
    navigate(`/`);
  };
  return (
    <div className=" h-full w-2/3 max-w-md bg-white  ">
      <div className="m-4">
        <div className="container flex justify-between items-center py-3 px-4 mb-4 border  border-gray-300 shadow rounded">
          <button className="back-con" onClick={handleBack}>
            <img
              src={LocalIcon.BackColor}
              style={{ width: "11px" }}
              title="back"
              alt="back"
            />
          </button>
          <h1 className="text-xl font-semibold text-blue-500">
            Meeting Room Page
          </h1>
          <SettingBox />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {data?.data?.map((meeting) => (
            <button
              className="type-card"
              key={meeting.id}
              onClick={() => navigate(`/Meeting Room/${meeting.id}`)}
            >
              <div className="bg-white shadow rounded p-4 flex flex-row  border border-gray-300">
                <img
                  src={meeting.icon}
                  alt="name"
                  className="w-24 h-23 rounded-md object-cover mb-4 me-4"
                />

                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-semibold text-blue-500 ">
                    {meeting.name}
                  </h3>
                  {Object.keys(meeting?.currentBooking).length === 0 ? (
                    <p className="available text-green-600">Availabel Now</p>
                  ) : (
                    <p className="occupied text-red-600">
                      Occupied ({meeting?.currentBooking.startTime} to{" "}
                      {meeting?.currentBooking.endTime}){" "}
                    </p>
                  )}
                  {meeting?.upcoming && (
                    <p className="text-blue-900">
                      upcoming booking at {meeting?.upcoming}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom;
