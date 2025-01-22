import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./DriverGetOrder.module.css";
import {
  AcceptOrderApi,
  getDriverByEmailApi,
  IsShippingOrderApi,
} from "../../utils/driverAPI/driverAPI";
import { getOrderApi } from "../../utils/orderAPI/orderAPI";

const HERE_API_KEY = "MnTadIKOVDRqhQYalpBxtEG3AiWROupfqiPOBzfiWsw"; // Replace with your actual API key from HERE API

const DriverGetOrder = () => {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [driverCity, setDriverCity] = useState("");
  const [driverLocation, setDriverLocation] = useState(null);
  const [distanceCache, setDistanceCache] = useState({}); // Cache for distances

  useEffect(() => {
    // Get the driver's current location
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

  useEffect(() => {
    // Fetch all orders
    const fetchOrders = async () => {
      try {
        const res = await getOrderApi();
        if (res && res.length > 0) {
          setOrders(res);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    // Fetch driver information
    const fetchDriver = async () => {
      try {
        const res = await getDriverByEmailApi();
        if (res) {
          setDrivers(res);
          setDriverCity(res.DriverCity);
        } else {
          setDrivers([]);
        }
      } catch (error) {
        console.error("Error fetching driver:", error);
        toast.error("Error fetching driver");
      }
    };

    fetchDriver();
  }, []);

  useEffect(() => {
    // Calculate distances for all orders with rate limiting
    const calculateDistances = async () => {
      if (!driverLocation) return;

      const updatedCache = { ...distanceCache };
      for (const order of orders) {
        if (!updatedCache[order._id]) {
          try {
            const distance = await calculateDistance(order.fromAddress);
            updatedCache[order._id] = distance;

            // Introduce a delay to avoid exceeding the API rate limits
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error("Error calculating distance:", error);
          }
        }
      }
      setDistanceCache(updatedCache);
    };

    calculateDistances();
  }, [driverLocation, orders]);

  const calculateDistance = async (fromAddress) => {
    try {
      const geocodeRes = await axios.get(
        `https://geocode.search.hereapi.com/v1/geocode`,
        {
          params: {
            q: fromAddress,
            apiKey: HERE_API_KEY,
          },
        }
      );

      if (geocodeRes.data.items.length > 0) {
        const { lat: fromLat, lng: fromLng } = geocodeRes.data.items[0].position;

        if (driverLocation) {
          const toLat = driverLocation.lat;
          const toLng = driverLocation.lng;

          const R = 6371; // Radius of the Earth in kilometers
          const dLat = ((fromLat - toLat) * Math.PI) / 180;
          const dLng = ((fromLng - toLng) * Math.PI) / 180;

          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((toLat * Math.PI) / 180) *
              Math.cos((fromLat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          return distance.toFixed(2); // Return distance in kilometers
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

  const AcceptOrder = async (orderId) => {
    try {
      await AcceptOrderApi(orderId);
      toast.success("Order status updated successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: "delivery to post office" }
            : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  const AcceptOrderIsShipping = async (orderId) => {
    try {
      await IsShippingOrderApi(orderId);
      toast.success("Order status updated successfully!");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "is shipping" } : order
        )
      );
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order. Please try again.");
    }
  };

  const sortedOrders = orders
    .filter(
      (order) =>
        order.status === "pending" && order.fromCity === driverCity
    )
    .sort((a, b) => {
      const distanceA = parseFloat(distanceCache[a._id]) || Infinity;
      const distanceB = parseFloat(distanceCache[b._id]) || Infinity;
      return distanceA - distanceB; // Sort by distance ascending
    });

  return (
    <div className={styles.driverordercontainer}>
      {sortedOrders.length === 0 ? (
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
                <th>Distance (km)</th>
                <th>Recipient Name</th>
                <th>Recipient Number</th>
                <th>To Address</th>
                <th>Order Weight</th>
                <th>Order Size</th>
                <th>Type</th>
                <th>Message</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.senderName}</td>
                  <td>{order.senderNumber}</td>
                  <td>{order.fromAddress}</td>
                  <td>
                    {distanceCache[order._id] || "Calculating..."}
                  </td>
                  <td>{order.recipientName}</td>
                  <td>{order.recipientNumber}</td>
                  <td>{order.toAddress}</td>
                  <td>{order.orderWeight}</td>
                  <td>{order.orderSize}</td>
                  <td>{order.type}</td>
                  <td>{order.message}</td>
                  <td>{order.price}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      className={styles.acceptButton}
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

export default DriverGetOrder;
