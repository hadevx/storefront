import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import ToastWrapper from "./ToastWrapper.jsx";
import MaintenanceWrapper from "./components/MaintenanceWrapper.jsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const clientId = "ARh62ucz98HrJ_r4WDiHMt61gA47jcoXe_Negl3HXEgdwYYod2o0nhCfXJc7H5_R-ZnojyehsDgMV0U1";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PayPalScriptProvider options={{ "client-id": clientId }}>
        <BrowserRouter>
          <ToastWrapper>
            <MaintenanceWrapper>
              <App />
            </MaintenanceWrapper>
          </ToastWrapper>
        </BrowserRouter>
      </PayPalScriptProvider>
    </Provider>
  </StrictMode>
);
