import React from "react";
import styles from "./Admin.module.scss";
import Sidebar from "../../layout/Sidebar/Sidebar";
import Navbar from "../../layout/Navbar/Navbar";

const Admin = () => {
  return (
    <div className={styles.app}>
      <Sidebar></Sidebar>
      <Navbar></Navbar>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <h1>Welcome to MyApp</h1>
          <p>This is the main content area.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
