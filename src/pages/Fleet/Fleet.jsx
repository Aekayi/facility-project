// export default Fleet;
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

// import Button from '../../components/button';

// Style

const Fleet = () => {
  const navigate = useNavigate();

  const cars = ["3A", "3B", "3C", "6A", "6B", "6C"];

  return (
    <div className="layout">
      <div className="container">
        <div className="car-page">
          <h2>Car Booking Page</h2>
          <div className="car-layout">
            {cars?.map((car, index) => (
              <button
                key={index}
                className={"car-btn"}
                onClick={() => navigate(`/fleet/${car}`)}
              >
                {car}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fleet;
