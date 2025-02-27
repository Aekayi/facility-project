import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../../apps/features/AuthSlice";
import { persistor } from "../../apps/store";
import LocalIcon from "../../assets/icons";

const ProfileSetting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedIn = useSelector((state) =>
    state.auth.role.map((role) => role.name)
  );
  console.log(loggedIn, "loggedIn");
  const isApprover = loggedIn.includes("Approver");
  console.log(isApprover, "isApprover");

  const handleLogout = () => {
    dispatch(clearCredentials());
    persistor.purge();
    navigate("/login");
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50">
      <button
        className="p-2 rounded-md focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          src={LocalIcon.ManagerProfile}
          alt=""
          className="cursor-pointer"
          width={40}
          height={40}
        />
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
            ref={menuRef}
          >
            <div
              className="px-2 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                navigate(`/`);
              }}
            >
              Home
            </div>
            <div
              className="px-2 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
            >
              Logout
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default ProfileSetting;
