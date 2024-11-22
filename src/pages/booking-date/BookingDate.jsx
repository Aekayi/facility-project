import React, { useState } from "react";
import { useParams } from "react-router-dom";
// import { useBookMeetingRoomMutation } from "../apps/features/apiSlice";
import { Box, Button, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const BookingDate = () => {
  const { id } = useParams(); // Meeting room ID from URL
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  // const [bookMeetingRoom, { isLoading, isError, isSuccess, error }] =
  //   useBookMeetingRoomMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select both date and time.");
      return;
    }

    try {
      const bookingDetails = {
        date: selectedDate.format("YYYY-MM-DD"),
        timeSlot: selectedTime.format("HH:mm"),
        userId: "123",
      };
      const response = await bookMeetingRoom({ id, bookingDetails }).unwrap();
      console.log("Booking successful:", response);
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
      }}
    >
      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box mb={2}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Box>
          <Box mb={2}>
            <TimePicker
              label="Select Time"
              value={selectedTime}
              onChange={(newValue) => setSelectedTime(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth variant="outlined" />
              )}
            />
          </Box>
        </LocalizationProvider>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          // disabled={isLoading}
          sx={{ mb: 2 }}
        >
          Book
          {/* {isLoading ? <CircularProgress size={24} color="inherit" /> : "Book"} */}
        </Button>
        {/* {isError && (
          <Typography variant="body2" color="error" align="center">
            {error?.data?.message || "Booking failed. Please try again."}
          </Typography>
        )}
        {isSuccess && (
          <Typography variant="body2" color="success.main" align="center">
            Booking successful!
          </Typography>
        )} */}
      </form>
    </Box>
  );
};

export default BookingDate;
