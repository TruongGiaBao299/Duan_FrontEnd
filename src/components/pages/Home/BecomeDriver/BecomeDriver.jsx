import React from "react";
import { toast } from "react-toastify";
import { createDriverApi } from "../../../../utils/api";
import { useNavigate } from "react-router-dom";

const BecomeDriver = () => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget; // Lấy form element
    const formData = new FormData(form);

    const data = {
        DriverName: formData.get("driverName"),
        DriverNumber: formData.get("driverNumber"),
        DriverBirth: formData.get("driverBirth"),
        DriverId: formData.get("driverId"),
        DriverAddress: formData.get("driverAddress"),
        DriverCity: formData.get("driverCity"),
    };

    try {
      const res = await createDriverApi(
        data.DriverName,
        data.DriverNumber,
        data.DriverBirth,
        data.DriverId,
        data.DriverAddress,
        data.DriverCity,
      );

      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("Driver request send!");
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
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="">
          <label htmlFor="driverName">DriverName</label>
          <input type="text" id="driverName" name="driverName" required />
        </div>

        <div className="">
          <label htmlFor="driverNumber">DriverNumber</label>
          <input type="text" id="driverNumber" name="driverNumber" required />
        </div>

        <div className="">
          <label htmlFor="driverBirth">DriverBirth</label>
          <input type="text" id="driverBirth" name="driverBirth" required />
        </div>

        <div className="">
          <label htmlFor="driverId">DriverId</label>
          <input type="text" id="driverId" name="driverId" required />
        </div>

        <div className="">
          <label htmlFor="driverAddress">DriverAddress</label>
          <input type="text" id="driverAddress" name="driverAddress" required />
        </div>

        <div className="">
          <label htmlFor="driverCity">DriverCity</label>
          <input type="text" id="driverCity" name="driverCity" required />
        </div>

        {/* Submit Button */}
        <div className="">
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default BecomeDriver;
