import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import EditModal from "./EditModal";
import { Box, Modal } from "@mui/material";
import { useDeleteBookingMutation } from "../../apps/features/apiSlice";

const BookingModal = ({ booking, onClose }) => {
  const loggedInUserId = useSelector((state) => state.auth.id);
  const isOwner = booking?.book_by?.id === loggedInUserId;
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteComfirm, setDeleteComfirm] = useState(false);
  const [popUpId, setPopUpId] = useState();

  const [deleteBooking, { data, isError, isLoading }] =
    useDeleteBookingMutation();

  const handleOutsideClick = useCallback(
    (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        if (!showEditModal) {
          onClose();
        }
      }
    },
    [onClose, showEditModal]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  if (!booking) return null;

  const participants = booking.participants || [];
  const guests = booking.guests || [];
  console.log("bookingidddd", booking.id);

  const handleDelete = async () => {
    try {
      await deleteBooking(booking.id).unwrap();
      console.log("Booking deleted successfully");
      setDeleteComfirm(false); // Close delete confirmation
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  return (
    <>
      <div
        className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleOutsideClick}
      >
        <div
          className="bg-white rounded-lg shadow-lg w-96 p-6"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          {isOwner && (
            <div className="flex justify-end">
              <button
                className="px-4 py-2 "
                onClick={() => {
                  setTimeout(() => {
                    setShowEditModal(true);
                  }, 0);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-blue-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>

              <button
                className="px-4 py-2 "
                onClick={() => setDeleteComfirm(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          )}

          {deleteComfirm && (
            <div className="mt-4">
              <p>Are you sure you want to delete this booking?</p>
              <div className="flex justify-end gap-4 mt-2">
                <button
                  className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                  onClick={() => setDeleteComfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          )}
          {showEditModal && (
            <EditModal
              popUpId={popUpId}
              booking={booking}
              onClose={() => setShowEditModal(false)}
            />
          )}
          {!deleteComfirm && (
            <>
              <h2 className="text-2xl font-semibold mb-2">{booking.title}</h2>
              <p className="mb-4">
                {booking.start_time} to {booking.end_time}
              </p>
              {booking?.note !== null && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Descriptions</h2>
                  <p className="mb-4">{booking?.note}</p>
                </div>
              )}
              {booking?.participants && booking.participants.length > 0 && (
                <div>
                  <p className="text-semibold">{participants.length} Members</p>
                  <div className="flex flex-wrap gap-2 border border-gray-300 p-3 rounded-md bg-gray-50 max-h-40 overflow-y-scroll mb-2">
                    {participants.map((member, index) => (
                      <span
                        key={index}
                        className="bg-indigo-400 text-white px-3 py-1 rounded-full text-sm shadow-md"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {booking?.guests && booking.guests.length > 0 && (
                <div>
                  <p className="text-semibold">{guests.length} Guests</p>
                  <div className="flex flex-wrap gap-2 border border-gray-300 p-3 rounded-md bg-gray-50 max-h-40 overflow-y-scroll mb-2">
                    {guests.map((member, index) => (
                      <span
                        key={index}
                        className="bg-indigo-400 text-white px-3 py-1 rounded-full text-sm shadow-md"
                      >
                        {member.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* {booking?.approved_by !== null && (
              <div>
                <h4>Booking Approved</h4>
                {booking?.approved_by?.map((approver, index) => (
                  <p className="approver" key={index}>
                    {approver?.name}
                    {booked?.approved_by?.length - 1 !== index && (
                      <span> , </span>
                    )}
                  </p>
                ))}
              </div>
            )} */}
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-800 transition"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingModal;
