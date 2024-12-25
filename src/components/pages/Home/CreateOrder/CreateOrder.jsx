import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createOrderApi } from "../../../../utils/api";
import { useNavigate } from "react-router-dom";
import styles from "./CreateOrder.module.css";
import { getLocationAPI } from "../../../../utils/locationAPI/locationAPI";

const CreateOrder = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const [locationCity, setLocationCity] = useState([]); // Store list of city names
  const [locationDistrict, setLocationDistrict] = useState([]); // Store list of district names
  const [locationWard, setLocationWard] = useState([]); // Store list of ward names
  const [selectedFromCity, setSelectedFromCity] = useState(""); // Selected city for From
  const [selectedToCity, setSelectedToCity] = useState(""); // Selected city for To
  const [selectedFromDistrict, setSelectedFromDistrict] = useState(""); // Selected district for From
  const [selectedToDistrict, setSelectedToDistrict] = useState(""); // Selected district for To

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await getLocationAPI();
        console.log("Location:", res);

        const LocationCity = res.map((location) => location.name);
        console.log("LocationCity:", LocationCity);

        if (res) {
          setLocation(res); // Save the received data
          setLocationCity(LocationCity); // Save list of city names
        } else {
          setLocation([]); // If no data, set empty
        }
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error("Lấy dữ liệu định vị thất bại. Vui lòng thử lại!");
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    if (selectedFromCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      setLocationDistrict(selectedCity ? selectedCity.districts : []);
    }
  }, [selectedFromCity]);

  useEffect(() => {
    if (selectedToCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedToCity
      );
      setLocationDistrict(selectedCity ? selectedCity.districts : []);
    }
  }, [selectedToCity]);

  useEffect(() => {
    if (selectedFromDistrict) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      const selectedDistrict = selectedCity?.districts.find(
        (district) => district.name === selectedFromDistrict
      );
      setLocationWard(selectedDistrict ? selectedDistrict.wards : []);
    }
  }, [selectedFromDistrict, selectedFromCity]);

  useEffect(() => {
    if (selectedToDistrict) {
      const selectedCity = location.find(
        (city) => city.name === selectedToCity
      );
      const selectedDistrict = selectedCity?.districts.find(
        (district) => district.name === selectedToDistrict
      );
      setLocationWard(selectedDistrict ? selectedDistrict.wards : []);
    }
  }, [selectedToDistrict, selectedToCity]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      senderName: formData.get("senderName"),
      senderNumber: formData.get("senderNumber"),
      fromAddress: formData.get("fromAddress"),
      fromDistrict: formData.get("fromDistrict"),
      fromWard: formData.get("fromWard"),
      fromCity: formData.get("fromCity"),
      recipientName: formData.get("recipientName"),
      recipientNumber: formData.get("recipientNumber"),
      toAddress: formData.get("toAddress"),
      toDistrict: formData.get("toDistrict"),
      toWard: formData.get("toWard"),
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
        data.fromWard,
        data.fromCity,
        data.recipientName,
        data.recipientNumber,
        data.toAddress,
        data.toDistrict,
        data.toWard,
        data.toCity,
        data.orderWeight,
        data.orderSize,
        data.type,
        data.message
      );

      console.log("Order Created: ", res);

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

        {/* Dropdown for From City */}
        <div className={styles.CreateOrderInput}>
          <label htmlFor="fromCity">From City</label>
          <select
            id="fromCity"
            name="fromCity"
            required
            value={selectedFromCity}
            onChange={(e) => setSelectedFromCity(e.target.value)}
          >
            <option value="">Select City</option>
            {locationCity.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* From District Dropdown */}
        <div className={styles.CreateOrderInput}>
          <label htmlFor="fromDistrict">From District</label>
          <select
            id="fromDistrict"
            name="fromDistrict"
            required
            value={selectedFromDistrict}
            onChange={(e) => setSelectedFromDistrict(e.target.value)}
          >
            <option value="">Select District</option>
            {selectedFromCity &&
              locationDistrict.map((district, index) => (
                <option key={index} value={district.name}>
                  {district.name}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="fromWard">From Ward</label>
          <select id="fromWard" name="fromWard" required>
            <option value="">Select Ward</option>
            {selectedFromDistrict &&
              locationWard.map((ward, index) => (
                <option key={index} value={ward.name}>
                  {ward.name}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="fromAddress">From Address</label>
          <input type="text" id="fromAddress" name="fromAddress" required />
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

        {/* Dropdown for To City */}
        <div className={styles.CreateOrderInput}>
          <label htmlFor="toCity">To City</label>
          <select
            id="toCity"
            name="toCity"
            required
            value={selectedToCity}
            onChange={(e) => setSelectedToCity(e.target.value)}
          >
            <option value="">Select City</option>
            {locationCity.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* To District Dropdown */}
        <div className={styles.CreateOrderInput}>
          <label htmlFor="toDistrict">To District</label>
          <select
            id="toDistrict"
            name="toDistrict"
            required
            value={selectedToDistrict}
            onChange={(e) => setSelectedToDistrict(e.target.value)}
          >
            <option value="">Select District</option>
            {selectedToCity &&
              locationDistrict.map((district, index) => (
                <option key={index} value={district.name}>
                  {district.name}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="toWard">To Ward</label>
          <select id="toWard" name="toWard" required>
            <option value="">Select Ward</option>
            {selectedToDistrict &&
              locationWard.map((ward, index) => (
                <option key={index} value={ward.name}>
                  {ward.name}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.CreateOrderInput}>
          <label htmlFor="toAddress">To Address</label>
          <input type="text" id="toAddress" name="toAddress" required />
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
