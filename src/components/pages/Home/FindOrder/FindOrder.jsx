import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getOrderByIdApi } from "../../../../utils/orderAPI/orderAPI";

const FindOrder = () => {
  const [orderInfo, setOrderInfo] = useState(null); // Lưu thông tin đơn hàng
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // Ngăn form reload lại trang
    const form = event.currentTarget; // Lấy form element
    const formData = new FormData(form);

    const data = {
      orderId: formData.get("orderId"),
    };

    try {
      const res = await getOrderByIdApi(data.orderId); // Gọi API với orderId
      if (res && res.data === null) {
        toast.error("Order not found");
      } else {
        setOrderInfo(res); // Lưu thông tin đơn hàng vào state
        toast.success("Order found successfully!");
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/login");
      toast.error("You need login to find your order");
    }
  };

  return (
    <div>
      <h1>Find Order</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="orderId">Order ID:</label>
          <input
            type="text"
            id="orderId"
            name="orderId"
            placeholder="Enter Order ID"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {/* Hiển thị thông tin đơn hàng nếu tìm thấy */}
      {orderInfo && (
        <div>
          <h2>Order Information</h2>
          <p><strong>Order ID:</strong> {orderInfo._id}</p>
          <p><strong>Sender Name:</strong> {orderInfo.senderName}</p>
          <p><strong>Sender Number:</strong> {orderInfo.senderNumber}</p>
          <p><strong>From Address:</strong> {orderInfo.fromAddress}</p>
          <p><strong>From District:</strong> {orderInfo.fromDistrict}</p>
          <p><strong>From City:</strong> {orderInfo.fromCity}</p>
          <p><strong>Recipient Name:</strong> {orderInfo.recipientName}</p>
          <p><strong>Recipient Number:</strong> {orderInfo.recipientNumber}</p>
          <p><strong>To Address:</strong> {orderInfo.toAddress}</p>
          <p><strong>To District:</strong> {orderInfo.toDistrict}</p>
          <p><strong>To City:</strong> {orderInfo.toCity}</p>
          <p><strong>Order Weight:</strong> {orderInfo.orderWeight}</p>
          <p><strong>Order Size:</strong> {orderInfo.orderSize}</p>
          <p><strong>Type:</strong> {orderInfo.type}</p>
          <p><strong>Message:</strong> {orderInfo.message}</p>
          <p><strong>Price:</strong> {orderInfo.price}</p>
          <p><strong>Status:</strong> {orderInfo.status}</p>
        </div>
      )}
    </div>
  );
};

export default FindOrder;
