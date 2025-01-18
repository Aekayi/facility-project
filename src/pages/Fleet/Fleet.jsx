// import React from "react";
// import {
//   useFleetQuery,
//   useFacilitiesQuery,
// } from "../../apps/features/apiSlice";
// import { useNavigate } from "react-router-dom";
// import Loading from "../../components/loading/Loading";
// import SettingBox from "../../components/SettingBox";
// import LocalIcon from "../../assets/icons";

// const Fleet = () => {
//   const navigate = useNavigate();
//   const { data: fleetData, isLoading, isError, error } = useFleetQuery();
//   const { data: facilities } = useFacilitiesQuery();
//   const facilityNames = facilities?.data?.map((facility) => facility.name);
//   if (isLoading) {
//     return <Loading />;
//   }

//   if (isError) {
//     return <div>Error: {error?.message || "Failed to fetch fleet"}</div>;
//   }
//   const handleBack = () => {
//     navigate(`/`);
//   };
//   return (
//     <div className=" h-full w-2/3 max-w-md bg-white  ">
//       <div className="m-4">
//         <div className="container flex justify-between items-center py-3 px-4 mb-4 border  border-gray-300 shadow rounded">
//           <button className="back-con" onClick={handleBack}>
//             <img
//               src={LocalIcon.BackColor}
//               style={{ width: "11px" }}
//               title="back"
//               alt="back"
//             />
//           </button>
//           <h1 className="text-xl font-semibold text-blue-500">Fleet Page</h1>
//           <SettingBox />
//         </div>
//         <div className="grid grid-cols-1 gap-4">
//           {fleetData?.data?.map((fleet) => (
//             <button
//               className="type-card"
//               key={fleet.id}
//               onClick={() => navigate(`/${facilityNames[1]}/${fleet.id}`)}
//             >
//               <div className="bg-white shadow rounded p-4 flex flex-row  border border-gray-300">
//                 <img
//                   src={fleet.icon}
//                   alt="name"
//                   className="w-24 h-23 rounded-md object-cover mb-4 me-4"
//                 />
//                 <div className="flex flex-col items-start">
//                   <h3 className="text-lg font-semibold text-blue-500">
//                     {fleet.name}
//                   </h3>
//                   {Object.keys(fleet?.currentBooking).length === 0 ? (
//                     <p className="available text-green-600">Availabel Now</p>
//                   ) : (
//                     <p className="occupied text-red-600">
//                       Occupied ({fleet?.currentBooking.startTime} to{" "}
//                       {fleet?.currentBooking.endTime}){" "}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Fleet;
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

// import Button from '../../components/button';

// Style

const Fleet = () => {
  const navigate = useNavigate();

  const cars = ["3A", "3B", "3C", "6A", "6B", "6C"];

  return (
    <div className="layout">
      <div className="container">
        <div className="car-page">
          <h2>Car Booking Page</h2>
          <div className="car-layout">
            {cars?.map((car, index) => (
              <button
                key={index}
                className={"car-btn"}
                onClick={() => navigate(`/fleet/${car}`)}
              >
                {car}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fleet;
