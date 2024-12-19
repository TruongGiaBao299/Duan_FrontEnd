import React, { useEffect, useState } from "react";
import styles from "./Driver.module.css";
import { getUserApi, makeDriverApi } from "../../utils/api";
import { toast } from "react-toastify";
import { changeStatusDriverApi, getDriverApi } from "../../utils/driverAPI/driverAPI";

const Driver = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getDriverApi();
        console.log("Driver:", res);
        if (res) {
          setData(res);
        } else {
          setData([]);
        }
      } catch (err) {
        toast.error("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleBecomeDriver = async (userId) => {
    try {
      const res = await changeStatusDriverApi(userId);
      console.log("Become Driver Response:", res);
      toast.success("Driver status updated to driver successfully!");
      // Update the user's role in the table
      const updatedData = data.map((user) =>
        user._id === userId ? { ...user, role: "driver", status: "active" } : user
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error making driver:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {loading ? (
        <p className={styles.loading}>Loading users...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : data.length === 0 ? (
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
            {data.map((user) => (
              <tr key={user._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{user._id}</td>
                <td className={styles.tableCell}>{user.DriverName}</td>
                <td className={styles.tableCell}>{user.DriverNumber}</td>
                <td className={styles.tableCell}>{user.DriverEmail}</td>
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
                      onClick={() => handleBecomeDriver(user._id)}
                    >
                      Accept Request
                    </button>
                  ) : (
                    <span className={styles.alreadyDriver}>
                      Request Accepted
                    </span>
                  )}
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
