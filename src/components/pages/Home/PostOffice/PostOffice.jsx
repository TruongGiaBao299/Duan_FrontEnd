import React, { useState, useEffect, useRef } from "react";
import { getPostOfficeApi } from "../../../../utils/api";
import { toast } from "react-toastify";
import styles from "./PostOffice.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

// Hook để xử lý việc thay đổi vị trí và zoom bản đồ đến một tọa độ cụ thể
const MapViewUpdater = ({ latitude, longitude }) => {
  const map = useMap(); // Hook để truy cập vào instance của bản đồ
  if (latitude && longitude) {
    // Cập nhật vị trí và zoom của bản đồ khi có tọa độ
    map.flyTo([latitude, longitude], 16); // Đặt mức zoom là 19 để phóng to
  }
  return null; // Component này không render gì lên giao diện
};

const PostOffice = () => {
  const [data, setData] = useState([]); // Lưu trữ dữ liệu đã fetch từ API

  const mapCenter = [10.789608489359983, 106.63981979487258]; // Tọa độ trung tâm mặc định của bản đồ

  // Lấy dữ liệu văn phòng bưu điện từ API
  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const res = await getPostOfficeApi(); // Gọi API lấy dữ liệu
        console.log("Dữ liệu văn phòng bưu điện:", res);

        if (res) {
          setData(res); // Lưu dữ liệu nhận được vào state
        } else {
          setData([]); // Nếu không có dữ liệu, set dữ liệu rỗng
        }
      } catch (error) {
        console.error("Lỗi:", error);
        toast.error("Lấy dữ liệu văn phòng bưu điện thất bại. Vui lòng thử lại!");
      }
    };
    fetchPostOffices();
  }, []);

  const handleDivClick = (latitude, longitude) => {
    // Cập nhật tọa độ khi người dùng click vào một div
    setClickedLocation({ latitude, longitude });
  };

  const [clickedLocation, setClickedLocation] = useState(null); // Lưu trữ tọa độ của văn phòng được click

  return (
    <div className={styles.infocontainer}>
      <div className={styles.infocontent}>
        {data.map((office, index) => (
          <div
            className={styles.infobox}
            key={index}
            onClick={() =>
              handleDivClick(office.OfficeLatitude, office.OfficeLongitude) // Xử lý click vào div để cập nhật vị trí bản đồ
            }
          >
            <p><FaHome /> {office.OfficeName}</p>
            <p><FaPhoneAlt /> {office.OfficeHotline}</p>
            <p>
            <FaLocationDot /> {office.OfficeAddress}, District {office.OfficeDistrict}, {office.OfficeCity}
            </p>
          </div>
        ))}
      </div>
      <div className={styles.map}>
        <MapContainer
          center={mapCenter} // Tọa độ trung tâm mặc định
          zoom={12} // Mức zoom mặc định
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Cập nhật vị trí bản đồ nếu tọa độ được click thay đổi */}
          {clickedLocation && (
            <MapViewUpdater
              latitude={clickedLocation.latitude}
              longitude={clickedLocation.longitude}
            />
          )}

          {data.map((office, index) => (
            <Marker
              key={index}
              position={[office.OfficeLatitude, office.OfficeLongitude]} // Vị trí marker của văn phòng
            >
              <Popup>
                <div>
                  <p><strong><FaHome /> {office.OfficeName}</strong></p>
                  <p><FaLocationDot /> {office.OfficeAddress}</p>
                  <p><FaPhoneAlt /> {office.OfficeHotline}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default PostOffice;
