import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./DriverSentOrder.module.css";
import {
  AcceptOrderApi,
  getDriverByEmailApi,
  IsShippingOrderApi,
} from "../../utils/driverAPI/driverAPI";
import { getOrderApi } from "../../utils/orderAPI/orderAPI";
import axios from "axios";

const HERE_API_KEY = "MnTadIKOVDRqhQYalpBxtEG3AiWROupfqiPOBzfiWsw"; // Replace with your actual API key from HERE API

const DriverSentOrder = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverCity, setDriverCity] = useState(""); // Driver city
  const [driverLocation, setDriverLocation] = useState(null); // Driver location
  const [distanceCache, setDistanceCache] = useState({}); // Cache for distances

  const AcceptOrder = async (orderId) => {
    try {
      const res = await AcceptOrderApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      const updatedOrders = orders.map((order) =>
        order._id === orderId
          ? { ...order, status: "delivery to post office" }
          : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  const AcceptOrderIsShipping = async (orderId) => {
    try {
      const res = await IsShippingOrderApi(orderId);
      console.log("Accept Order Response:", res);
      toast.success("Order status updated to driver successfully!");

      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: "is shipping" } : order
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error update:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  // Get driver's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDriverLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error fetching location:", error);
        toast.error("Unable to fetch your location");
      }
    );
  }, []);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrderApi();
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

  // Fetch driver info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getDriverByEmailApi();
        if (res) {
          setDrivers(res);
          setDriverCity(res.DriverCity); // Assuming the driver's city is available in the response
        } else {
          setDrivers([]);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Error fetching driver");
      }
    };
    fetchUser();
  }, []);

  // Calculate distance between driver's location and order's toAddress
  useEffect(() => {
    const calculateDistances = async () => {
      if (!driverLocation) return;

      const updatedCache = { ...distanceCache };
      for (const order of orders) {
        if (!updatedCache[order._id]) {
          try {
            const distance = await calculateDistance(order.toAddress);
            updatedCache[order._id] = distance;

            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay to avoid exceeding rate limits
          } catch (error) {
            console.error("Error calculating distance:", error);
          }
        }
      }
      setDistanceCache(updatedCache);
    };

    calculateDistances();
  }, [driverLocation, orders]);

  // Function to calculate distance using HERE API
  const calculateDistance = async (toAddress) => {
    try {
      const geocodeRes = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode`,
        {
          params: {
            q: toAddress,
            apiKey: HERE_API_KEY,
          },
        }
      );

      if (geocodeRes.data.items.length > 0) {
        const { lat: toLat, lng: toLng } = geocodeRes.data.items[0].position;

        if (driverLocation) {
          const fromLat = driverLocation.lat;
          const fromLng = driverLocation.lng;

          const R = 6371; // Earth's radius in kilometers
          const dLat = ((toLat - fromLat) * Math.PI) / 180;
          const dLng = ((toLng - fromLng) * Math.PI) / 180;

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((fromLat * Math.PI) / 180) *
              Math.cos((toLat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return distance.toFixed(2); // Return the distance in kilometers
        } else {
          throw new Error("Driver location not available.");
        }
      } else {
        throw new Error("Unable to fetch coordinates for the address.");
      }
    } catch (error) {
      console.error("Error calculating distance:", error);
      return "N/A";
    }
  };

  return (
    <div className={styles.driverordercontainer}>
      {orders.filter(
        (order) =>
          order.status === "prepare to delivery" && order.toCity === driverCity
      ).length === 0 ? (
        <p>You don't have any pending orders!</p>
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
                <th>Distance (km)</th> {/* Add the distance column */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter(
                  (order) =>
                    order.status === "prepare to delivery" &&
                    order.toCity === driverCity
                )
                .map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.senderName}</td>
                    <td>{order.senderNumber}</td>
                    <td>{`${order.fromAddress}, District: ${order.fromDistrict}, City: ${order.fromCity}`}</td>
                    <td>{order.recipientName}</td>
                    <td>{order.recipientNumber}</td>
                    <td>{`${order.toAddress}, District: ${order.toDistrict}, City: ${order.toCity}`}</td>
                    <td>{order.orderWeight}</td>
                    <td>{order.orderSize}</td>
                    <td>{order.type}</td>
                    <td>{order.message}</td>
                    <td>{order.price}</td>
                    <td>{order.status}</td>
                    <td>{order.createdBy}</td>
                    <td>{distanceCache[order._id] || "Calculating..."}</td> {/* Show the distance */}
                    <td>
                      <button
                        className={styles.becomeDriverButton}
                        onClick={() =>
                          order.status === "pending"
                            ? AcceptOrder(order._id)
                            : AcceptOrderIsShipping(order._id)
                        }
                      >
                        Accept Request
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DriverSentOrder;
