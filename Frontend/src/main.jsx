import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { PersistGate } from "redux-persist/integration/react";

import "./styles/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App.jsx";
import { store, persistor } from "./redux/Store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
