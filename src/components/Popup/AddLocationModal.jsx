import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";

const AddLocationModal = ({ isOpen, onClose, onAddLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchBox, setSearchBox] = useState(null);

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  // Set default center to Yangon, Myanmar
  const defaultCenter = { lat: 16.8409, lng: 96.1735 };

  const handlePlaceSelected = () => {
    const place = searchBox.getPlace();
    if (place && place.geometry) {
      const { location } = place.geometry;
      setSelectedLocation({ lat: location.lat(), lng: location.lng() });
    }
  };

  return isOpen ? (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white rounded-lg shadow-lg p-4 max-w-lg w-full">
        <h3 className="text-lg font-bold mb-4">ဒေသတစ်ခုရွေးချယ်ပါ</h3>

        <LoadScript
          googleMapsApiKey="AIzaSyC72iyMfwdFaf5cVXzCuyh6VKE9T6G73eQ"
          libraries={["places"]}
          language="my"
          region="MM"
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedLocation || defaultCenter}
            zoom={10}
          >
            <Autocomplete
              onLoad={(autocomplete) => setSearchBox(autocomplete)}
              onPlaceChanged={handlePlaceSelected}
            >
              <input
                type="text"
                placeholder="ဒေသတစ်ခုရှာပါ"
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              />
            </Autocomplete>
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </LoadScript>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            ပယ်ဖျက်ပါ
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              onAddLocation(selectedLocation);
              onClose();
            }}
          >
            တည်နေရာရွေးချယ်ပါ
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AddLocationModal;
