import React, { useEffect, useState } from "react";
import styles from "./User.module.scss";
import Header from "../../layout/Header/Header";
import { getUserApi } from "../../../utils/api";

const User = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUserApi();
        console.log("User:",res);
        if (res) {
          setData(res);
        } else {
          setData([]);
        }
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
    <Header></Header>
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <button className={styles.addButton}>Add User</button>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading users...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : data.length === 0 ? (
        <p className={styles.noData}>No users found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Id</th>
              <th className={styles.tableHeader}>Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Role</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{user._id}</td>
                <td className={styles.tableCell}>{user.name}</td>
                <td className={styles.tableCell}>{user.email}</td>
                <td className={styles.tableCell}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
};

export default User;
