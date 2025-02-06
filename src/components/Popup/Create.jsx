import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useCreateBookingMutation,
  useParticipantsQuery,
  useFacilitiesQuery,
  useLocationsQuery,
  useBookedListByDateQuery,
  useUsersQuery,
} from "../../apps/features/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import timeList from "../../assets/public/time.json";
import {
  MdMoreTime,
  MdOutlineAddLocationAlt,
  MdOutlineTitle,
} from "react-icons/md";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import AddPeople from "./AddPeople";
import { useParams, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import AddLocationModal from "./AddLocationModal";
import Loading from "../loading/Loading";
import { AiOutlineUngroup } from "react-icons/ai";
import NewLocation from "./NewLocation";
import CreateGoogleMap from "./CreateGoogleMap";

const Create = ({ facilityByRoomId, onClose, selectedTime, changeDate }) => {
  const { facilityName } = useParams();
  const dispatch = useDispatch();
  const [createBooking, { isLoading, isError, isSuccess }] =
    useCreateBookingMutation();
  const [success, setSuccess] = useState(false);
  const { data: participants } = useParticipantsQuery();
  const { data: category } = useFacilitiesQuery();
  const { data: locations } = useLocationsQuery();
  const { data: bookedListByDate } = useBookedListByDateQuery({
    facilityByRoomId,
    bookedListByDate: changeDate || dayjs().format("YYYY-MM-DD"),
  });

  const coordList = category?.data?.some(
    (cats) => cats.name === facilityName && cats.needLocation === 1
  );

  const [searchParams] = useSearchParams();

  const userId = useSelector((state) => state.auth.id);

  function formatTime({ hour, minute, period }) {
    const formattedHour = hour.toString().padStart(1, "0");
    const formattedMinute = minute.toString().padStart(2, "0");

    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  function addOneHour({ hour, minute, period }) {
    let newHour = hour + 1;
    let newPeriod = period;

    if (newHour === 12) {
      newPeriod = period === "am" ? "pm" : "am";
    } else if (newHour > 12) {
      newHour = 1;
    }

    // Return the updated time object
    return { hour: newHour, minute, period: newPeriod };
  }

  const endTime = addOneHour(selectedTime);

  const [formData, setFormData] = useState({
    title: "",
    note: "",
    book_date: changeDate,
    start_time: formatTime(selectedTime),
    end_time: formatTime(endTime),
  });

  const [title, setTitle] = useState();
  const [addPerson, setAddPerson] = useState([]);
  const [addGuest, setAddGuest] = useState([]);

  const [timeError, setTimeError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState(participants || []);
  const [mentionPerson, setMentionPerson] = useState();
  const [location, setLocation] = useState([]);
  const [locationName, setLocationName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocationModal, setNewLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationAddress, setLocationAddress] = useState("");

  const timeArr = timeList?.detailTime;

  let parseTime = (timeString) => {
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const hours24 = period === "PM" && hours !== 12 ? hours + 12 : hours % 12;
    return hours24 * 60 + minutes;
  };

  const timeAlreadyBooked = (startTime, endTime, existingBookings) => {
    const startMinutes = parseTime(startTime);
    const endMinutes = parseTime(endTime);

    for (let booking of existingBookings) {
      const existingStartMinutes = parseTime(booking.start_time);
      const existingEndMinutes = parseTime(booking.end_time);

      if (
        (startMinutes >= existingStartMinutes &&
          startMinutes < existingEndMinutes) ||
        (endMinutes > existingStartMinutes &&
          endMinutes <= existingEndMinutes) ||
        (startMinutes <= existingStartMinutes &&
          endMinutes >= existingEndMinutes) ||
        (startMinutes < existingStartMinutes &&
          endMinutes > existingStartMinutes - 15) || // Less than 15 mins before a booking
        (startMinutes > existingEndMinutes &&
          startMinutes < existingEndMinutes + 15)
      ) {
        return true;
      }
    }

    return false;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "start_time" || name === "end_time") {
      const startMinutes = parseTime(
        name === "start_time" ? value : formData.start_time
      );
      const endMinutes = parseTime(
        name === "end_time" ? value : formData.end_time
      );

      if (startMinutes >= endMinutes) {
        setTimeError("Start time must be less than end time.");
      } else if (
        !coordList &&
        timeAlreadyBooked(
          name === "start_time" ? value : formData.start_time,
          name === "end_time" ? value : formData.end_time,
          bookedListByDate?.data || []
        )
      ) {
        setTimeError("This time is already booked or does not gap 15 minutes!");
      } else {
        setTimeError("");
      }
    }
  };
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      book_date: changeDate,
    }));
  }, [changeDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (timeError) {
      return;
    }

    const bookingDetails = {
      title: formData.title,
      note: formData.note || "Optional note",
      book_date: formData.book_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      facility_id: Number(facilityByRoomId),
      locations: coordList ? location : [],
      book_by: userId,
      participants:
        addPerson.length > 0
          ? addPerson.map((p) => ({ id: p.id, is_user: p.is_user }))
          : [{ id: userId, is_user: true }],
      guests: addGuest,
    };

    // console.log(bookingDetails, "bookingDetails");

    try {
      const response = await createBooking(bookingDetails).unwrap();

      if (response.status === false) {
        setSuccess(false);
        toast.error("This time is already booked!");
      } else {
        setSuccess(true);
        // alert(response.message);
        toast.success(response.message);
      }

      // Reset form
      setFormData({
        title: "",
        note: "",
        book_date: "",
        start_time: "",
        end_time: "",
      });
      setAddPerson([]);
      setAddGuest([]);
      setLocation([]);
      // setManualGuests("");
    } catch (error) {
      if (error.status === "PARSING_ERROR") {
        console.error("Server returned invalid response:", error);
      } else {
        console.error("Error creating booking:", error);
      }
    }
  };
  const modalRef = useRef(null);

  const handleOutsideClick = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (location.length > 0) {
      console.log("Location updated:", location);
    }
  }, [location]);

  useEffect(() => {
    if (isModalOpen || newLocationModal) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling when modal closes
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup on unmount
    };
  }, [isModalOpen, newLocationModal]);

  return (
    <div
      className="modal-overlay bg-white rounded-md mx-auto p-8 lg:p-8 w-full max-h-screen overflow-y-auto z-50"
      onClick={handleOutsideClick}
    >
      <div ref={modalRef} className="modal-content w-auto">
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="mb-4 flex justify-start items-center gap-4">
            <div className="timeIcon w-[40px] flex justify-start align-middle text-[#05445E]">
              <MdOutlineTitle size={23} className="createTitle" />
            </div>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border-b-[1px] border-gray-300 focus:outline-none placeholder:text-gray-500"
              placeholder="Add title"
              required
            />
          </div>

          {/* Time Fields */}
          <div className="flex mb-2 justify-start items-center gap-4">
            <div className="timeIcon w-[40px] flex justify-start align-middle text-[#05445E]">
              <MdMoreTime size={21} />
            </div>
            <div className="flex gap-1">
              <select
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="custom-dropdown w-[110px] overflow-auto border-[1px] border-gray-300 bg-white outline-none rounded-sm p-1 focus:outline-[#757575] text-gray-500"
              >
                {timeArr?.map((time, index) => (
                  <option
                    value={`${time.time}:${time.minute} ${time.period}`}
                    key={index}
                  >
                    {time.time}:{time.minute} {time.period}
                  </option>
                ))}
              </select>
              <label>-</label>
              <select
                name="end_time"
                value={formData.end_time}
                onChange={handleInputChange}
                className="custom-dropdown w-[110px] overflow-auto border-[1px] border-gray-300 bg-white outline-none rounded-sm p-1 focus:outline-[#757575] text-gray-500"
              >
                {timeArr.map((time, key) => (
                  <option
                    value={`${time.time}:${time.minute} ${time.period}`}
                    key={key}
                  >
                    {time.time}:{time.minute} {time.period}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {timeError && (
            <p className="text-red-500 text-sm mb-2">{timeError}</p>
          )}

          <section className="w-full py-2 focus:outline-none text-gray-500 mb-4">
            <AddPeople
              addPerson={addPerson}
              setAddPerson={setAddPerson}
              setMentionPerson={setMentionPerson}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              filteredPeople={filteredPeople}
              setFilteredPeople={setFilteredPeople}
            />
          </section>

          {/* Guest Field */}

          <div className="mb-4 flex justify-start items-center gap-4">
            <div className="timeIcon w-[40px] flex justify-start align-middle text-[#05445E]">
              <AiOutlineUsergroupAdd size={21} />
            </div>
            <input
              type="text"
              name="guests"
              value={addGuest.join(", ")} // Display as a comma-separated string
              onChange={(e) =>
                setAddGuest(
                  e.target.value.split(",").map((email) => email.trim())
                )
              }
              className="w-full border-b-[1px] border-gray-300 focus:outline-none placeholder:text-gray-500"
              placeholder="Add guest emails (optional)"
            />
          </div>

          {/* Location Field */}
          {coordList && (
            <div>
              <div className="mb-4 flex justify-start items-center gap-4">
                <div className="timeIcon w-[40px] flex justify-start align-middle text-[#05445E]">
                  <MdOutlineAddLocationAlt size={21} className="createTitle" />
                </div>

                <button
                  className="flex justify-center items-center gap-2 px-4 py-1 bg-[#d4f1f4] text-[#05445E] rounded w-full"
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
                <div
                  className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div
                    className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CreateGoogleMap onLocationSelect={setSelectedLocation} />
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

                              setIsModalOpen(false);
                            } else {
                              alert("Please select a location");
                            }
                          }}
                          type="button"
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
                          setLocation((prev) => [...prev, selectedLocation]);
                          setNewLocationModal(false);
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

          {/* Note Field */}
          <div className="mb-2">
            <label className="block text-gray-600 mb-1">Description</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-[1px] border-gray-300 rounded-sm focus:outline-none"
              placeholder="Notes"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-sm text-gray-600 px-4 py-2 rounded-sm hover:bg-gray-400 focus:ring focus:ring-blue-300 focus:outline-none ml-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`text-sm text-white px-4 py-2 rounded-sm hover:bg-[#05445E]/80 focus:ring focus:ring-blue-300 focus:outline-none  ${
                isLoading || !!timeError
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-[#05445E] "
              }
`}
              disabled={isLoading || !!timeError}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Create;
