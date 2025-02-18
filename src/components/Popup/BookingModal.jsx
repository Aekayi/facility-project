import React, { useEffect, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import EditModal from "./EditModal";
import {
  useDeleteBookingMutation,
  useApprovedBookingMutation,
} from "../../apps/features/apiSlice";
import Loading from "../loading/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingModal = ({ booking, onClose, onEdit, onDelete }) => {
  const loggedInUserId = useSelector((state) => state.auth.id);
  const loggedIn = useSelector((state) => state.auth);
  console.log(loggedIn, "loggedIn");
  const isOwner = booking?.book_by?.id === loggedInUserId;
  const approvedId = booking?.approved_by?.find(
    (approver) => approver.id === loggedInUserId
  );
  const approver = booking?.approved_by?.map((approve) => approve?.id);
  const canEdit = isOwner || approver.length > 0;

  const needApproval = booking?.facility_id?.needApproval;

  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteComfirm, setDeleteComfirm] = useState(false);
  const [popUpId, setPopUpId] = useState();
  const [loading, setLoading] = useState(true);

  const [deleteBooking, { data, isError, isLoading }] =
    useDeleteBookingMutation();

  const [
    approvedBooking,
    { data: approvedData, isError: approvedError, isLoading: approvedLoading },
  ] = useApprovedBookingMutation();

  const handleApproved = async (status) => {
    try {
      console.log("Update booking status");
      await approvedBooking({ bookingId: booking.id, status }).unwrap();
      toast.info(
        `Booking ${status === 1 ? "approved" : "canceled"} successfully`,
        {
          style: { backgroundColor: "#d4f1f4", color: "#05445e" },
          progressStyle: {
            background: "#05445e",
          },
        }
      );
      console.log("Toast success should display");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Failed to update booking status");
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

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
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 1 second
    }, 1000);
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  if (!booking) return null;

  const participants = booking.participants || [];
  const guests = booking.guests || [];
  const locations = booking?.locations || [];

  const handleDelete = async () => {
    try {
      await deleteBooking(booking.id).unwrap();
      setDeleteComfirm(false); // Close delete confirmation
      toast.info("Booking deleted successfully!", {
        style: { backgroundColor: "#d4f1f4", color: "#05445e" },
        progressStyle: {
          background: "#05445e",
        },
      });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      // console.error("Failed to delete booking:", error);
      toast.error("Failed to delete booking");
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <>
      <div
        className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleOutsideClick}
      >
        <div
          className={`bg-white rounded-md shadow-lg w-full max-w-md max-h-screen overflow-y-auto p-4`}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loading />
            </div>
          ) : (
            <>
              {canEdit && (
                <div className="flex justify-end space-x-6">
                  <button
                    className="px-4 py-2 radius-lg hover:bg-white hover:radius-lg hover:shadow-lg"
                    onClick={onEdit}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6 text-[#05445E]"
                    >
                      <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                      <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                    </svg>
                  </button>

                  {isOwner && (
                    <button
                      className={`px-4 py-2 radius-lg hover:bg-white hover:radius-lg hover:shadow-lg`}
                      onClick={() => setDeleteComfirm(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6 text-red-600"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
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
                  <h2 className="text-xl text-[#05445E] font-semibold">
                    {booking.title}
                  </h2>
                  <p className="mb-4 font-sm text-gray-700">
                    Time -- {booking.start_time} to {booking.end_time}
                  </p>
                  {booking?.note !== null && (
                    <div>
                      <h2 className="text-lg font-md mb-2">Descriptions</h2>
                      <p className="mb-4 text-gray-700 font-sm">
                        {booking?.note}
                      </p>
                    </div>
                  )}
                  {booking?.participants && booking.participants.length > 0 && (
                    <div>
                      <p className="text-semibold">
                        {participants.length} Members
                      </p>
                      <div className="flex flex-wrap gap-2 border border-gray-300 p-3 rounded-md bg-gray-50 max-h-40 overflow-y-auto mb-2">
                        {participants.map((member, index) => (
                          <span
                            key={index}
                            className="bg-blue-200 text-[#05445E] px-3 py-1 rounded-md text-sm shadow-md"
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
                      <div className="flex flex-wrap gap-2 border border-gray-300 p-3 rounded-md bg-gray-50 max-h-40 overflow-y-auto mb-2">
                        {guests.map((member, index) => (
                          <span
                            key={index}
                            className="bg-blue-200 text-[#05445E] px-3 py-1 rounded-md text-sm shadow-md"
                          >
                            {member.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {booking?.locations.length > 0 && (
                    <div>
                      <p className="text-semibold">Locations</p>
                      {locations.map((location, index) => (
                        <div className="border border-gray-300 p-3 rounded-md mb-2">
                          <span key={index} className="text-sm text-gray-600">
                            {location.address}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {booking?.approved_by > 0 && (
                    <div className="mt-4">
                      <h4>Approved By</h4>
                      {booking?.approved_by?.map((approver, index) => (
                        <p className="text-sm text-gray-600" key={index}>
                          {approver?.name}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex justify-between">
                    <div className="flex gap-4">
                      {approvedId !== undefined && needApproval && (
                        <>
                          {booking?.status !== "booked" && (
                            <>
                              <button
                                className="px-2 py-1 bg-[#05445E] text-white rounded hover:bg-[#05445E]/80 transition shadow-md"
                                onClick={() => handleApproved(1)}
                              >
                                Approve
                              </button>
                              <button
                                className="px-2 py-1 bg-[#d4f1f4] hover:bg-[#d4f1f4]/80 text-[#05445E] rounded transition shadow-md"
                                onClick={() => handleApproved(0)}
                              >
                                Not Approve
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    <button
                      className="px-4 py-1 bg-[#d4f1f4] text-[#05445E] rounded transition shadow-md"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
              {deleteComfirm && (
                <div>
                  <h3 className="text-xl font-semibold text-[#05445E] mb-4">
                    Delete Confirmation!
                  </h3>
                  <p className="text-gray-700">
                    Are you sure you want to delete this booking?
                  </p>
                  <div className="flex justify-end gap-4 mt-2">
                    <button
                      className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                      onClick={() => setDeleteComfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-800 transition"
                      onClick={handleDelete}
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingModal;
