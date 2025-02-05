import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px",
};

const center = {
  lat: 16.8409,
  lng: 96.1735,
};

const NewLocation = ({
  locationName,
  setLocationName,
  locationAddress,
  setLocationAddress,
  setNewLocationModal,
  setLocation,
  onLocationSelect,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(center);

  const apiKey = "AIzaSyB7fbPdevYiD3SB3wmlvZ36ubTH3Y--qGE";

  const fetchCoordinates = async (address) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      setSelectedLocation({ lat, lng });
      return { lat, lng };
    }
    return null;
  };

  useEffect(() => {
    if (locationAddress) {
      fetchCoordinates(locationAddress).then((coords) => {
        if (coords) {
          onLocationSelect({
            name: locationName,
            address: locationAddress,
            latitude: coords.lat,
            longitude: coords.lng,
          });
        }
      });
    }
  }, [locationAddress]);

  const handleMapClick = async (event) => {
    const newLocation = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setSelectedLocation(newLocation);
  };

  return (
    <form>
      <div className="mb-4">
        <input
          id="locationName"
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Enter location name"
          className="w-full border-b-[1px] border-[#05445E] py-2 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <input
          id="locationAddress"
          type="text"
          value={locationAddress}
          onChange={(e) => setLocationAddress(e.target.value)}
          placeholder="Enter location address"
          className="w-full border-b-[1px] border-[#05445E] py-2 focus:outline-none"
        />
      </div>

      <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedLocation}
          zoom={14}
          onClick={handleMapClick}
        >
          <Marker position={selectedLocation} />
        </GoogleMap>
      </LoadScript>
    </form>
  );
};

export default NewLocation;
