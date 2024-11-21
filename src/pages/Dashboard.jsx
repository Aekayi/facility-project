import React from "react";
import { useFacilitiesQuery } from "../apps/features/apiSlice";
import { useNavigate } from "react-router-dom";
import SettingBox from "../components/SettingBox";

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useFacilitiesQuery();
  // console.log(data);
  if (isLoading) {
    <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch facilities"}</div>;
  }
  return (
    <div className=" h-full w-2/3 max-w-md bg-white  ">
      <div className="m-4">
        <div className="container flex justify-between items-center py-3 px-4 mb-4 border  border-gray-300 shadow rounded">
          <h1 className="text-xl font-semibold text-blue-500">
            Types of Facility
          </h1>
          <SettingBox />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data?.data?.map((facility) => (
            <button
              className="type-card"
              key={facility.id}
              onClick={() => navigate(`/${facility.name}`)}
            >
              <div className="bg-white shadow rounded p-4 flex flex-col items-center border border-gray-300">
                <img
                  src={facility.image}
                  alt="name"
                  className="w-24 h-24 object-cover mb-4"
                />
                <h3 className="text-lg font-semibold">{facility.name}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
