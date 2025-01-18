import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./apps/store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { UserProvider } from "./context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <UserProvider>
        <App />
      </UserProvider>
    </PersistGate>
  </Provider>
);
