import React, { useEffect, useState } from "react";
import timeList from "../../assets/public/time.json";
import duration from "../../assets/public/duration.json";
import LocalIcon from "../../assets/icons";
import {
  useDeleteBookingMutation,
  useFacilitynamesQuery,
  useUpdateBookingMutation,
} from "../../apps/features/apiSlice";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { set } from "date-fns";

function EditBookingForFleet({
  fleetBookedList,
  selectedBooking,
  setSelectedBooking,
}) {
  const timeArr = timeList?.detailTime;
  const durationTime = duration?.duration;

  const [startTime, setStartTime] = useState(
    selectedBooking?.start_time
      ?.replace("PM", "pm")
      .replace("AM", "am")
      .replace(/^0/, "")
  );
  console.log(startTime, "startTime");
  const [endTime, setEndTime] = useState(
    selectedBooking?.end_time
      ?.replace("PM", "pm")
      .replace("AM", "am")
      .replace(/^0/, "")
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [departure, setDeparture] = useState(true);
  const [departureDuration, setDepatureDuration] = useState("1:00");
  const [returnTransport, setReturnTransport] = useState(true);
  const [arrivalDuration, setArrivalDuration] = useState("1:00");
  const [approve, setApprove] = useState(true);
  const [note, setNote] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(
    selectedBooking?.facility_id?.id
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const hasDeparture = selectedBooking?.locations?.some(
      (d) => d?.departure_transport === 1
    );
    setDeparture(hasDeparture);
    const hasReturn = selectedBooking?.locations?.some(
      (r) => r?.return_transport === 1
    );
    setReturnTransport(hasReturn);
    const Approved = selectedBooking?.status === "booked";
    setApprove(Approved);

    const remark = selectedBooking?.locations?.find((r) => r.remark);
    if (remark?.remark) {
      setNote(remark.remark);
    } else {
      setNote("");
    }

    const depatureTime = selectedBooking?.locations?.find(
      (l) => l?.departure_time
    )?.departure_time;
    if (depatureTime) {
      setDepatureDuration(depatureTime);
    } else {
      setDepatureDuration("1:00");
    }
    const arrivalTime = selectedBooking?.locations?.find(
      (r) => r?.return_time
    )?.return_time;
    if (arrivalTime) {
      setArrivalDuration(arrivalTime);
    } else {
      setArrivalDuration("1:00");
    }
  }, [selectedBooking]);

  useEffect(() => {
    if (selectedBooking) {
      setSelectedDate(selectedBooking.book_date || "");
      setStartTime(
        selectedBooking?.start_time
          ?.replace("PM", "pm")
          .replace("AM", "am")
          .replace(/^0/, "") || ""
      );
      setEndTime(
        selectedBooking?.end_time
          ?.replace("PM", "pm")
          .replace("AM", "am")
          .replace(/^0/, "") || ""
      );
      setSelectedFacility(selectedBooking.facility_id?.id || "");
    }
  }, [selectedBooking]);

  const isPastBooking = () => {
    const now = dayjs(); // Current date & time
    const selectedDateTime = dayjs(
      `${selectedDate} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );

    return selectedDateTime.isBefore(now); // Check if booking is in the past
  };

  const [
    updateBooking,
    {
      isError: updateError,
      isLoading: updateLoading,
      isSuccess: updateSuccess,
    },
  ] = useUpdateBookingMutation();

  const handleUpdateBooking = async () => {
    const updatedData = {
      id: selectedBooking?.id,
      title: selectedBooking?.title,
      note: selectedBooking?.note,
      book_date: selectedDate || selectedBooking?.book_date,
      start_time: startTime.replace("pm", "PM").replace("am", "AM"),
      end_time: endTime.replace("pm", "PM").replace("am", "AM"),
      facility_id: selectedFacility || selectedBooking?.facility_id?.id,
      departure_transport: departure ? true : false,
      return_transport: returnTransport ? true : false,
      departure_time: departureDuration,
      return_time: arrivalDuration,
      status: approve ? 1 : 0,
      remark: note,
      book_by: selectedBooking?.book_by?.id,
      locations: selectedBooking?.locations || [],
      participants:
        selectedBooking?.participants?.map((p) => ({
          id: p.id,
          is_user: true,
        })) || [],
      guests: selectedBooking?.guests?.map((g) => g?.email),
    };
    console.log(updatedData, "updatedataaa");

    try {
      const response = await updateBooking({
        data: updatedData,
        bookingId: selectedBooking?.id,
      }).unwrap();
      console.log("Booking updated successfully:", response);
      setShowSuccessModal(true);

      setStartTime(updatedData.start_time);
      setEndTime(updatedData.end_time);
      setSelectedFacility(updatedData.facility_id);
      setSelectedDate(updatedData.book_date);
      setDeparture(updatedData.departure_transport);
      setReturnTransport(updatedData.return_transport);
      setDepatureDuration(updatedData.departure_time);
      setArrivalDuration(updatedData.return_time);
      setApprove(updatedData.status);
      setNote(updatedData.remark);
    } catch (error) {
      console.error("Error updating booking:", error);
      alert("Failed to update booking.");
    }
  };

  const [
    deleteBooking,
    {
      isError: deleteError,
      isLoading: deleteLoading,
      isSuccess: deleteSuccess,
    },
  ] = useDeleteBookingMutation();

  const confirmDelete = async () => {
    try {
      await deleteBooking(selectedBooking?.id).unwrap();
      toast.success("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast.error("Failed to delete booking.");
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      setShowDeleteModal(false);
    }
  };

  const { data: facilitynames } = useFacilitynamesQuery("Fleet");
  return (
    <>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <input
          type="text"
          value={selectedBooking?.facility_id?.name}
          // onChange={(e) => setTitle(e.target.value)}
          className="border-b border-gray-300 w-full focus:outline-none text-gray-500 placeholder:text-gray-400 text-[20px]"
          readOnly
        />
      </div>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <img src={LocalIcon.Title} alt="" />
        <input
          type="text"
          value={selectedBooking?.title}
          className="w-full focus:outline-none text-gray-800 placeholder:text-gray-400 text-[14px]"
          readOnly
        />
      </div>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <img src={LocalIcon.Profile} alt="" />
        <input
          type="text"
          value={`Booked By: ${selectedBooking?.book_by?.name || ""}`}
          className="w-full focus:outline-none text-gray-800 placeholder:text-gray-800 text-[14px]"
          readOnly
        />
      </div>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <img src={LocalIcon.Location} alt="" />
        <input
          type="text"
          value={selectedBooking?.locations?.map((location) => location.name)}
          className="w-full focus:outline-none text-gray-800 placeholder:text-gray-400 text-[14px]"
          readOnly
        />
      </div>
      <div className="mb-4 flex flex-row items-start space-x-2">
        <img src={LocalIcon.People} alt="" />
        <ul className="text-[14px] space-y-1">
          {selectedBooking?.participants?.map((participant, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#05445E] text-white text-sm">
                {participant?.name?.charAt(0).toUpperCase()}
              </span>
              <span>{participant.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <img src={LocalIcon.Note} alt="" />
        <input
          type="text"
          value={selectedBooking?.note}
          className="w-full focus:outline-none text-gray-800 placeholder:text-gray-400 text-[14px]"
          readOnly
        />
      </div>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <img src={LocalIcon.Calendar} alt="" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="appearance-none bg-white border border-gray-500 text-gray-800 rounded-md p-2 focus:outline-none cursor-pointer text-[13px]"
        />
      </div>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <img src={LocalIcon.Time} alt="" />
        <div className="flex gap-1">
          <select
            name="start_time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="custom-dropdown w-[110px] overflow-auto border-[1px] border-gray-500 bg-white outline-none rounded-md p-2 focus:outline-none text-gray-500 text-[14px]"
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
          <label>-</label>
          <select
            name="end_time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="custom-dropdown w-[110px] overflow-auto border-[1px] border-gray-500 bg-white outline-none rounded-md p-2 focus:outline-none text-gray-500 text-[14px]"
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
      <div className="mb-4 flex flex-row items-start space-x-2">
        <img src={LocalIcon.CarIcon} alt="" />
        <div className="flex flex-col">
          <label htmlFor="cars" className="text-[16px]">
            Ferry
          </label>
          <select
            className="border border-gray-300 rounded-lg focus:outline-none text-gray-800 placeholder:text-gray-400 px-4 py-[6px] pr-4 mt-2 text-[12px]"
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
          >
            {facilitynames?.data?.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center space-x-2">
        <div className="flex justify-start items-center gap-2">
          <input
            type="checkbox"
            id="departure"
            className="w-4 h-4 rounded focus:outline-none cursor-pointer"
            checked={departure}
            onChange={(e) => setDeparture(e.target.checked)}
          />
          <label
            htmlFor="departure"
            className="text-gray-700 cursor-pointer text-[13px]"
          >
            Departure
          </label>
        </div>
        <div className="flex justify-start items-center gap-2">
          <label
            htmlFor="departure-duration"
            className="text-gray-700 cursor-pointer text-[13px]"
          >
            Duration
          </label>
          <select
            name="departure-duration"
            value={departureDuration}
            onChange={(e) => setDepatureDuration(e.target.value)}
            className="custom-dropdown overflow-auto border-[1px] border-gray-300 bg-white outline-none rounded-md p-1 focus:outline-none text-gray-500 text-[13px]"
          >
            {durationTime?.map((time, index) => (
              <option value={`${time.time}:${time.minute}`} key={index}>
                {time.time}:{time.minute}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center space-x-2">
        <div className="flex justify-start items-center gap-2">
          <input
            type="checkbox"
            id="arrival"
            className="w-4 h-4 rounded focus:outline-none cursor-pointer"
            checked={returnTransport}
            onChange={(e) => setReturnTransport(e.target.checked)}
          />
          <label
            htmlFor="departure"
            className="text-gray-700 cursor-pointer text-[13px]"
          >
            Arrival
          </label>
        </div>
        <div className="flex justify-start items-center gap-2">
          <label
            htmlFor="arrival-duration"
            className="text-gray-700 cursor-pointer text-[13px]"
          >
            Duration
          </label>
          <select
            name="arrival-duration"
            value={arrivalDuration}
            onChange={(e) => setArrivalDuration(e.target.value)}
            className="custom-dropdown overflow-auto border-[1px] border-gray-300 bg-white outline-none rounded-md p-1 focus:outline-none text-gray-500 text-[13px]"
          >
            {durationTime?.map((time, index) => (
              <option value={`${time.time}:${time.minute}`} key={index}>
                {time.time}:{time.minute}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4 flex justify-between items-center space-x-2">
        <div className="flex justify-start items-center gap-2">
          <input
            type="checkbox"
            id="arrival"
            checked={approve}
            onChange={(e) => setApprove(e.target.checked)}
            className="w-4 h-4 rounded focus:outline-none cursor-pointer"
          />
          <label
            htmlFor="departure"
            className="text-gray-700 cursor-pointer text-[13px]"
          >
            Approve
          </label>
        </div>
      </div>
      <div className="mb-4 flex flex-row items-center space-x-2">
        <img src={LocalIcon.Edit2} alt="" />
        <textarea
          type="textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border border-gray-300 rounded-md w-full focus:outline-none p-2 text-gray-700 text-[13px]"
        >
          Remark
        </textarea>
      </div>
      <div className="mb-4 flex flex-row justify-between items-center gap-2">
        <>
          <button
            className="bg-[#FF7878] px-[10px] py-2 w-full rounded-[6px]"
            onClick={() => setShowDeleteModal(true)}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
          {showDeleteModal && (
            <div
              id="modal-overlay"
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={handleOutsideClick}
            >
              <div
                className="bg-white p-4 rounded-lg shadow-md w-[350px] border-t-[10px] border-[#FF7878]"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-[20px]">Delete Schedule</h2>
                <p className="text-[14px] mt-2">
                  Are you sure you want to delete this schedule?
                </p>
                <div className="flex justify-center items-center w-full space-x-2 mt-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-6 py-2 w-full border border-black rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-2 w-full bg-[#FF7878] rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
        <>
          <button
            className="bg-[#86E4AE] px-[10px] py-2 w-full rounded-[6px]"
            onClick={handleUpdateBooking}
            disabled={updateLoading}
          >
            {updateLoading ? "Saving..." : "Save"}
          </button>
          {showSuccessModal && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              onClick={() => setShowSuccessModal(false)} // Close when clicking outside
            >
              <div
                className="bg-white p-4 rounded-lg shadow-md w-[350px] border-t-[10px] border-[#86E4AE]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-[20px]">Booking Approved</h2>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5 cursor-pointer"
                    onClick={() => setShowSuccessModal(false)}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <p className="text-[14px] mt-2">
                  You have successfully approved the booking.
                </p>
              </div>
            </div>
          )}
        </>
      </div>
    </>
  );
}

export default EditBookingForFleet;
