import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../apps/features/AuthSlice";
import { persistor } from "../apps/store";

const SettingBox = () => {
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
        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#05445E]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-[#05445E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
        {isOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-custom z-10 p-2"
            ref={menuRef}
          >
            <div
              className="px-2 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-left"
              onClick={() => {
                setIsOpen(false);
                navigate("/records");
              }}
            >
              My Bookings
            </div>
            <div
              className="px-2 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-left"
              onClick={() => {
                setIsOpen(false);
                navigate("/change-password");
              }}
            >
              Change Password
            </div>
            {isApprover && (
              <div
                className="px-2 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-left"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/approver-records");
                }}
              >
                Manage Fleet Booking
              </div>
            )}
            <div
              className="px-2 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer text-left"
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

export default SettingBox;
