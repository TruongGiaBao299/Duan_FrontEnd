import React, { useEffect, useState } from "react";
import DriverGetOrder from "../../../containers/DriverGetOrder/DriverGetOrder";
import DriverMangeOrder from "../../../containers/DriverManageOrder/DriverMangeOrder";

const DriverHomePage = () => {
  const [currentPage, setCurrentPage] = useState("drivergetorder"); // State to track current page
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if the user is logged in

  useEffect(() => {
    // Check for token in localStorage to determine if the user is logged in
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if there's a token, otherwise false
  }, []);

  return (
    <>
      <div>
        {/* Page navigation buttons */}
        <button onClick={() => setCurrentPage("drivergetorder")}>Get Order</button>
        <button onClick={() => setCurrentPage("drivermanageorder")}>Manage Order</button>
      </div>

      {/* Display components based on the current page */}
      {currentPage === "drivergetorder" && <DriverGetOrder />}
      {currentPage === "drivermanageorder" && <DriverMangeOrder />}
    </>
  );
};

export default DriverHomePage;
