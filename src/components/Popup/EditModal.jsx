import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useUpdateBookingMutation,
  useFacilityidQuery,
  useFacilitynamesQuery,
} from "../../apps/features/apiSlice";
import { MdCategory, MdOutlineAddLocationAlt } from "react-icons/md";
import AddPeople from "./AddPeople";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading/Loading";
import { data } from "autoprefixer";
import GoogleMapComponent from "./GoogleMapComponent";
import NewLocation from "./NewLocation";

const EditModal = ({ booking, onClose }) => {
  const { facilityByRoomId, facilityName } = useParams();

  const coordList =
    booking?.facility_category?.name === facilityName &&
    booking?.facility_category?.needLocation === 1;

  const [id, setId] = useState(booking?.id || "");
  console.log(id, "id");
  const [facility, setFacility] = useState(booking?.facility_id?.id || "");
  const [title, setTitle] = useState(booking?.title || "");
  const [note, setNote] = useState(booking?.note || "");
  const [startTime, setStartTime] = useState(booking?.start_time || "");
  const [endTime, setEndTime] = useState(booking?.end_time || "");
  const [selectedDate, setSelectedDate] = useState(booking?.book_date || "");
  const [participants, setParticipants] = useState(booking?.participants || []);
  const [guests, setGuests] = useState(booking?.guests || []);
  const [addPerson, setAddPerson] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [bookBy, setBookBy] = useState(booking?.book_by?.id || null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocationModal, setNewLocationModal] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [location, setLocation] = useState(booking?.locations || "");

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
      isError: updateError,
      isLoading: updateLoading,
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
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after 1 second
    }, 1000);
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
    // let participantIds = addPerson.map((person) => person.id);
    // console.log(participantIds, "participantIdsssss");

    let guestEmails = guests.map((guest) => guest.email);
    console.log(guestEmails, "guestIdsaaa");
    const updatedBooking = {
      title: title,
      note: note ? note : "",
      start_time: startTime,
      end_time: endTime,
      book_date: selectedDate,
      participants: addPerson.map((p) => ({
        id: p.id,
        is_user: p.is_user,
      })),
      facility_id: facility,
      locations: location ? location : [],
      book_by: bookBy,
      guests: guests?.map((guest) => guest.email), // Assuming guests are just names
    };
    console.log(updatedBooking, "updatedbooking...");
    try {
      const response = await updateBooking({
        data: updatedBooking,
        bookingId: booking?.id,
      }).unwrap();
      if (response.status === false) {
        setSuccess(false);
        toast.error("Error updating booking");
      } else {
        setSuccess(true);
        toast.success("Booking updated successfully!");
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  return (
    <div
      className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 gap-y-4"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* {updateLoading ? <Loading /> : null} */}
        {loading ? (
          <div className="flex justify-center items-center h-96 ">
            <Loading />
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-row items-center space-x-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-[#05445E]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6Z"
                />
              </svg>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className=" border-b border-gray-300 w-full focus:outline-none text-gray-500 placeholder:text-gray-400"
              />
            </div>
            <div className="mb-6 flex flex-row items-center space-x-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 text-[#05445E]"
              >
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
                className="border border-gray-300 w-full focus:outline-none text-gray-500 placeholder:text-gray-400"
              />
            </div>
            <div className="create-edit-container flex flex-row items-center mb-6 space-x-6">
              <MdCategory size={20} className="text-[#05445E]" />
              <select
                className="px-4 py-1 border border-gray-300 rounded focus:outline-none text-gray-500 placeholder:text-gray-400"
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
            <div className="mb-6 flex flex-row items-center space-x-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 text-[#05445E]"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex space-x-4">
                <input
                  type="time"
                  value={formattedStartTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-b border-gray-300 rounded w-full focus:outline-none text-gray-500 placeholder:text-gray-400"
                />
                <input
                  type="time"
                  value={formattedEndTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-b border-gray-300 rounded w-full focus:outline-none text-gray-500 placeholder:text-gray-400"
                />
              </div>
            </div>
            <section
              className="w-full py-2 focus:outline-none text-gray-500 placeholder:text-gray-400"
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
            <div className="mb-6 flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                {guests.map((guest, index) => (
                  <div key={index} className="flex items-center ml-12">
                    <input
                      type="email"
                      value={guest.email}
                      onChange={(e) => {
                        const updatedGuests = [...guests];
                        updatedGuests[index].email = e.target.value;
                        setGuests(updatedGuests);
                      }}
                      className="border border-gray-300 rounded-sm p-1 focus:outline-none text-sm"
                      placeholder="Enter guest email"
                    />
                    <button
                      onClick={() =>
                        setGuests(guests.filter((_, i) => i !== index))
                      }
                      className="ml-2 text-sm text-red-800 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setGuests([...guests, { email: "" }])}
                className="mt-2 ml-11 px-1 py-1 bg-[#05445E] text-white rounded-sm hover:bg-[#05445E]/80 shadow-md"
              >
                Add Guest
              </button>
            </div>
            {coordList && (
              <div>
                <div className="mb-4 flex justify-start items-center gap-2">
                  <div className="timeIcon w-[40px] flex justify-start align-middle text-[#05445E]">
                    <MdOutlineAddLocationAlt
                      size={21}
                      className="createTitle"
                    />
                  </div>
                  <button
                    className="px-4 py-1 bg-[#d4f1f4] text-[#05445E] rounded w-full flex justify-center items-center gap-4"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    Add Location
                  </button>
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                      <GoogleMapComponent
                        onLocationSelect={setSelectedLocation}
                      />

                      <div className="flex justify-between mt-4">
                        <div>
                          <button
                            className="px-4 py-1 bg-[#05445E] rounded-[5px] mr-2 text-[#d4f1f4] shadow-md"
                            onClick={() => {
                              setIsModalOpen(false);
                              setNewLocationModal(true);
                            }}
                          >
                            New Location
                          </button>
                        </div>
                        <div>
                          <button
                            className="px-4 py-1 bg-[#d4f1f4] text-[#05445E] rounded-[5px] mr-2 shadow-md"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="px-4 py-1 bg-[#05445E] text-[#d4f1f4] rounded-[5px] shadow-md"
                            onClick={() => {
                              if (selectedLocation) {
                                setLocation((prev) => [
                                  ...prev,
                                  selectedLocation,
                                ]);
                                console.log(location, "loooo");
                                setIsModalOpen(false);
                              } else {
                                alert("Please select a location");
                              }
                            }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {newLocationModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                      <NewLocation
                        locationName={locationName}
                        setLocationName={setLocationName}
                        locationAddress={locationAddress}
                        setLocationAddress={setLocationAddress}
                        setNewLocationModal={setNewLocationModal}
                        setLocation={setLocation}
                        onLocationSelect={setSelectedLocation}
                      />
                      <div className="flex justify-end ">
                        <button
                          className="px-4 py-1 bg-[#d4f1f4] text-[#05445E] rounded-[5px] mr-2 shadow-md"
                          onClick={() => setNewLocationModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-4 py-1 bg-[#05445E] text-[#d4f1f4] rounded-[5px] shadow-md"
                          onClick={() => {
                            if (selectedLocation) {
                              setLocation((prev) => [
                                ...prev,
                                selectedLocation,
                              ]);
                              console.log(location, "loooo");
                              setNewLocationModal(false);
                            } else {
                              alert("Please select a location");
                            }
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {location.length > 0 && (
                  <div>
                    {location.map((loc, index) => (
                      <div
                        key={index}
                        className="ml-10 flex justify-between items-start border border-[#05445E] text-[#05445E] text-sm p-2 mb-2 bg-transparent rounded-md"
                      >
                        <p>{loc?.name || loc?.address}</p>
                        <button
                          className="ml-2"
                          onClick={() => {
                            // Remove the selected location
                            setLocation((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mb-4 flex flex-row items-center space-x-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-5 text-[#05445E]"
              >
                <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
              </svg>

              <textarea
                type="textarea"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border border-gray-300 rounded-sm w-full focus:outline-none p-2 text-gray-700"
              >
                {note}
              </textarea>
            </div>
            <div className="flex justify-end space-x-6 z-50">
              <button
                onClick={onClose}
                className="px-4 py-1 bg-[#d4f1f4] text-[#05445E] rounded-sm hover:bg-[#d4f1f4]/80 transition shadow-md "
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1 bg-[#05445E] text-white rounded-sm hover:bg-[#05445E]/80 transition shadow-md "
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
              {updateError && (
                <p className="text-red-500 mt-2">Failed to update booking.</p>
              )}
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditModal;
