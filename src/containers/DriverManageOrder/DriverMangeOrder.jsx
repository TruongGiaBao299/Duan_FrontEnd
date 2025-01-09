import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  CancelledOrderApi,
  getDriverOrderByEmailApi,
  ShippedOrderApi,
  SentPostOfficeApi,
  getDriverByEmailApi,
} from "../../utils/driverAPI/driverAPI";
import { getPostOfficeApi } from "../../utils/postOfficeAPI/postOfficeAPI";

const DriverMangeOrder = () => {
  const [orders, setOrders] = useState([]);
  const [emails, setEmails] = useState({}); // Lưu giá trị email cho từng đơn hàng
  const [data, setData] = useState([]); // Dữ liệu bưu cục từ API
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getDriverOrderByEmailApi();
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getDriverByEmailApi();
        console.log("Driver by email:", res);

        // Filter orders to show only those with status "pending" or "is shipping"
        if (res && res.length) {
          setDrivers(res);
        } else {
          setDrivers([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const res = await getPostOfficeApi();
        console.log("Post:", res);
        if (res) {
          setData(res); // Lưu dữ liệu email bưu cục từ API
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error(
          "Lấy dữ liệu văn phòng bưu điện thất bại. Vui lòng thử lại!"
        );
      }
    };
    fetchPostOffices();
  }, []);

  const handleSubmit = async (e, orderId) => {
    e.preventDefault();
    const email = emails[orderId];

    if (!email) {
      toast.error("Please choose a valid email.");
      return;
    }

    try {
      await SentPostOfficeApi(orderId, email);
      toast.success("Post office email updated successfully!");

      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, postOffice: email } : order
      );
      setOrders(updatedOrders);

      setEmails((prev) => ({
        ...prev,
        [orderId]: "", // Reset email sau khi cập nhật
      }));
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  return (
    <div>
      {orders.length === 0 ? (
        <p>You don't have any orders!</p>
      ) : (
        <div>
          <h2>Order Information</h2>
          {orders.map((order) => (
            <div key={order._id}>
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Sender Name:</strong> {order.senderName}
              </p>
              <p>
                <strong>Sender Number:</strong> {order.senderNumber}
              </p>
              <p>
                <strong>From Address:</strong> {order.fromAddress}
              </p>
              <p>
                <strong>From District:</strong> {order.fromDistrict}
              </p>
              <p>
                <strong>From City:</strong> {order.fromCity}
              </p>
              <p>
                <strong>Recipient Name:</strong> {order.recipientName}
              </p>
              <p>
                <strong>Recipient Number:</strong> {order.recipientNumber}
              </p>
              <p>
                <strong>To Address:</strong> {order.toAddress}
              </p>
              <p>
                <strong>To District:</strong> {order.toDistrict}
              </p>
              <p>
                <strong>To City:</strong> {order.toCity}
              </p>
              <p>
                <strong>Order Weight:</strong> {order.orderWeight}
              </p>
              <p>
                <strong>Order Size:</strong> {order.orderSize}
              </p>
              <p>
                <strong>Type:</strong> {order.type}
              </p>
              <p>
                <strong>Message:</strong> {order.message}
              </p>
              <p>
                <strong>Price:</strong> {order.price}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Created By:</strong> {order.createdBy}
              </p>
              <p>
                <strong>Driver:</strong> {order.driver}
              </p>
              {order.postOffice && (
                <p>
                  <strong>PostOffice:</strong> {order.postOffice}
                </p>
              )}

              {/* Hiển thị form để cập nhật Post Office Email */}
              {!order.postOffice &&
                order.status !== "shipped" &&
                order.status !== "canceled" && (
                  <div>
                    <h3>Update Post Office Email</h3>
                    <form onSubmit={(e) => handleSubmit(e, order._id)}>
                      <select
                        value={emails[order._id] || ""}
                        onChange={(e) =>
                          setEmails((prev) => ({
                            ...prev,
                            [order._id]: e.target.value,
                          }))
                        }
                        required
                      >
                        <option value="">Select a Post Office</option>
                        {data
                          .filter(
                            (postOffice) =>
                              postOffice.OfficeDistrict ===
                                order.fromDistrict || // Ưu tiên district
                              (postOffice.OfficeDistrict !==
                                order.fromDistrict &&
                                postOffice.OfficeCity === order.fromCity) // Sau đó xét đến city
                          )

                          .map((postOffice) => (
                            <option
                              key={postOffice.email}
                              value={postOffice.email}
                            >
                              {postOffice.OfficeName}{" "}
                              {/* Hiển thị tên bưu cục */}
                            </option>
                          ))}
                      </select>
                      <button type="submit">Submit</button>
                    </form>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverMangeOrder;
