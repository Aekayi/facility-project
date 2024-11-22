import React from "react";
import localIcon from "../../assets/icons";

const Loading = () => {
  return (
    <div className=" h-full w-2/3 max-w-md bg-white flex justify-center items-center ">
      <img src={localIcon.Loading} alt="Loading..." className="w-1/4" />
    </div>
  );
};

export default Loading;
