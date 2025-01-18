import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useUpdateBookingMutation,
  useFacilityidQuery,
  useFacilitynamesQuery,
} from "../../apps/features/apiSlice";
import { MdCategory } from "react-icons/md";
import AddPeople from "./AddPeople";
import { ToastContainer, toast } from "react-toastify";

const EditModal = ({ booking, onClose }) => {
  const { facilityByRoomId, facilityName, bookingId } = useParams();

  // Local state to manage form inputs
  const [id, setId] = useState(booking?.id || "");
  const [facility, setFacility] = useState(booking?.facility_id?.id || "");
  const [title, setTitle] = useState(booking?.title || "");
  const [note, setNote] = useState(booking?.note || "");
  const [startTime, setStartTime] = useState(booking?.start_time || "");
  const [endTime, setEndTime] = useState(booking?.end_time || "");
  const [selectedDate, setSelectedDate] = useState(booking?.book_date || "");
  const [participants, setParticipants] = useState(booking?.participants || []);
  console.log(participants, "participants");
  const [guests, setGuests] = useState(booking?.guests || []);
  const [addPerson, setAddPerson] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [bookBy, setBookBy] = useState(booking?.book_by?.id || null);
  const [success, setSuccess] = useState(false);

  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}`;
  };

  const formattedStartTime = startTime ? convertTo24HourFormat(startTime) : "";
  const formattedEndTime = startTime ? convertTo24HourFormat(endTime) : "";

  const [
    updateBooking,
    {
      data,
      isError: updateError,
      isLoading: errorLoading,
      isSuccess: updateSuccess,
    },
  ] = useUpdateBookingMutation();

  const { data: roomDetails } = useFacilityidQuery(facilityByRoomId);

  const {
    data: facilityData,
    isLoading,
    isError,
    error,
  } = useFacilitynamesQuery(facilityName);

  const facilitynames = facilityData?.data?.map((facility) => facility.name);

  // Close modal on outside click
  const handleOutsideClick = useCallback(
    (e) => {
      if (e.target.classList.contains("modal-overlay")) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);
  const participantsId = participants
    ?.filter((filter) => filter.id)
    .map((participant) => participant.id);

  const handleSave = async () => {
    console.log(addPerson, "addPersonnnn");
    let participantIds = addPerson.map((person) => person.id);
    console.log(participantIds, "participantIdsssss");

    let guestEmails = guests.map((guest) => guest.email);
    console.log(guestEmails, "guestIdsaaa");
    const updatedBooking = {
      title: title,
      note: note ? note : "",
      start_time: startTime,
      end_time: endTime,
      book_date: selectedDate,
      participants: participantIds,
      facility_id: facility,
      locations: [],
      book_by: bookBy,
      guests: guestEmails, // Assuming guests are just names
    };

    const notifyerror = () => toast.error("This time is already exists!");
    const notifysuccess = () => toast.success("Booking updated successfully!");

    try {
      const response = await updateBooking({
        data: updatedBooking,
        bookingId: booking?.id,
      }).unwrap();
      onClose();

      console.log(response, "response");
      if (response.status === false) {
        setSuccess(false);
        notifyerror();
      } else {
        setSuccess(true);
        notifysuccess();
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-96 p-6 max-h-screen overflow-y-auto "
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h2 className="text-lg font-bold mb-2 ml-4">Edit Booking</h2>
        <div className="mb-4 ml-4 flex flex-row space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 text-gray-700"
          >
            <path
              fillRule="evenodd"
              d="M4.5 2A2.5 2.5 0 0 0 2 4.5v3.879a2.5 2.5 0 0 0 .732 1.767l7.5 7.5a2.5 2.5 0 0 0 3.536 0l3.878-3.878a2.5 2.5 0 0 0 0-3.536l-7.5-7.5A2.5 2.5 0 0 0 8.38 2H4.5ZM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-b border-gray-300  w-full  focus:outline-none"
          />
        </div>

        <div className="mb-4 ml-4 flex flex-row space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 text-gray-700"
          >
            <path d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" />
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
              clipRule="evenodd"
            />
          </svg>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 w-full focus:outline-none"
          />
        </div>
        <div className="create-edit-container flex flex-row mb-4 ml-4 space-x-4">
          <MdCategory size={20} className="text-gray-700" />
          <select
            className="px-4 py-1 border border-gray-300 rounded focus:outline-none"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
          >
            {facilityData?.data?.map((room, index) => (
              <option value={room?.id} key={index}>
                {room?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-4 mb-4 flex flex-row space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 text-gray-700"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
              clipRule="evenodd"
            />
          </svg>
          <div className=" ml-4 flex space-x-4">
            <input
              type="time"
              value={formattedStartTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="border-b border-gray-300 rounded w-full focus:outline-none"
            />
            <input
              type="time"
              value={formattedEndTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="border-b border-gray-300 rounded w-full focus:outline-none"
            />
          </div>
        </div>

        <section
          className=" w-full px-3 py-2 focus:outline-none text-gray-500 mb-"
          defaultValue={participantsId}
        >
          <AddPeople
            addPerson={addPerson}
            setAddPerson={setAddPerson}
            participants={participants}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            filteredPeople={filteredPeople}
            setFilteredPeople={setFilteredPeople}
          />
        </section>
        {/* <div className="flex flex-row space-x-4 mb-4 ml-4 mt-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 text-gray-700"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
              clipRule="evenodd"
            />
          </svg>

          <input
            type="text"
            value={guests?.email}
            onChange={(e) => setGuests(e.target.value)}
            className="border-b border-gray-300 rounded w-full focus:outline-none"
          />
        </div> */}

        <div className="mb-4 ml-4 flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {guests.map((guest, index) => (
              <div key={index} className="flex items-center ml-8">
                <input
                  type="email"
                  value={guest.email}
                  onChange={(e) => {
                    const updatedGuests = [...guests];
                    updatedGuests[index].email = e.target.value;
                    setGuests(updatedGuests);
                  }}
                  className="border border-gray-300 rounded-sm p-1 focus:outline-none"
                  placeholder="Enter guest email"
                />
                <button
                  onClick={() =>
                    setGuests(guests.filter((_, i) => i !== index))
                  }
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setGuests([...guests, { email: "" }])}
            className="mt-2 ml-8 px-1 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Add Guest
          </button>
        </div>

        <div className="mb-4 ml-4 flex flex-row space-x-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5 text-gray-700"
          >
            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
          </svg>

          <textarea
            type="textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded-sm w-full focus:outline-none p-2"
          >
            {note}
          </textarea>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
          {updateError && (
            <p className="text-red-500 mt-2">Failed to update booking.</p>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditModal;
