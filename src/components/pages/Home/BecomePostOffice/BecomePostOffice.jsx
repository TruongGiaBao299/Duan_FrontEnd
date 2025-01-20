import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/auth.context";
import {
  createPostOfficeApi,
  getPostOfficeApi,
} from "../../../../utils/postOfficeAPI/postOfficeAPI";
import { getLocationAPI } from "../../../../utils/locationAPI/locationAPI";

const BecomePostOffice = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [postOfficeData, setPostOfficeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false); // Trạng thái nếu đã nộp

  const [location, setLocation] = useState([]);
  const [locationCity, setLocationCity] = useState([]); // Store list of city names

  // Separate states for From and To dropdowns
  const [locationDistrictFrom, setLocationDistrictFrom] = useState([]);
  const [locationWardFrom, setLocationWardFrom] = useState([]);
  const [locationDistrictTo, setLocationDistrictTo] = useState([]);
  const [locationWardTo, setLocationWardTo] = useState([]);

  const [selectedFromCity, setSelectedFromCity] = useState(""); // Selected city for From
  const [selectedToCity, setSelectedToCity] = useState(""); // Selected city for To
  const [selectedFromDistrict, setSelectedFromDistrict] = useState(""); // Selected district for From
  const [selectedToDistrict, setSelectedToDistrict] = useState(""); // Selected district for To

  const [isLoading, setIsLoading] = useState(true); // Track loading state

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
        console.error("Error:", error);
        toast.error("Failed to fetch location data. Please try again!");
      } finally {
        setIsLoading(false); // Mark loading as complete
      }
    };

    fetchLocation();
  }, []);

  // Update districts for "From"
  useEffect(() => {
    if (selectedFromCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      setLocationDistrictFrom(selectedCity ? selectedCity.districts : []);
      setSelectedFromDistrict(""); // Reset district when city changes
      setLocationWardFrom([]); // Reset wards when city changes
    }
  }, [selectedFromCity]);

  // Update wards for "From"
  useEffect(() => {
    if (selectedFromDistrict) {
      const selectedCity = location.find(
        (city) => city.name === selectedFromCity
      );
      const selectedDistrict = selectedCity?.districts.find(
        (district) => district.name === selectedFromDistrict
      );
      setLocationWardFrom(selectedDistrict ? selectedDistrict.wards : []);
    }
  }, [selectedFromDistrict, selectedFromCity]);

  // Update districts for "To"
  useEffect(() => {
    if (selectedToCity) {
      const selectedCity = location.find(
        (city) => city.name === selectedToCity
      );
      setLocationDistrictTo(selectedCity ? selectedCity.districts : []);
      setSelectedToDistrict(""); // Reset district when city changes
      setLocationWardTo([]); // Reset wards when city changes
    }
  }, [selectedToCity]);

  // Update wards for "To"
  useEffect(() => {
    if (selectedToDistrict) {
      const selectedCity = location.find(
        (city) => city.name === selectedToCity
      );
      const selectedDistrict = selectedCity?.districts.find(
        (district) => district.name === selectedToDistrict
      );
      setLocationWardTo(selectedDistrict ? selectedDistrict.wards : []);
    }
  }, [selectedToDistrict, selectedToCity]);

  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        setLoading(true);
        const PostRes = await getPostOfficeApi();
        console.log("PostOffice:", PostRes);

        if (PostRes) {
          setPostOfficeData(PostRes); // Lưu dữ liệu nhận được
        } else {
          setPostOfficeData([]); // Nếu không có dữ liệu, set dữ liệu rỗng
        }

        // Kiểm tra xem email của người dùng đã có trong danh sách postoffice chưa
        const isAlreadyPost = PostRes.some(
          (post) => post.email === auth.user.email
        );
        setIsAlreadySubmitted(isAlreadyPost); // Cập nhật trạng thái
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error(
          "Lấy dữ liệu văn phòng bưu điện thất bại. Vui lòng thử lại!"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPostOffices();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      OfficeUserName: formData.get("OfficeUserName"),
      OfficeUserId: formData.get("OfficeUserId"),
      OfficeUserNumber: formData.get("OfficeUserNumber"),
      OfficeUserAddress: formData.get("OfficeUserAddress"),
      OfficeName: formData.get("OfficeName"),
      OfficeHotline: formData.get("OfficeHotline"),
      OfficeAddress: formData.get("OfficeAddress"),
      OfficeDistrict: formData.get("OfficeDistrict"),  
      OfficeWard: formData.get("OfficeWard"),
      OfficeCity: formData.get("OfficeCity"),
    };

    // Log dữ liệu trước khi gửi
    console.log("Data to send:", data);

    try {
      const res = await createPostOfficeApi(
        data.OfficeUserName,
        data.OfficeUserId,
        data.OfficeUserNumber,
        data.OfficeUserAddress,
        data.OfficeName,
        data.OfficeHotline,
        data.OfficeAddress,
        data.OfficeDistrict, 
        data.OfficeWard,
        data.OfficeCity,
      );

      if (res && res.data === null) {
        toast.error("Data is null!");
      } else {
        toast.success("PostOffice request sent!");
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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : isAlreadySubmitted ? ( // Kiểm tra nếu đã nộp
        <p>Your request has been sent, please wait for us to review.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="OfficeUserName">OfficeUserName</label>
            <input
              type="text"
              id="OfficeUserName"
              name="OfficeUserName"
              required
            />
          </div>

          <div>
            <label htmlFor="OfficeUserId">OfficeUserId</label>
            <input type="text" id="OfficeUserId" name="OfficeUserId" required />
          </div>

          <div>
            <label htmlFor="OfficeUserNumber">OfficeUserNumber</label>
            <input
              type="text"
              id="OfficeUserNumber"
              name="OfficeUserNumber"
              required
            />
          </div>

          <div>
            <label htmlFor="OfficeUserAddress">OfficeUserAddress</label>
            <input
              type="text"
              id="OfficeUserAddress"
              name="OfficeUserAddress"
              required
            />
          </div>

          <div>
            <label htmlFor="OfficeName">OfficeName</label>
            <input type="text" id="OfficeName" name="OfficeName" required />
          </div>

          <div>
            <label htmlFor="OfficeHotline">OfficeHotline</label>
            <input
              type="text"
              id="OfficeHotline"
              name="OfficeHotline"
              required
            />
          </div>

          <div>
            <label htmlFor="OfficeAddress">OfficeAddress</label>
            <input
              type="text"
              id="OfficeAddress"
              name="OfficeAddress"
              required
            />
          </div>

          {/* From City */}
          <div>
            <label htmlFor="OfficeCity">OfficeCity</label>
            <select
              id="OfficeCity"
              name="OfficeCity"
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

          {/* From District */}
          <div>
            <label htmlFor="OfficeDistrict">OfficeDistrict</label>
            <select
              id="OfficeDistrict"
              name="OfficeDistrict"
              required
              value={selectedFromDistrict}
              onChange={(e) => setSelectedFromDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {locationDistrictFrom.map((district, index) => (
                <option key={index} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          {/* From Ward */}
          <div>
            <label htmlFor="OfficeWard">OfficeWard</label>
            <select id="OfficeWard" name="OfficeWard" required>
              <option value="">Select Ward</option>
              {locationWardFrom.map((ward, index) => (
                <option key={index} value={ward.name}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nút Submit */}
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BecomePostOffice;
