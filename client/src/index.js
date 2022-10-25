import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import myConfigStore from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PersistGate } from "redux-persist/integration/react";
import { ConfirmProvider } from "material-ui-confirm";

const root = ReactDOM.createRoot(document.getElementById("root"));

const { store, persistor } = myConfigStore();

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HelmetProvider>
            <ConfirmProvider>
              <App />
            </ConfirmProvider>
          </HelmetProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
