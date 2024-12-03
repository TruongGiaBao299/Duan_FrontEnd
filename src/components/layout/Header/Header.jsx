import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/auth.context";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  console.log("check auth: ", auth);

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
    <header className={styles.header}>
      <div className={styles.toolbar}>
        <nav className={styles.navLinks}>
          {isLoggedIn ? ( // Check if logged in
            <>
              <span className={styles.greeting}>Hello, {username}!</span>
              <button onClick={() => navigateTo("/")}>Home</button>
              <button onClick={() => navigateTo("/user")}>User</button>
              <button onClick={() => navigateTo("/contact")}>Contact</button>
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
