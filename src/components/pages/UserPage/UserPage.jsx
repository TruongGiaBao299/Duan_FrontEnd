import React from "react";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";
import styles from "./UserPage.module.css";
import User from "../../../containers/User/User";

const UserPage = () => {
  return (
    <>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className={styles.main}>
        <User></User>
      </div>
    </>
  );
};

export default UserPage;
