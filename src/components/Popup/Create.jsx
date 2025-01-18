import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useCreateBookingMutation,
  useParticipantsQuery,
  useUsersQuery,
} from "../../apps/features/apiSlice";
import { useSelector } from "react-redux";
import timeList from "../../assets/public/time.json";
import { MdMoreTime } from "react-icons/md";
import AddPeople from "./AddPeople";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

const Create = ({ facilityByRoomId, onClose }) => {
  const [createBooking, { isLoading, isError, isSuccess }] =
    useCreateBookingMutation();
  const [success, setSuccess] = useState(false);
  const { data: participants } = useParticipantsQuery();
  const [searchParams] = useSearchParams();
  // const [selectedDate, setSelectedDate] = useState(
  //   searchParams.get("date")
  //     ? dayjs(searchParams.get("date"))
  //     : dayjs(new Date())
  // );
  // const [bookedListByDate, setBookedListByDate] = useState(
  //   dayjs(selectedDate).format("YYYY-MM-DD")
  // );

  const participantsOfIds = participants?.map((item) => item.id);
  console.log(participantsOfIds, "participantsOfIds");
  const userId = useSelector((state) => state.auth.id);
  // const participantList =
  //   participantsOfIds && participantsOfIds.length > 0
  //     ? [userId, ...participantsOfIds]
  //     : [userId];

  const [createTime, setCreateTime] = useState({
    fromTime: "12:00 am",
    toTime: "1:00 am",
  });

  const [formData, setFormData] = useState({
    title: "",
    note: "",
    book_date: "",
    start_time: createTime.fromTime,
    end_time: createTime.toTime,
  });

  const [addPerson, setAddPerson] = useState([]);
  const [addGuest, setAddGuest] = useState([]);
  const [manualGuests, setManualGuests] = useState([]);

  const [timeError, setTimeError] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [inputField, setInputField] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState(participants || []);
  const [mentionPerson, setMentionPerson] = useState();

  const timeArr = timeList?.detailTime;

  const parseTime = (timeString) => {
    const [time, period] = timeString.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const hours24 = period === "PM" && hours !== 12 ? hours + 12 : hours % 12;
    return hours24 * 60 + minutes; // Convert to minutes for easier comparison
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
      } else {
        setTimeError("");
      }
    }
  };

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
      locations: [],
      book_by: userId,
      participants: addPerson.map((p) => p.id),
      guests: addGuest,
    };

    console.log(bookingDetails, "bookingDetails");

    const notifyerror = () => toast.error("This time is already booked!");
    const notifysuccess = () => toast.success("Booking created successfully!");

    try {
      const response = await createBooking(bookingDetails).unwrap();
      console.log(response, "response....");
      if (response.status === false) {
        setSuccess(false);
        notifyerror();
      } else {
        setSuccess(true);
        notifysuccess();
      }

      // Reset form
      setFormData({
        title: "",
        note: "",
        book_date: "",
        start_time: createTime.fromTime,
        end_time: createTime.toTime,
      });
      setAddPerson([]);
      setAddGuest([]);
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
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <div
      className="modal-overlay bg-white rounded-md mx-auto sm:p-6 lg:p-8 w-full max-h-[600px] overflow-y-scroll z-50 "
      onClick={handleOutsideClick}
    >
      <div ref={modalRef} className="modal-content ">
        <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">
          Create New Booking
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-b-[1px] border-gray-300 focus:outline-none"
              placeholder="Enter booking title"
              required
            />
          </div>

          {/* Time Fields */}
          <div className="flex mb-2">
            <div className="timeIcon w-[40px] flex justify-start align-middle text-gray-5s00">
              <MdMoreTime size={21} />
            </div>
            <div className="flex gap-1 ml-1">
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

          {/* Date Field */}
          <div className="mb-2">
            <input
              type="date"
              name="book_date"
              value={formData.book_date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-b-[1px] border-gray-300 focus:outline-none text-gray-500"
              required
            />
          </div>

          <section className=" w-full px-3 py-2 border-b-[1px] border-gray-300 focus:outline-none text-gray-500 mb-">
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

          <div className="mb-4">
            <input
              type="text"
              name="guests"
              value={addGuest.join(", ")} // Display as a comma-separated string
              onChange={
                (e) =>
                  setAddGuest(
                    e.target.value.split(",").map((email) => email.trim())
                  ) // Split input into an array
              }
              className="w-full px-3 py-2 border-b-[1px] border-gray-300 focus:outline-none"
              placeholder="Enter guest emails, separated by commas"
            />
          </div>

          {/* <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                id="guest"
                value={manualGuests}
                onChange={(e) => setManualGuests(e.target.value)}
                className="flex-1 px-3 py-2 border-b-[1px] border-gray-300 focus:outline-none"
                placeholder="Enter guest names or emails, separated by commas"
              />
              <button
                type="button"
                onClick={handleAddGuests}
                className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 focus:ring focus:ring-green-300 focus:outline-none"
              >
                Add
              </button>
            </div>
          </div> */}

          {/* <ul className="mt-2">
            {addGuest.map((guest) => (
              <li key={guest.id} className="text-sm text-gray-600">
                {guest.name}
              </li>
            ))}
          </ul> */}

          {/* Note Field */}
          <div className="mb-2">
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border-b-[1px] border-gray-300 focus:outline-none"
              placeholder="Notes"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:ring focus:ring-blue-300 focus:outline-none ${
              timeError ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !!timeError}
          >
            {isLoading ? "Saving..." : "Save Booking"}
          </button>

          {isError && (
            <p className="text-red-500 mt-4 text-center">
              Error creating booking. Please try again.
            </p>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Create;
