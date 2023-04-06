import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, Modal, Space } from "antd";

import { getDetailLocationAction } from "../../../../../../redux/user/actions";

import "./styles.css";

const ModalChangeDeliveryAddress = ({ locationDetail }) => {
  const [
    isModalOpenChangeDeliveryAddress,
    setIsModalOpenChangeDeliveryAddress,
  ] = useState(false);

  const showModal = () => {
    setIsModalOpenChangeDeliveryAddress(!isModalOpenChangeDeliveryAddress);
  };

  const handleOk = () => {
    setIsModalOpenChangeDeliveryAddress(false);
  };
  const handleCancel = () => {
    setIsModalOpenChangeDeliveryAddress(false);
  };

  const renderLocationList = () => {
    if (locationDetail.data[0]?.id) {
      return locationDetail.data.map((item) => (
        <div className="delivery-address-item" key={item.id}>
          <div className="delivery-address-detail">
            <span style={{ fontSize: "16px", color: "black" }}>
              {item.fullName}{" "}
            </span>
            <span className="division-line"></span>
            <span style={{ marginLeft: "5px" }}>{item.phoneNumber}</span> <br />
            <span>{item.address}</span>
            <br />
            <span>{item.wardName}</span>,<span> {item.districtName}</span>,
            <span> {item.cityName}</span>
          </div>
          <Space className="delivery-address-action">
            <div className="choose-delivery-address">Chọn</div>
            <div className="division-line"></div>
            <div className="choose-delivery-address-default">
              Chọn và thiết lập mặc định
            </div>
          </Space>
        </div>
      ));
    }
  };

  return (
    <>
      <div onClick={showModal}>
        Thay đổi địa chỉ nhận hàng
      </div>
      <Modal
        title="Dịa chỉ nhận hàng"
        open={isModalOpenChangeDeliveryAddress}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
      >
        <div className="delivery-address-list">{renderLocationList()}</div>
      </Modal>
    </>
  );
};
export default ModalChangeDeliveryAddress;
