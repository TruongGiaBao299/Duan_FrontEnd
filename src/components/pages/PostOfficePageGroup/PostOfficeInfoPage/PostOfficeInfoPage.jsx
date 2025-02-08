import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import styles from "./PostOfficeInfoPage.module.css";
import PostOfficeInfo from "../../../../containers/PostOfficeInfo/PostofficeInfo";

const PostOfficeInfoPage = () => {
  return (
    <>
      <PostOfficeNavbar></PostOfficeNavbar>
      <PostOfficeSidebar></PostOfficeSidebar>
      <div className={styles.main}>
        {/* <ViewOrder></ViewOrder> */}
        <PostOfficeInfo></PostOfficeInfo>
      </div>
    </>
  );
};

export default PostOfficeInfoPage;
