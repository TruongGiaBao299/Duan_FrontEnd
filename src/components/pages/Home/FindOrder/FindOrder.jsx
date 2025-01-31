import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getOrderByIdApi } from "../../../../utils/orderAPI/orderAPI";
import styles from "./FindOrder.module.css";

const FindOrder = () => {
  const [orderInfo, setOrderInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Kiểm soát popup hiển thị
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      orderId: formData.get("orderId"),
    };

    try {
      const res = await getOrderByIdApi(data.orderId);
      if (res && res.data === null) {
        toast.error("Order not found");
      } else {
        setOrderInfo(res);
        setShowPopup(true); // Hiển thị popup khi tìm thấy đơn hàng
        toast.success("Order found successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
      toast.error("You need login to find your order");
    }
  };

  return (
    <div className={styles.FindOrderContainer}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Find Order</label>
        <p htmlFor=""> ( Enter Order ID to check Order information )</p>
        <div className={styles.FindOrderInputContainer}>
          <div className={styles.FindOrderInput}>
            <input
              placeholder="Find Order by Enter Order Code"
              type="text"
              id="orderId"
              name="orderId"
              required
            />
          </div>

          <div className={styles.FindOrderSubmit}>
            <button type="submit">Submit</button>
          </div>
        </div>
      </form>

      {/* Popup hiển thị thông tin đơn hàng */}
      {showPopup && orderInfo && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowPopup(false)}
        >
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setShowPopup(false)}
            >
              x
            </button>
            <h2>Order Details</h2>
            <p>
              <strong>Order ID:</strong> {orderInfo._id}
            </p>
            <p>
              <strong>Sender Name:</strong> {orderInfo.senderName}
            </p>
            <p>
              <strong>Sender Number:</strong> {orderInfo.senderNumber}
            </p>
            <p>
              <strong>From Address:</strong> {orderInfo.fromAddress},{" "}
              {orderInfo.fromDistrict}, {orderInfo.fromWard},{" "}
              {orderInfo.fromCity}
            </p>
            <p>
              <strong>Recipient Name:</strong> {orderInfo.recipientName}
            </p>
            <p>
              <strong>Recipient Number:</strong> {orderInfo.recipientNumber}
            </p>
            <p>
              <strong>To Address:</strong> {orderInfo.toAddress},{" "}
              {orderInfo.toDistrict}, {orderInfo.toWard}, {orderInfo.toCity}
            </p>
            <p>
              <strong>Order Weight:</strong> {orderInfo.orderWeight} kg,{" "}
              <strong>Order Size:</strong> {orderInfo.orderSize} m³,{" "}
              <strong>Type:</strong> {orderInfo.type}
            </p>
            <p>
              <strong>Message:</strong> {orderInfo.message}
            </p>
            <p>
              <strong>Price:</strong> {orderInfo.price}
            </p>
            <p>
              <strong>Status:</strong> {orderInfo.status}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindOrder;
