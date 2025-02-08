import React from "react";
import PostOfficeNavbar from "../../../layout/PostOfficeNavbar/PostOfficeNavbar";
import PostOfficeSidebar from "../../../layout/PostOfficeSidebar/PostOfficeSidebar";
import Shipments from "../../../../containers/Shipments/Shipments";
import styles from "./PostOfficeInfoPage.module.css";
import ViewOrder from "../../../../containers/ViewOrder/ViewOrder";
import PostOfficeGetOrder from "../../../../containers/PostOfficeGetOrder/PostOfficeGetOrder";
import PostOfficeManageOrder from "../../../../containers/PostOfficeManageOrder/PostOfficeManageOrder";
import PostOfficeHistory from "../../../../containers/PostOfficeHistory/PostOfficeHistory";
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
