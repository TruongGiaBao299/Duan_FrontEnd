import React from "react";
import { toast } from "react-toastify";
import { createOrderApi } from "../../../../utils/api";
import { useNavigate } from "react-router-dom";
import styles from "./CreateOrder.module.css";

const CreateOrder = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget; // Lấy form element
    const formData = new FormData(form);

    const data = {
      senderName: formData.get("senderName"),
      senderNumber: formData.get("senderNumber"),
      fromAddress: formData.get("fromAddress"),
      fromDistrict: formData.get("fromDistrict"),
      fromCity: formData.get("fromCity"),
      recipientName: formData.get("recipientName"),
      recipientNumber: formData.get("recipientNumber"),
      toAddress: formData.get("toAddress"),
      toDistrict: formData.get("toDistrict"),
      toCity: formData.get("toCity"),
      orderWeight: formData.get("orderWeight"),
      orderSize: formData.get("orderSize"),
      type: formData.get("type"),
      message: formData.get("message"),
    };

    try {
      const res = await createOrderApi(
        data.senderName,
        data.senderNumber,
        data.fromAddress,
        data.fromDistrict,
        data.fromCity,
        data.recipientName,
        data.recipientNumber,
        data.toAddress,
        data.toDistrict,
        data.toCity,
        data.orderWeight,
        data.orderSize,
        data.type,
        data.message
      );

      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("Order created successfully!");
        form.reset(); // Reset form input
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("You need login to fill form");
      navigate("/login");
    }
  };

  return (
    <div className={styles.CreateOrderContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.CreateOrderInput}>
          <label htmlFor="senderName">Sender Name</label>
          <input type="text" id="senderName" name="senderName" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="senderNumber">Sender Number</label>
          <input type="text" id="senderNumber" name="senderNumber" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="fromAddress">From Address</label>
          <input type="text" id="fromAddress" name="fromAddress" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="fromDistrict">From District</label>
          <input type="text" id="fromDistrict" name="fromDistrict" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="fromCity">From City</label>
          <input type="text" id="fromCity" name="fromCity" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="recipientName">Recipient Name</label>
          <input type="text" id="recipientName" name="recipientName" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="recipientNumber">Recipient Number</label>
          <input
            type="text"
            id="recipientNumber"
            name="recipientNumber"
            required
          />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="toAddress">To Address</label>
          <input type="text" id="toAddress" name="toAddress" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="toDistrict">To District</label>
          <input type="text" id="toDistrict" name="toDistrict" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="toCity">To City</label>
          <input type="text" id="toCity" name="toCity" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="orderWeight">Order Weight</label>
          <input type="number" id="orderWeight" name="orderWeight" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="orderSize">Order Size</label>
          <input type="number" id="orderSize" name="orderSize" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="type">Type</label>
          <input type="text" id="type" name="type" required />
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="message">Message</label>
          <input type="text" id="message" name="message" required />
        </div>

        {/* Submit Button */}
        <div className={styles.CreateOrderSubmit}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
