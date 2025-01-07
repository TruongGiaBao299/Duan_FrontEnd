import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/auth.context";
import { createDriverApi, getDriverApi } from "../../../../utils/driverAPI/driverAPI";

const BecomeDriver = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [driverData, setDriverData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false); // Trạng thái nếu đã nộp

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const driverRes = await getDriverApi();

        // Kiểm tra xem email của người dùng đã có trong danh sách driver chưa
        const isAlreadyDriver = driverRes.some(
          (driver) => driver.email === auth.user.email
        );
        setIsAlreadySubmitted(isAlreadyDriver); // Cập nhật trạng thái
        setDriverData(driverRes || []);
      } catch (err) {
        toast.error("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [auth.user.email]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
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
        data.DriverCity
      );

      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("Driver request sent!");
        form.reset(); // Xóa dữ liệu form sau khi submit
        setIsAlreadySubmitted(true); // Cập nhật trạng thái
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("You need to log in to fill out the form");
      navigate("/login");
    }
  };

  return (
    <div className="">
      {loading ? (
        <p>Loading...</p>
      ) : isAlreadySubmitted ? ( // Kiểm tra nếu đã nộp
        <p>Your request has been sent, please wait for us to review.</p>
      ) : (
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

          {/* Nút Submit */}
          <div className="">
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BecomeDriver;
