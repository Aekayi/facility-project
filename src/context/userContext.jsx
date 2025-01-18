import React, { createContext, useState } from "react";

// Create the context
export const UserContext = createContext();

// UserProvider component to wrap around the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data here

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
