import React, { useEffect, useState } from "react";
import styles from "./User.module.css";
import { getUserApi, makeDriverApi, makeGuestApi } from "../../utils/api";
import { toast } from "react-toastify";

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserApi();
        console.log("User:", res);
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
      const res = await makeDriverApi(userId);
      console.log("Become Driver Response:", res);
      toast.success("User role updated to driver successfully!");
      // Update the user's role in the table
      const updatedData = data.map((user) =>
        user._id === userId ? { ...user, role: "driver" } : user
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error making driver:", error);
      toast.error("Failed to update user role. Please try again.");
    }
  };

  const handleBecomeGuest = async (userId) => {
    try {
      const res = await makeGuestApi(userId);
      console.log("Become Guest Response:", res);
      toast.success("User role updated to guest successfully!");
      // Update the user's role in the table
      const updatedData = data.map((user) =>
        user._id === userId ? { ...user, role: "guest" } : user
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error making guest:", error);
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
              <th className={styles.tableuserHeader}>Name</th>
              <th className={styles.tableuserHeader}>Email</th>
              <th className={styles.tableuserHeader}>Role</th>
              <th className={styles.tableuserHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{user._id}</td>
                <td className={styles.tableCell}>{user.name}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.role}</td>
                <td className={styles.tableCell}>
                  {user.role !== "driver" ? (
                    user.role === "admin" ? (
                      <span className={styles.alreadyAdmin}>
                        Already an Admin
                      </span>
                    ) : (
                      <button
                        className={styles.becomeDriverButton}
                        onClick={() => handleBecomeDriver(user._id)}
                      >
                        Become a Driver
                      </button>
                    )
                  ) : (
                    <button
                        className={styles.becomeGuestButton}
                        onClick={() => handleBecomeGuest(user._id)}
                      >
                        Become a Guest
                      </button>
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

export default User;
