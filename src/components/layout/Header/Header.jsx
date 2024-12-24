import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";
import { MdOutlineLocalShipping } from "react-icons/md";
import { getOrderByEmailApi } from "../../../utils/orderAPI/orderAPI"; // Import your API call
import { FaHistory } from "react-icons/fa";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [orderCount, setOrderCount] = useState(0); // State for storing order count
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth: ", auth);

  useEffect(() => {
    const token = localStorage.getItem("access_token"); // Check for token
    setIsLoggedIn(!!token);

    // Check if auth object and user data are valid
    if (token && auth?.user?.name) {
      setUsername(auth.user.name); // Update username
      fetchUserOrders(auth.user.email); // Fetch orders when the user is logged in
    } else {
      setUsername("");
      setOrderCount(0); // Reset order count if not logged in
    }
  }, [auth]);

  const fetchUserOrders = async (email) => {
    try {
      const orders = await getOrderByEmailApi(email); // Fetch orders by email
      console.log("Header order: ", orders);
  
      // Filter orders to exclude those with the status "shipped"
      const pendingOrders = orders.filter(order => order.status === "pending" || order.status === "is shipping");
  
      setOrderCount(pendingOrders.length); // Set order count based on filtered orders
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrderCount(0); // Set order count to 0 in case of error
    }
  };
  

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

    // Force page reload to reset the state and UI
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
          {isLoggedIn ? ( // Check if logged in
            <>
              <span className={styles.greeting}>Hello, {username}!</span>
              <button onClick={() => navigateTo("/")}>Home</button>
              <button onClick={() => navigateTo("/contact")}>Contact</button>
              <input
                className={styles.searchbar}
                type="text"
                placeholder="Search"
              />
              <button onClick={() => navigateTo("/vieworder")}>
                <MdOutlineLocalShipping />
                {orderCount > 0 && <span>{orderCount}</span>} {/* Show order count */}
              </button>
              <button onClick={() => navigateTo("/viewhistory")}>
                <FaHistory />
              </button>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigateTo("/")}>Home</button>
              <button onClick={() => navigateTo("/contact")}>Contact</button>
              <input
                className={styles.searchbar}
                type="text"
                placeholder="Search"
              />
              <div className={styles.signup}>
                <button onClick={() => navigateTo("/login")}>Login</button>
                <div>/</div>
                <button onClick={() => navigateTo("/register")}>
                  Register
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
