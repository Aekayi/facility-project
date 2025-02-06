import React from "react";
import SettingBox from "../../components/SettingBox";
import {
  useFacilitynamesQuery,
  useFacilitiesQuery,
} from "../../apps/features/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import LocalIcon from "../../assets/icons";

const MeetingRoom = () => {
  const { facilityName } = useParams();
  const navigate = useNavigate();
  const {
    data: facilityData,
    isLoading,
    isError,
    error,
  } = useFacilitynamesQuery(facilityName);
  console.log(facilityData, "facilitydata");
  const { data: facilities } = useFacilitiesQuery();
  const facilityNames = facilities?.data?.map((facility) => facility.name);
  console.log("facilityNames", facilityNames);

  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch Meetingrooms"}</div>;
  }
  const handleBack = () => {
    navigate(`/`);
  };

  return (
    <div className="h-full min-h-screen w-full max-w-md bg-white">
      {isLoading ? (
        <div className="w-full max-w-md bg-white min-h-screen flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="m-4">
          <div className="container flex justify-between items-center py-3 px-4 mb-4 border border-gray-300 shadow rounded">
            <button className="back-con" onClick={handleBack}>
              <img
                src={LocalIcon.BackColor}
                style={{ width: "11px" }}
                title="back"
                alt="back"
              />
            </button>
            <h1 className="text-xl font-bold text-[#05445E]">
              {facilityName} Page
            </h1>
            <SettingBox />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {facilityData?.data?.map((facility) => (
              <button
                className="type-card"
                key={facility.id}
                onClick={() => navigate(`/${facilityName}/${facility.id}`)}
              >
                <div className="bg-white shadow rounded p-2 flex flex-row justify-start gap-4 border border-gray-300 w-full h-[120px]">
                  <img
                    src={facility.icon}
                    alt="name"
                    className="w-[150px] h-[100px] rounded-md object-cover "
                  />

                  <div className="flex flex-col items-start mt-2">
                    <h3 className="text-lg font-normal text-[#05445E] ">
                      {facility.name}
                    </h3>
                    {Object.keys(facility?.currentBooking).length === 0 ? (
                      <p className="available text-green-600">Available Now</p>
                    ) : (
                      <p className="occupied text-red-600 text-start">
                        Occupied ({facility?.currentBooking.startTime} to{" "}
                        {facility?.currentBooking.endTime}){" "}
                      </p>
                    )}
                    {facility?.upcoming && (
                      <p className="text-blue-900">
                        upcoming booking at {facility?.upcoming}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingRoom;
