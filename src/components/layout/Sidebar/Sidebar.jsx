import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";
import { MdDashboard } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { FaShippingFast } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import { TbTruckDelivery } from "react-icons/tb";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { IoIosSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Check for token
    setIsLoggedIn(!!token);

    // Check if auth object and user data are valid
    if (token && auth?.user?.name) {
      setUsername(auth.user.name); // Update username
    } else {
      setUsername("");
    }
  }, [auth]);

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // Remove token from storage
    setIsLoggedIn(false); // Update state
    setAuth({
      isAuthenthicate: false,
      user: {
        email: "",
        name: "",
        role: "",
      },
    });
    navigate("/"); // Redirect to home
    toast.success("Logged out successfully!");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <ul className={styles.menu}>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Dashboard" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Dashboard")}
          >
            <MdDashboard /> Dashboard
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Orders" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Orders")}
          >
            <BsBoxSeam/> Orders
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Shipments" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Shipments")}
          >
            <FaShippingFast /> Shipments
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Tracking" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Tracking")}
          >
            <FaMapLocationDot /> Tracking
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Delivery Request" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Delivery Request")}
          >
            <TbTruckDelivery /> Delivery Request
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Invoice" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Invoice")}
          >
            <FaFileInvoiceDollar /> Invoice
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Payment" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Payment")}
          >
            <MdOutlinePayment /> Payment
          </li>
          <li
            className={`${styles.menuItem} ${
              activeItem === "Reports" ? styles.active : ""
            }`}
            onClick={() => handleItemClick("Reports")}
          >
            <HiDocumentReport /> Reports
          </li>
        </ul>
      </div>
      <div className={styles.footer}>
        <ul className={styles.menu}>
          <li className={styles.menuItem}><IoIosSettings /> Setting</li>
          <li onClick={handleLogout} className={styles.menuItem}>
          <IoLogOutOutline /> Logout
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
