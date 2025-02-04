import React, { useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import Header from "../../layout/Header/Header";
import { AuthContext } from "../../../context/auth.context";
import { loginApi } from "../../../utils/userAPI/userAPI";
import logo from "../../../assets/Logo.png";
import { FaRegUserCircle } from "react-icons/fa";
import { IoLockClosed } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.currentTarget); // Extract form data
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await loginApi(email, password); // Call login API
      console.log("Login:", res);
      if (res && res.EC === 0) {
        console.log(res);
        setAuth({
          isAuthenthicate: true,
          user: {
            email: res.user.email,
            name: res.user.name,
            role: res.user.role,
          },
        });
        localStorage.setItem("access_token", res.access_token);
        localStorage.setItem("name", res.user.name);

        // Check if the user is an admin and navigate accordingly
        if (res.user.role === "admin") {
          navigate("/dashboard"); // Navigate to admin page if the user is admin
        } else if (res.user.role === "driver") {
          navigate("/driverhome"); // Navigate to admin page if the user is admin
        } else if (res.user.role === "postoffice") {
          navigate("/postofficehome"); // Navigate to admin page if the user is admin
        } else {
          navigate("/"); // Navigate to home for other users
        }

        toast.success("Login successfully!");
      } else if (res && res.EC === 2) {
        toast.error("Incorrect Password!");
      } else if (res && res.EC === 1) {
        toast.error("Email not found !");
      } else {
        toast.error("Error !");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred while logging in.");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.leftcontent}>
            <img src={logo} alt="Logo" />
            <p>
              Simplifying shipping, <br />
              one B at a time.
            </p>
          </div>
          <div className={styles.rightcontent}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.titlecontent}>
                <h1 className={styles.title}>WELCOME BACK!</h1>
                <h1 className={styles.subtitle}>Login to your account</h1>
              </div>

              <div className={styles.line}></div>

              {/* Email Field */}
              <div className={styles.field}>
                <FaRegUserCircle className={styles.fieldlogo} />
                <input
                  placeholder="Email"
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className={styles.field}>
                <IoLockClosed className={styles.fieldlogo} />
                <input
                  placeholder="Password"
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className={styles.button}>
                Login
              </button>

              <div>
                <div className={styles.ortitle}>
                  <div className={styles.grayline}></div>
                  <p className={styles.linetitle}>or</p>
                  <div className={styles.grayline}></div>
                </div>

                <h1 className={styles.subtitle}>
                  Don't have an account ?{" "}
                  <span
                    className={styles.linksubtitle}
                    onClick={() => navigate("/register")}
                  >
                    Sign up
                  </span>
                </h1>
              </div>

              <div className={styles.bottomtitle}>
                <p>BaShip</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
