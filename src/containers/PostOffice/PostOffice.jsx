import React, { useContext, useEffect, useState } from "react";
import styles from "./PostOffice.module.css";
import { getPostOfficeApi, getUserApi, makeDriverApi } from "../../utils/api";
import { toast } from "react-toastify";
import { changeStatusNotActivatedPostOfficeApi, changeStatusPostOfficeApi } from "../../utils/postOfficeAPI/postOfficeAPI";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";

const PostOffice = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth PostOffice: ", auth.user.role);

  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if the user's role is not admin
    if (auth.user.role !== "admin") {
      navigate("/login"); // Redirect to the login page or another page
      return;
    }
  }, [auth, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getPostOfficeApi();
        console.log("PostOffice:", res);
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

  const handleActiveStatus = async (id) => {
    try {
      const res = await changeStatusPostOfficeApi(id);
      console.log("Status Post Office Response:", res);
      toast.success("Status Post Office active successfully!");
      // Update the user's role in the table
      const updatedData = data.map((Office) =>
        Office._id === id ? { ...Office, status: "active" } : Office
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const handleNotActiveStatus = async (id) => {
    try {
      const res = await changeStatusNotActivatedPostOfficeApi(id);
      console.log("Status Post Office Response:", res);
      toast.success("Status Post Office not activated successfully!");
      // Update the user's role in the table
      const updatedData = data.map((Office) =>
        Office._id === id ? { ...Office, status: "not activated" } : Office
      );
      setData(updatedData);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {loading ? (
        <p className={styles.loading}>Loading PostOffice...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : data.length === 0 ? (
        <p className={styles.noData}>No PostOffice found.</p>
      ) : (
        <table className={styles.tableuser}>
          <thead>
            <tr>
              <th className={styles.tableuserHeader}>Id</th>
              <th className={styles.tableuserHeader}>OfficeName</th>
              <th className={styles.tableuserHeader}>OfficeHotline</th>
              <th className={styles.tableuserHeader}>OfficeAddress</th>
              <th className={styles.tableuserHeader}>OfficeLocation</th>
              <th className={styles.tableuserHeader}>Status</th>
              <th className={styles.tableuserHeader}>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((Office) => (
              <tr key={Office._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{Office._id}</td>
                <td className={styles.tableCell}>{Office.OfficeName}</td>
                <td className={styles.tableCell}>{Office.OfficeHotline}</td>
                <td className={styles.tableCell}>{Office.OfficeAddress}, {Office.OfficeDistrict}, {Office.OfficeCity}</td>
                <td className={styles.tableCell}>{Office.OfficeLatitude}, {Office.OfficeLongitude}</td>
                <td className={styles.tableCell}>{Office.status}</td>
                <td className={styles.tableCell}>
                  {Office.status !== "active" ? (
                    <button
                      className={styles.becomeDriverButton}
                      onClick={() => handleActiveStatus(Office._id)}
                    >
                      Active Post Office
                    </button>
                  ) : (
                    <button
                      className={styles.becomeDriverButton}
                      onClick={() => handleNotActiveStatus(Office._id)}
                    >
                      Remove Active Post Office
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

export default PostOffice;
