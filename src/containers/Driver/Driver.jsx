import React, { useEffect, useState } from "react";
import styles from "./Driver.module.css";
import { getUserApi, makeDriverApi, makeGuestApi } from "../../utils/api";
import { toast } from "react-toastify";
import { changeStatusDriverApi, changeStatusDriverToGuestApi, deleteRequestDriver, getDriverApi } from "../../utils/driverAPI/driverAPI";

const Driver = () => {
  const [userData, setUserData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Making both API calls concurrently using Promise.all
        const [userRes, driverRes] = await Promise.all([getUserApi(), getDriverApi()]);
        
        console.log("User:", userRes);
        console.log("Driver:", driverRes);
  
        // Handling both responses
        if (userRes) {
          // Set user data (or handle it as required)
          setUserData(userRes);
        } else {
          setUserData([]); // If no user data
        }
  
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
  }, []);  // Empty dependency array to run once when the component mounts
  

  const handleBecomeDriver = async (email) => {
    try {
      // Run both API calls concurrently using Promise.all
      const [changeStatusResponse, makeDriverResponse] = await Promise.all([
        changeStatusDriverApi(email),
        makeDriverApi(email),
      ]);
  
      console.log("Change Status Driver Response:", changeStatusResponse);
      console.log("Make Driver Response:", makeDriverResponse);
  
      toast.success("Driver status and user role updated successfully!");
  
      // Update the user's role in the driverData table
      const updatedDriverData = driverData.map((user) =>
        user.email === email
          ? { ...user, role: "driver", status: "active" }
          : user
      );
      setDriverData(updatedDriverData);
  
      // Update the user's role in the userData table (if needed)
      const updatedUserData = userData.map((user) =>
        user.email === email ? { ...user, role: "driver" } : user
      );
      setUserData(updatedUserData);
  
    } catch (error) {
      console.error("Error making driver:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleBecomeGuest = async (email) => {
    try {
      // Run both API calls concurrently using Promise.all
      const [changeStatusResponse, makeDriverResponse] = await Promise.all([
        changeStatusDriverToGuestApi(email),
        makeGuestApi(email),
      ]);
  
      console.log("Change Status Driver Response:", changeStatusResponse);
      console.log("Make Driver Response:", makeDriverResponse);
  
      toast.success("Driver status and user role updated successfully!");
  
      // Update the user's role in the driverData table
      const updatedDriverData = driverData.map((user) =>
        user.email === email
          ? { ...user, role: "guest", status: "pending" }
          : user
      );
      setDriverData(updatedDriverData);
  
      // Update the user's role in the userData table (if needed)
      const updatedUserData = userData.map((user) =>
        user.email === email ? { ...user, role: "guest" } : user
      );
      setUserData(updatedUserData);
  
    } catch (error) {
      console.error("Error making driver:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleDeleteDriverRequest = async (email) => {
    try {
      const res = await deleteRequestDriver(email);
      toast.success(`${email} Request was canceled`);
  
      // Update the local state to remove the driver
      const updatedDriverData = driverData.filter((driver) => driver.email === email);
      setDriverData(updatedDriverData);
    } catch (error) {
      toast.error(error.message || "Failed to delete driver request.");
    }
  };
  
  
  return (
    <div className={styles.pageWrapper}>
      {loading ? (
        <p className={styles.loading}>Loading users...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : driverData.length === 0 ? (
        <p className={styles.noData}>No users found.</p>
      ) : (
        <table className={styles.tableuser}>
          <thead>
            <tr>
              <th className={styles.tableuserHeader}>Id</th>
              <th className={styles.tableuserHeader}>DriverName</th>
              <th className={styles.tableuserHeader}>DriverNumber</th>
              <th className={styles.tableuserHeader}>DriverEmail</th>
              <th className={styles.tableuserHeader}>DriverBirth</th>
              <th className={styles.tableuserHeader}>DriverId</th>
              <th className={styles.tableuserHeader}>DriverAddress</th>
              <th className={styles.tableuserHeader}>DriverCity</th>
              <th className={styles.tableuserHeader}>status</th>
              <th className={styles.tableuserHeader}>role</th>
            </tr>
          </thead>
          <tbody>
            {driverData.map((user) => (
              <tr key={user._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{user._id}</td>
                <td className={styles.tableCell}>{user.DriverName}</td>
                <td className={styles.tableCell}>{user.DriverNumber}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.DriverBirth}</td>
                <td className={styles.tableCell}>{user.DriverId}</td>
                <td className={styles.tableCell}>{user.DriverAddress}</td>
                <td className={styles.tableCell}>{user.DriverCity}</td>              
                <td className={styles.tableCell}>{user.status}</td>
                <td className={styles.tableCell}>{user.role}</td>
                <td className={styles.tableCell}>
                  {user.role !== "driver" ? (
                    <button
                      className={styles.becomeDriverButton}
                      onClick={() => handleBecomeDriver(user.email)}
                    >
                      Accept Request
                    </button>
                  ) : (
                    <button
                      className={styles.becomeGuestButton}
                      onClick={() => handleBecomeGuest(user.email)}
                    >
                      Become Guest
                    </button>
                  )}
                </td>
                <td className={styles.tableCell}>
          
                    <button
                      className={styles.becomeGuestButton}
                      onClick={() => handleDeleteDriverRequest(user.email)}
                    >
                      Cancel Request
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Driver;
