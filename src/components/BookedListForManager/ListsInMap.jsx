import React, { useEffect, useRef, useState } from "react";
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
import Loading from "../loading/Loading";
import CloseIcon from "@mui/icons-material/Close";

function ListsInMap() {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));
  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };
  // const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleBookingSelect = (booking, location) => {
    setLoading(true); // Start loading

    setTimeout(() => {
      setSelectedLocation({ ...location, booking });
      setSelectedBookingId(booking.id);
      setLoading(false); // Stop loading after delay
    }, 1000); // Simulate API delay (1 second)
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

    // const infowindow = new window.google.maps.InfoWindow();
    const bounds = new window.google.maps.LatLngBounds();
    const hasValidLocation = false;

    if (mapLocations && mapLocations.length > 0) {
      mapLocations.forEach((booking) => {
        console.log(booking, "booking.....");
        booking.locations.forEach((location) => {
          const lat = parseFloat(location.latitude);
          // console.log(lat, "lattttt");
          const lng = parseFloat(location.longitude);
          if (isNaN(lat) || isNaN(lng)) return; // Skip invalid data

          const iconUrl =
            booking?.status === "pending" ? MapPin : ApprovedMapPin;
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map,
            title: location.name,
            icon: {
              url: iconUrl,
              scaledSize: new window.google.maps.Size(40, 40),
            },
          });

          bounds.extend(marker.getPosition());

          marker.addListener("click", () => {
            // infowindow.setContent(
            //   `<div>
            //         <h3>${location.name}</h3>
            //         <p>${booking.start_time} to ${booking.end_time}</p>
            //       </div>`
            // );
            // infowindow.open(map, marker);
            // setSelectedLocation({ ...location, booking });
            // setSelectedBookingId(booking.id);
            handleBookingSelect(booking, location);
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
                          <p>${booking.fleet_name}</p>
                          </div>
                      `,
            disableAutoPan: true,
          });
          infoWindow.open(map, marker);
        });
      });

      // map.fitBounds(bounds);

      // // Center the map to the first location
      // const firstLocation = mapLocations[0].locations[0];
      // if (firstLocation) {
      //   map.setCenter({
      //     lat: parseFloat(firstLocation.latitude),
      //     lng: parseFloat(firstLocation.longitude),
      //   });
      // }

      if (hasValidLocation) {
        map.fitBounds(bounds);
        if (map.getZoom() > 15) {
          map.setZoom(15); // Prevents zooming in too much
        }
      }
    }
  }, [mapLoaded, mapLocations, isLoading, isError]);

  return (
    <div className="relative w-full h-[1000px]">
      {/* Map Container */}
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
      {loading ? (
        <div className="absolute top-0 left-2 z-10 bg-white p-6 rounded-lg shadow-lg flex justify-center items-center h-[700px] w-[310px]">
          <Loading />
        </div>
      ) : selectedLocation ? (
        <div className="absolute top-0 left-2 z-10 w-[310px] bg-white px-6 rounded-lg shadow-lg">
          <IconButton
            onClick={() => setSelectedLocation(null)}
            className="absolute top-2 left-[230px]"
          >
            <CloseIcon />
          </IconButton>
          <EditFleetInMap
            selectedBookingId={selectedBookingId}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      ) : null}

      {/* Date Picker */}
      <div className="flex justify-center items-center absolute top-14 left-2 bg-white rounded-md shadow p-2">
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
