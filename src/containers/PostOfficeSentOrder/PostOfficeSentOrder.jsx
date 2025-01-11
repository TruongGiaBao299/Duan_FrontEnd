import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./PostOfficeSentOrder.module.css";
import {
  AcceptOrderApi,
  AcceptOrderPrepareApi,
  IsShippingOrderApi,
  SentPostOfficeApi,
} from "../../utils/driverAPI/driverAPI";
import {
  getPostOfficeByEmailApi,
  getPostOfficeOrderByEmailApi,
} from "../../utils/postOfficeAPI/postOfficeAPI";
import { getPostOfficeApi } from "../../utils/postOfficeAPI/postOfficeAPI";

const PostOfficeSentOrder = () => {
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const [emails, setEmails] = useState({}); // Lưu giá trị email cho từng đơn hàng
  const [post, setPost] = useState({}); // Lưu giá trị email cho từng đơn hàng
  const [postCity, setPostCity] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getPostOfficeOrderByEmailApi();
        console.log("Post Office Order by email:", res);
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

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getPostOfficeByEmailApi();
        console.log("Post Office by email:", res);
        console.log("Post Office City:", res.OfficeCity);

        // Filter orders to show only those with status "pending" or "is shipping"
        if (res) {
          setPost(res);
          setPostCity(res.OfficeCity)
        } else {
          setPost([]);
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
        if (res) {
          setData(res); // Lưu dữ liệu email bưu cục từ API
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to fetch post office data. Please try again!");
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

  const AcceptOrderPrepare = async (orderId) => {
    try {
      const res = await AcceptOrderPrepareApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      // Update the order's status in the UI
      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: "Prepare to delivery" }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  return (
    <div className={styles.driverordercontainer}>
      {orders.filter((order) => order.status === "delivery to post office" && order.fromCity === postCity)
        .length === 0 ? (
        <p>You don't have any orders to sent!</p>
      ) : (
        <div>
          <table className={styles.driverordertable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Sender Name</th>
                <th>Sender Number</th>
                <th>From Address</th>
                <th>Recipient Name</th>
                <th>Recipient Number</th>
                <th>To Address</th>
                <th>Order Weight</th>
                <th>Order Size</th>
                <th>Type</th>
                <th>Message</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created By</th>
                <th>Driver</th>
                <th>PostOffice</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((order) => order.status === "delivery to post office" && order.fromCity === postCity)
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.senderName}</td>
                    <td>{order.senderNumber}</td>
                    <td>
                      {`${order.fromAddress}, ${order.fromDistrict}, ${order.fromCity}`}
                    </td>
                    <td>{order.recipientName}</td>
                    <td>{order.recipientNumber}</td>
                    <td>
                      {order.toAddress}, {order.toDistrict}, {order.toCity}
                    </td>
                    <td>{order.orderWeight}</td>
                    <td>{order.orderSize}</td>
                    <td>{order.type}</td>
                    <td>{order.message}</td>
                    <td>{order.price}</td>
                    <td>{order.status}</td>
                    <td>{order.createdBy}</td>
                    <td>{order.driver}</td>
                    <td>{order.postOffice}</td>
                    <td>
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
                          {/* Filter post offices based on city */}
                          {data
                            .filter(
                              (postOffice) =>
                                postOffice.OfficeDistrict ===
                                  order.toDistrict || // Ưu tiên district
                                (postOffice.OfficeDistrict !==
                                  order.toDistrict &&
                                  postOffice.OfficeCity === order.toCity) // Sau đó xét đến city
                            )
                            .map((postOffice) => (
                              <option
                                key={postOffice.email}
                                value={postOffice.email}
                              >
                                {postOffice.OfficeName}
                              </option>
                            ))}
                        </select>
                        <button type="submit">Submit</button>
                      </form>
                    </td>
                    {/* <td>
                      <button
                        className=""
                        onClick={() => AcceptOrderPrepare(order._id)}
                      >
                        Accept Request
                      </button>
                    </td> */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PostOfficeSentOrder;
