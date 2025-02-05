import React, { useRef, useState } from "react";
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

const CreateGoogleMap = ({ onLocationSelect }) => {
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState(center);
  const [searchValue, setSearchValue] = useState(""); // Bind input value
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch address from coordinates
  const fetchAddress = async (lat, lng) => {
    const apiKey = "AIzaSyB7fbPdevYiD3SB3wmlvZ36ubTH3Y--qGE";
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      // console.log(
      //   data?.results[0]?.address_components?.long_name,
      //   "nameeeeeeee"
      // );
      if (data.results.length > 0) {
        return data.results[0].address_components[0].long_name;
      }
      return "Unknown Location";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Unknown Location";
    }
  };

  // Handle Map Click
  const handleMapClick = async (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    const formattedAddress = await fetchAddress(
      newLocation.lat,
      newLocation.lng
    );
    setSelectedLocation(newLocation);
    // setSearchValue(formattedAddress); // Update input field
    // console.log(searchValue, "searchValue");

    // Pass data to parent component
    onLocationSelect({
      name: formattedAddress,
      address: formattedAddress,
      latitude: newLocation.lat,
      longitude: newLocation.lng,
    });
  };

  // Handle Place Selection
  const handlePlaceChanged = async () => {
    if (autoCompleteRef.current) {
      const place = autoCompleteRef.current.getPlace();
      if (!place.geometry || !place.geometry.location) {
        alert("No details available for this location.");
        return;
      }

      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.name || place.formatted_address || "Unknown Address",
      };

      const formattedAddress =
        place.name || place.formatted_address || "Unknown Address";

      setSelectedLocation(newLocation);
      setSearchValue(newLocation.name); // Update input field

      setTimeout(() => {
        onLocationSelect({
          name: newLocation.name,
          address: formattedAddress,
          latitude: newLocation.lat,
          longitude: newLocation.lng,
        });
      }, 100);
    }
  };

  return (
    <div className="w-full h-[300px]">
      <LoadScript
        googleMapsApiKey="AIzaSyB7fbPdevYiD3SB3wmlvZ36ubTH3Y--qGE"
        libraries={["places"]}
        onLoad={() => setMapLoaded(true)}
      >
        {mapLoaded && (
          <>
            <Autocomplete
              onLoad={(autocomplete) => {
                autoCompleteRef.current = autocomplete;
                // autoCompleteRef.current.addListener(
                //   "place_changed",
                //   handlePlaceChanged
                // );
              }}
              // onPlaceChanged={() => {
              //   console.log("change");
              // }}
              onPlaceChanged={handlePlaceChanged}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search your location"
                value={searchValue} // Bind state to input field
                onChange={(e) => setSearchValue(e.target.value)}
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

export default CreateGoogleMap;
