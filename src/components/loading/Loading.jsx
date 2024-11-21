import React from "react";
import LocalIcon from "../../assets/icons";

export const Loading = () => {
  return (
    <div className="loading-container">
      <img src={LocalIcon.Loading} alt="Loading" title="Loading" />
    </div>
  );
};

// export const RoomLoading = ({ design }) => {
//   return (
//     <div className={design ? design : "facility-loading"}>
//       <img src={LocalIcon.Loading} alt="Loading" title="Loading" />
//     </div>
//   );
// };

// export const BookedLoading = ({}) => {
//   return (
//     <div className="book-loading">
//       <img src={LocalIcon.Loading} alt="Loading" title="Loading" />
//     </div>
//   );
// };
