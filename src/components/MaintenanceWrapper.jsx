import React from "react";
import Maintenance from "./Maintenance";
import { useGetStoreStatusQuery } from "../redux/queries/maintenanceApi";

function MaintenanceWrapper({ children }) {
  const { data: storeStatus } = useGetStoreStatusQuery();
  if (storeStatus?.status === "maintenance") {
    return <Maintenance />;
  }

  return <>{children}</>; // Correctly render the children
}

export default MaintenanceWrapper;
