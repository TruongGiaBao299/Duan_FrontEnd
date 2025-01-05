import React from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { createUserApi } from "../../../utils/userAPI/userAPI";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await createUserApi(data.name, data.email, data.password);
      console.log("Register:", res);
      if (res && res.data === null) {
        toast.error("Email has been registered !");
      } else {
        navigate("/");
        toast.success("Registered successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Register</h1>

        {/* Name Field */}
        <div className={styles.field}>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>

        {/* Email Field */}
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>

        {/* Password Field */}
        <div className={styles.field}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>

        {/* Submit Button */}
        <button type="submit" className={styles.button}>
          Submit
        </button>

        <h1 className={styles.subtitle}>
          already have account ?{" "}
          <span
            className={styles.linksubtitle}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </h1>
      </form>
    </div>
  );
};

export default Register;
