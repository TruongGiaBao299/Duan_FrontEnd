import React, { useContext, useEffect, useState } from "react";
import DriverGetOrder from "../../../containers/DriverGetOrder/DriverGetOrder";
import DriverMangeOrder from "../../../containers/DriverManageOrder/DriverMangeOrder";
import { AuthContext } from "../../../context/auth.context";
import { useNavigate } from "react-router-dom";
import HeaderDriver from "../../layout/HeaderDriver/HeaderDriver";
import DriverSentOrder from "../../../containers/DriverSentOrder/DriverSentOrder";

const DriverHomePage = () => {
  const [currentPage, setCurrentPage] = useState("drivergetorder"); // State to track current page
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if the user is logged in

  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth Driver Home: ", auth.user.role);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage to determine if the user is logged in
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Set isLoggedIn to true if there's a token, otherwise false
  }, []);

  return (
    <>
      <HeaderDriver></HeaderDriver>
      <div>
        {/* Page navigation buttons */}
        <button onClick={() => setCurrentPage("drivergetorder")}>Get Order</button>
        <button onClick={() => setCurrentPage("sentorder")}>Sent Order</button>
        <button onClick={() => setCurrentPage("drivermanageorder")}>Manage Order</button>
      </div>

      {/* Display components based on the current page */}
      {currentPage === "drivergetorder" && <DriverGetOrder />}
      {currentPage === "sentorder" && <DriverSentOrder />}
      {currentPage === "drivermanageorder" && <DriverMangeOrder />}    
    </>
  );
};

export default DriverHomePage;
