import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./PostOffice.module.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { getPostOfficeApi } from "../../../../utils/postOfficeAPI/postOfficeAPI";

// Hook để xử lý việc thay đổi vị trí và zoom bản đồ đến một tọa độ cụ thể
const MapViewUpdater = ({ latitude, longitude }) => {
  const map = useMap();
  if (latitude && longitude) {
    map.flyTo([latitude, longitude], 16);
  }
  return null;
};

const PostOffice = () => {
  const [data, setData] = useState([]);
  const [clickedLocation, setClickedLocation] = useState(null);

  const mapCenter = [10.789608489359983, 106.63981979487258]; // Tọa độ trung tâm mặc định

  useEffect(() => {
    const fetchPostOffices = async () => {
      try {
        const res = await getPostOfficeApi();
        console.log("PostOffice:", res);

        if (res) {
          setData(res); // Lưu dữ liệu nhận được
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
    setClickedLocation({ latitude, longitude });
  };

  return (
    <div className={styles.infocontainer}>
      <div className={styles.infocontent}>
        {data
          .filter((office) => office.status === "active") // Chỉ hiển thị các văn phòng có status là "active"
          .map((office, index) => (
            <div
              className={styles.infobox}
              key={index}
              onClick={() =>
                handleDivClick(office.OfficeLatitude, office.OfficeLongitude)
              }
            >
              <p>
                <FaHome /> {office.OfficeName}
              </p>
              <p>
                <FaPhoneAlt /> {office.OfficeHotline}
              </p>
              <p>
                <FaLocationDot /> {office.OfficeAddress}, District{" "}
                {office.OfficeDistrict}, {office.OfficeCity}
              </p>
            </div>
          ))}
      </div>
      <div className={styles.map}>
        <MapContainer
          center={mapCenter}
          zoom={12}
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

          {data
            .filter((office) => office.status === "active") // Chỉ hiển thị marker cho các văn phòng có status là "active"
            .map((office, index) => (
              <Marker
                key={index}
                position={[office.OfficeLatitude, office.OfficeLongitude]}
              >
                <Popup>
                  <div>
                    <p>
                      <strong>
                        <FaHome /> {office.OfficeName}
                      </strong>
                    </p>
                    <p>
                      <FaLocationDot /> {office.OfficeAddress}
                    </p>
                    <p>
                      <FaPhoneAlt /> {office.OfficeHotline}
                    </p>
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
