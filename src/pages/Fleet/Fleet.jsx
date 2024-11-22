import React from "react";
import { useFleetQuery } from "../../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import SettingBox from "../../components/SettingBox";
import LocalIcon from "../../assets/icons";

const Fleet = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useFleetQuery();
  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch fleet"}</div>;
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
          <h1 className="text-xl font-semibold text-blue-500">Fleet Page</h1>
          <SettingBox />
        </div>
        <div className="grid grid-cols-1 gap-4">
          {data?.data?.map((fleet) => (
            <button
              className="type-card"
              key={fleet.id}
              onClick={() => navigate(`/Fleet/${fleet.id}`)}
            >
              <div className="bg-white shadow rounded p-4 flex flex-row  border border-gray-300">
                <img
                  src={fleet.icon}
                  alt="name"
                  className="w-24 h-23 rounded-md object-cover mb-4 me-4"
                />
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-semibold text-blue-500">
                    {fleet.name}
                  </h3>
                  {Object.keys(fleet?.currentBooking).length === 0 ? (
                    <p className="available text-green-600">Availabel Now</p>
                  ) : (
                    <p className="occupied text-red-600">
                      Occupied ({fleet?.currentBooking.startTime} to{" "}
                      {fleet?.currentBooking.endTime}){" "}
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

export default Fleet;
