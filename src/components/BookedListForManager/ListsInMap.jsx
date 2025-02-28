import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useMapLocationsQuery } from "../../apps/features/apiSlice";
import dayjs from "dayjs";
import LocalIcon from "../../assets/icons";
import MapPin from "../../assets/map-pin.png";
import ApprovedMapPin from "../../assets/approved-map-pin.png";
import EditFleetInMap from "../Popup/EditFleetInMap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { IconButton, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

function ListsInMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  const [locations, setLocations] = useState([]);
  const {
    data: mapLocations,
    isLoading,
    isError,
  } = useMapLocationsQuery({
    date: formatDate(selectedDate),
  });

  const handlePrevDay = () => {
    setSelectedDate((prev) => prev.subtract(1, "day"));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => prev.add(1, "day"));
  };

  useEffect(() => {
    // Load Google Maps script dynamically
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB7fbPdevYiD3SB3wmlvZ36ubTH3Y--qGE&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.google || isLoading || isError) return;

    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 16.8409, lng: 96.1735 },
      zoom: 12,
    });

    const infowindow = new window.google.maps.InfoWindow();

    if (mapLocations && mapLocations.length > 0) {
      mapLocations.forEach((booking) => {
        booking.locations.forEach((location) => {
          const lat = parseFloat(location.latitude);
          console.log(lat, "lattttt");
          const lng = parseFloat(location.longitude);
          if (isNaN(lat) || isNaN(lng)) return; // Skip invalid data

          const iconUrl =
            booking?.status === "booked" ? ApprovedMapPin : MapPin;
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: location.name,
            icon: {
              url: iconUrl, // Replace with your custom marker URL
              scaledSize: new window.google.maps.Size(40, 40), // Resize the marker (optional)
            },
          });

          marker.addListener("click", () => {
            // infowindow.setContent(
            //   `<div>
            //         <h3>${location.name}</h3>
            //         <p>${booking.start_time} to ${booking.end_time}</p>
            //       </div>`
            // );
            // infowindow.open(map, marker);
            setSelectedLocation({ ...location, booking });
            setSelectedBookingId(booking.id);
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="
                          align-items: center;
                          justify-content: space-between;
                          font-size: 12px;
                          font-weight: bold;
                          padding: 8px;
                          white-space: nowrap;
                          ">
                          <p>${booking.start_time} to ${booking.end_time}</p>
                          </div>
                      `,
            disableAutoPan: true,
          });
          infoWindow.open(map, marker);
        });
      });

      // Center the map to the first location
      const firstLocation = mapLocations[0].locations[0];
      if (firstLocation) {
        map.setCenter({
          lat: parseFloat(firstLocation.latitude),
          lng: parseFloat(firstLocation.longitude),
        });
      }
    }
  }, [mapLoaded, mapLocations, isLoading, isError]);

  return (
    <div className="relative w-full h-[1000px]">
      {/* Map Container */}
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      {selectedLocation && (
        <div className="absolute top-[14%] left-2 z-10 bg-white p-6 rounded-lg shadow-lg">
          <EditFleetInMap
            selectedBookingId={selectedBookingId}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}

      {/* Date Picker */}
      <div className="flex justify-center items-center absolute top-14 left-2 z-10 bg-white rounded-md shadow p-2">
        <img src={LocalIcon.Calendar} alt="Calendar" width={40} height={40} />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack direction="row" alignItems="center">
            <DatePicker
              value={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              format="DD, MMM YYYY"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiInputAdornment-root": {
                  display: "none",
                },
                "& .MuiOutlinedInput-root": {
                  padding: "2px",
                  width: "120px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiInputBase-root": {
                  height: "20px",
                  minWidth: "100px",
                },
              }}
            />
            <IconButton onClick={handlePrevDay}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextDay}>
              <ChevronRight />
            </IconButton>
          </Stack>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default ListsInMap;
