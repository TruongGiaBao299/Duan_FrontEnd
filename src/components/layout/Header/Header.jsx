import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";
import { MdOutlineLocalShipping } from "react-icons/md";
import { getOrderByEmailApi } from "../../../utils/orderAPI/orderAPI";
import { FaHistory } from "react-icons/fa";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [orderCount, setOrderCount] = useState(0);
  const [coordinates, setCoordinates] = useState({ latitude: null, longitude: null }); // Tọa độ
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth: ", auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    if (token && auth?.user?.name) {
      setUsername(auth.user.name);
      fetchUserOrders(auth.user.email);
    } else {
      setUsername("");
      setOrderCount(0);
    }
  }, [auth]);

  useEffect(() => {
    const fetchCoordinates = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoordinates({ latitude, longitude });
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error("Unable to fetch location. Please enable location services.");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    };

    fetchCoordinates();
  }, []);

  const fetchUserOrders = async (email) => {
    try {
      const orders = await getOrderByEmailApi(email);
      console.log("Header order: ", orders);

      const pendingOrders = orders.filter(
        (order) => order.status === "pending" || order.status === "is shipping"
      );

      setOrderCount(pendingOrders.length);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    setAuth({
      isAuthenthicate: false,
      user: {
        email: "",
        name: "",
        role: "",
      },
    });

    navigateTo("/");
    window.location.reload();
    toast.success("Logged out successfully!");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <header className={styles.header}>
      <div className={styles.toolbar}>
        <nav className={styles.navLinks}>
          {isLoggedIn ? (
            <>
              <span className={styles.greeting}>Hello, {username}!</span>
              <button onClick={() => navigateTo("/")}>Home</button>
              <button onClick={() => navigateTo("/contact")}>Contact</button>
              <input className={styles.searchbar} type="text" placeholder="Search" />
              <button onClick={() => navigateTo("/vieworder")}>
                <MdOutlineLocalShipping />
                {orderCount > 0 && <span>{orderCount}</span>}
              </button>
              <button onClick={() => navigateTo("/viewhistory")}>
                <FaHistory />
              </button>
              <button onClick={handleLogout}>Logout</button>
              {/* {coordinates.latitude && coordinates.longitude && (
                <div className={styles.coordinates}>
                  <p>Latitude: {coordinates.latitude}</p>
                  <p>Longitude: {coordinates.longitude}</p>
                </div>
              )} */}
            </>
          ) : (
            <>
              <button onClick={() => navigateTo("/")}>Home</button>
              <button onClick={() => navigateTo("/contact")}>Contact</button>
              <input className={styles.searchbar} type="text" placeholder="Search" />
              <div className={styles.signup}>
                <button onClick={() => navigateTo("/login")}>Login</button>
                <div>/</div>
                <button onClick={() => navigateTo("/register")}>Register</button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
