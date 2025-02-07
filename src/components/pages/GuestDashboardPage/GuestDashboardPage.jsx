import React from 'react'
import styles from "./GuestDashboardPage.module.css";
import GuestNavbar from '../../layout/GuestNavbar/GuestNavbar';
import GuestSidebar from '../../layout/GuestSidebar/GuestSidebar';

const GuestDashboardPage = () => {
  return (
    <>
    <GuestNavbar></GuestNavbar>
    <GuestSidebar></GuestSidebar>
    <div className={styles.main}>
    
    </div>
    </>
  )
}

export default GuestDashboardPage