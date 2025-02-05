import React, { useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px",
};

const center = {
  lat: 16.8409, // Default latitude (Yangon, Myanmar)
  lng: 96.1735, // Default longitude
};

const GoogleMapComponent = ({ onLocationSelect }) => {
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(center);
  const [address, setAddress] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);

  // Function to get the address from coordinates
  const fetchAddress = async (lat, lng) => {
    const apiKey = "AIzaSyB7fbPdevYiD3SB3wmlvZ36ubTH3Y--qGE";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    console.log(data?.results[0]?.formatted_address, "address");
    return "Unknown Location";
  };

  // Handle Map Click
  const handleMapClick = async (event) => {
    console.log(event, "event");
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    const formattedAddress = await fetchAddress(
      newLocation.lat,
      newLocation.lng
    );
    setSelectedLocation(newLocation);
    setAddress(formattedAddress);

    // Pass data to parent component
    onLocationSelect({
      name: formattedAddress,
      address: formattedAddress,
      latitude: newLocation.lat,
      longitude: newLocation.lng,
    });
  };

  return (
    <div className="w-full h-[300px]">
      <LoadScript
        googleMapsApiKey="AIzaSyB7fbPdevYiD3SB3wmlvZ36ubTH3Y--qGE"
        libraries={["places"]}
        onLoad={() => setMapLoaded(true)} // Ensure Google Maps API is loaded before rendering components
      >
        {mapLoaded && (
          <>
            <Autocomplete
              onLoad={(autocomplete) =>
                (autoCompleteRef.current = autocomplete)
              }
              onPlaceChanged={() => {
                if (autoCompleteRef.current) {
                  const place = autoCompleteRef.current.getPlace();
                  if (place.geometry) {
                    const newLocation = {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    };

                    setTimeout(() => {
                      setSelectedLocation(newLocation);
                      console.log(selectedLocation, "selectedLocation");
                      setAddress(place.formatted_address || "");

                      onLocationSelect({
                        name: place.formatted_address,
                        address: place.formatted_address,
                        latitude: newLocation.lat,
                        longitude: newLocation.lng,
                      });
                    }, 200);
                  }
                }
              }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search your location"
                className="w-full pb-2 border-b border-gray-300 mb-4 outline-none focus:border-[#05445E] text-sm text-[#05445E]"
              />
            </Autocomplete>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selectedLocation}
              zoom={14}
              onClick={handleMapClick}
            >
              <Marker position={selectedLocation} />
            </GoogleMap>
          </>
        )}
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
