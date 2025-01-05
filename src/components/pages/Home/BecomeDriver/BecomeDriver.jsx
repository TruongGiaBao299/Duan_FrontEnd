import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/auth.context";
import { createDriverApi, getDriverApi } from "../../../../utils/driverAPI/driverAPI";

const BecomeDriver = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth BecomeDriver: ", auth.user.email);

  const [userData, setUserData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Making both API calls concurrently using Promise.all
        const driverRes = await getDriverApi();

        console.log("Driver:", driverRes);

        const driverEmails = driverRes.map((driver) => driver.email);
        console.log("Driver Emails:", driverEmails);

        if (driverRes) {
          // Set driver data (or handle it as required)
          setDriverData(driverRes);
        } else {
          setDriverData([]); // If no driver data
        }
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once when the component mounts

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget; // Lấy form element
    const formData = new FormData(form);
  
    const data = {
      DriverName: formData.get("driverName"),
      DriverNumber: formData.get("driverNumber"),
      DriverBirth: formData.get("driverBirth"),
      DriverId: formData.get("driverId"),
      DriverAddress: formData.get("driverAddress"),
      DriverCity: formData.get("driverCity"),
    };
  
    try {
      // Check if the user has already submitted a request
      const isAlreadyDriver = driverData.some((driver) => driver.email === auth.user.email);
  
      if (isAlreadyDriver) {
        toast.error("You already sent a driver request!");
        return; // Prevent further execution
      }
  
      // Proceed with the API call if the email does not exist
      const res = await createDriverApi(
        data.DriverName,
        data.DriverNumber,
        data.DriverBirth,
        data.DriverId,
        data.DriverAddress,
        data.DriverCity
      );
  
      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("Driver request sent!");
        form.reset(); // Reset form input
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("You need to log in to fill out the form");
      navigate("/login");
    }
  };
  

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="driverName">DriverName</label>
          <input type="text" id="driverName" name="driverName" required />
        </div>

        <div className="">
          <label htmlFor="driverNumber">DriverNumber</label>
          <input type="text" id="driverNumber" name="driverNumber" required />
        </div>

        <div className="">
          <label htmlFor="driverBirth">DriverBirth</label>
          <input type="text" id="driverBirth" name="driverBirth" required />
        </div>

        <div className="">
          <label htmlFor="driverId">DriverId</label>
          <input type="text" id="driverId" name="driverId" required />
        </div>

        <div className="">
          <label htmlFor="driverAddress">DriverAddress</label>
          <input type="text" id="driverAddress" name="driverAddress" required />
        </div>

        <div className="">
          <label htmlFor="driverCity">DriverCity</label>
          <input type="text" id="driverCity" name="driverCity" required />
        </div>

        {/* Submit Button */}
        <div className="">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default BecomeDriver;
