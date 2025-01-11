import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  changeStatusDriverApi,
  changeStatusDriverToGuestApi,
  deleteRequestDriver,
  getDriverApi,
} from "../../utils/driverAPI/driverAPI";
import { AuthContext } from "../../context/auth.context";
import { useNavigate } from "react-router-dom";
import {
  getUserApi,
  makeDriverApi,
  makeGuestApi,
} from "../../utils/userAPI/userAPI";
import "./PostOfficeManageDriver.css";
import { getPostOfficeByEmailApi } from "../../utils/postOfficeAPI/postOfficeAPI";

const PostOfficeManageDriver = () => {
  const [userData, setUserData] = useState([]);
  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [postOfficeEmail, setPostOfficeEmail] = useState("");

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch driver and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, driverRes] = await Promise.all([
          getUserApi(),
          getDriverApi(),
        ]);

        setUserData(userRes || []);
        setDriverData(driverRes || []);
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch the PostOffice email associated with the current user
  useEffect(() => {
    const fetchPostOfficeEmail = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        if (res && res.email) {
          setPostOfficeEmail(res.email);
        } else {
          toast.error("Failed to fetch post office email.");
        }
      } catch (error) {
        console.error("Error fetching post office email:", error);
        toast.error("Error fetching post office email.");
      }
    };

    fetchPostOfficeEmail();
  }, []);

  const handleBecomeDriver = async (email) => {
    try {
      const [changeStatusResponse, makeDriverResponse] = await Promise.all([
        changeStatusDriverApi(email),
        makeDriverApi(email),
      ]);

      toast.success("Driver status and user role updated successfully!");

      const updatedDriverData = driverData.map((user) =>
        user.email === email
          ? { ...user, role: "driver", status: "active" }
          : user
      );
      setDriverData(updatedDriverData);

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
      const [changeStatusResponse, makeDriverResponse, deleteRequestResponse] =
        await Promise.all([
          changeStatusDriverToGuestApi(email),
          makeGuestApi(email),
          deleteRequestDriver(email),
        ]);

      toast.success(
        `${email} driver status and user role updated successfully!`
      );

      const updatedDriverData = driverData.filter(
        (driver) => driver.email !== email
      );
      setDriverData(updatedDriverData);

      const updatedUserData = userData.map((user) =>
        user.email === email ? { ...user, role: "guest" } : user
      );
      setUserData(updatedUserData);
    } catch (error) {
      console.error("Error handling driver request:", error);
      toast.error(
        "Failed to update user role and delete driver request. Please try again."
      );
    }
  };

  const handleDeleteDriverRequest = async (email) => {
    try {
      await deleteRequestDriver(email);
      toast.success(`${email} request was canceled`);

      const updatedDriverData = driverData.filter(
        (driver) => driver.email !== email
      );
      setDriverData(updatedDriverData);
    } catch (error) {
      console.error("Error deleting driver request:", error);
      toast.error(
        error.message || "Failed to delete driver request. Please try again."
      );
    }
  };

  // Filter drivers by postOfficeEmail
  const filteredDriverData = driverData.filter(
    (driver) => driver.postOffice === postOfficeEmail
  );

  return (
    <div>
      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredDriverData.length === 0 ? (
        <p>No driver requests found for this post office.</p>
      ) : (
        <table className="driver-table">
          <thead>
            <tr>
              <th>Id</th>
              <th>DriverName</th>
              <th>DriverNumber</th>
              <th>DriverEmail</th>
              <th>DriverBirth</th>
              <th>DriverId</th>
              <th>DriverAddress</th>
              <th>DriverCity</th>
              <th>PostOffice</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDriverData.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.DriverName}</td>
                <td>{user.DriverNumber}</td>
                <td>{user.email}</td>
                <td>{user.DriverBirth}</td>
                <td>{user.DriverId}</td>
                <td>{user.DriverAddress}</td>
                <td>{user.DriverCity}</td>
                <td>{user.postOffice}</td>
                <td>{user.status}</td>
                <td>{user.role}</td>
                <td>
                  {user.role !== "driver" ? (
                    <>
                      <button
                        className="driver-button accept"
                        onClick={() => handleBecomeDriver(user.email)}
                      >
                        Accept Request
                      </button>
                      <button
                        className="driver-button cancel"
                        onClick={() => handleDeleteDriverRequest(user.email)}
                      >
                        Cancel Request
                      </button>
                    </>
                  ) : (
                    <button
                      className="driver-button guest"
                      onClick={() => handleBecomeGuest(user.email)}
                    >
                      Become Guest
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

export default PostOfficeManageDriver;
