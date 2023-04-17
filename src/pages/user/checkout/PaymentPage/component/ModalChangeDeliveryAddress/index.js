import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Modal,
  Space,
  Radio,
  message,
  Tag,
  Form,
  Input,
  Select,
  Checkbox,
  Spin,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  getDistrictListAction,
  getWardListAction,
  clearLocationAction,
  createLocationAction,
} from "../../../../../../redux/user/actions";

import notification from "../../../../../../assets/images/notification.png";

import "./styles.css";

const ModalChangeDeliveryAddress = ({
  locationList,
  locationDefaultId,
  paymentForm,
  userInfo,
}) => {
  const dispatch = useDispatch();

  const { Option } = Select;
  const { TextArea } = Input;

  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

  const [formCreateDeliveryAddress] = Form.useForm();

  const [locationId, setValue] = useState();

  const { cityList, districtList, wardList, createLocationData } = useSelector(
    (state) => state.locationReducer
  );

  useEffect(() => {
    setValue(locationDefaultId);
  }, [locationDefaultId]);

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

  const renderLocationList = locationList?.map((item, index) => {
    return (
      <Radio value={item.id} key={item.id} style={{ marginBottom: "8px" }}>
        <div className="delivery-address-item">
          <div className="delivery-address-detail">
            <span style={{ fontSize: "16px", color: "black" }}>
              {item.fullName}
            </span>
            <br />
            <span>{item.phoneNumber}</span> <br />
            <span>{item.address}</span>
            <br />
            <span>{item.wardName}</span>,<span> {item.districtName}</span>,
            <span> {item.cityName}</span>
          </div>
          <Space className="delivery-address-action">
            <div className="choose-delivery-address">Cập nhật</div>
          </Space>
        </div>
        <div>
          {item.default === 1 && (
            <Tag
              style={{
                color: "rgb(238, 77, 45)",
                borderColor: "rgb(238, 77, 45)",
                backgroundColor: "rgb(238, 77, 45, 0)",
              }}
            >
              Mặc định
            </Tag>
          )}
          <Tag
            style={{
              backgroundColor: "rgb(238, 77, 45, 0)",
            }}
          >
            Địa chỉ lấy hàng
          </Tag>
          <Tag
            style={{
              backgroundColor: "rgb(238, 77, 45, 0)",
            }}
          >
            Địa chỉ trả hàng
          </Tag>
        </div>
      </Radio>
    );
  });

  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const handleChooseLocation = async () => {
    const indexLocationChoose = await locationList.findIndex(
      (item) => item.id === locationId
    );

    dispatch(
      getDistrictListAction({
        cityCode: locationList[indexLocationChoose]?.cityId,
      })
    );
    dispatch(
      getWardListAction({
        districtCode: locationList[indexLocationChoose]?.districtId,
      })
    );

    await paymentForm.setFieldsValue({
      fullName: locationList[indexLocationChoose]?.fullName || "",
      phoneNumber: locationList[indexLocationChoose]?.phoneNumber || "",
      address: locationList[indexLocationChoose]?.address,
      cityCode: locationList[indexLocationChoose]?.cityId,
      districtCode: locationList[indexLocationChoose]?.districtId,
      wardCode: locationList[indexLocationChoose]?.wardId,
      method: "cod",
    });

    handleCancel();
    message.success("Cập nhật địa chỉ thành công");
  };

  const [isModalOpenCreateAddressNew, setIsModalOpenCreateAddressNew] =
    useState(false);

  const toggleModal = () => {
    setIsModalOpenChangeDeliveryAddress(!isModalOpenChangeDeliveryAddress);
    setIsModalOpenCreateAddressNew(!isModalOpenCreateAddressNew);
  };

  const handleCancelCreateAddress = () => {
    setIsModalOpenChangeDeliveryAddress(false);
    setIsModalOpenCreateAddressNew(false);
  };

  const renderCityList = useMemo(() => {
    return cityList.data?.map((item, index) => {
      return (
        <Option key={item.id} value={item.code}>
          {item.name}
        </Option>
      );
    });
  }, [cityList.data]);

  const renderDistrictList = useMemo(() => {
    return districtList.data.map((item, index) => {
      return (
        <Option key={item.id} value={item.code}>
          {item.name}
        </Option>
      );
    });
  }, [districtList.data.length]);

  const renderWardList = useMemo(() => {
    return wardList.data.map((item, index) => {
      return (
        <Option key={item.id} value={item.code}>
          {item.name}
        </Option>
      );
    });
  }, [wardList.data]);

  useEffect(() => {
    dispatch(clearLocationAction());
  }, [isModalOpenCreateAddressNew]);

  useEffect(() => {
    return () => dispatch(clearLocationAction());
  }, []);

  const [isDefault, setIsDefault] = useState(false);

  const handleAddDeliveryAddress = (values) => {

    const cityName = cityList?.data?.find(
      (item) => values.cityCode === item.code
    ).name;
    const districtName = districtList?.data?.find(
      (item) => item.code === values.districtCode
    ).name;
    const wardName = wardList?.data?.find(
      (item) => item.code === values.wardCode
    ).name;

    console.log(isDefault);

    dispatch(
      createLocationAction({
        ...values,
        cityId: values.cityCode,
        districtId: values.districtCode,
        wardId: values.wardCode,
        userId: userInfo?.data?.id,
        defaultAddress: isDefault ? 1 : 0,
        cityName,
        districtName,
        wardName,
        callback: {
          resetModalCreateLocation: formCreateDeliveryAddress.resetFields(),
          cancelModalCreateLocation: () => {
            setIsModalOpenCreateAddressNew(false);
            setIsModalOpenChangeDeliveryAddress(false);
            setIsDefault(false);
          },
        },
        locationList,
      })
    );
  };

  return (
      <div>
        <div onClick={showModal}>Thay đổi</div>

        <Modal
          title="Địa Chỉ Của Tôi"
          open={isModalOpenChangeDeliveryAddress}
          onOk={handleOk}
          onCancel={handleCancel}
          width={500}
          footer={
            <div>
              <Button
                style={{
                  height: "40px",
                  padding: "0px 50px",
                  border: "1px solid #ccc",
                }}
                type="text"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Button
                type="danger"
                style={{ height: "40px", padding: "0px 40px" }}
                onClick={() => handleChooseLocation()}
              >
                Xác nhận
              </Button>
            </div>
          }
        >
          <Radio.Group
            className="delivery-address-list"
            onChange={onChange}
            value={locationId}
          >
            {renderLocationList}
            <Button
              type="text"
              style={{
                height: "40px",
                fontSize: "16px",
                color: "#818181",
                border: "1px solid #B7B7B7",
                borderRadius: "2px",
                marginTop: "12px",
              }}
              onClick={() => toggleModal()}
            >
              <PlusOutlined />
              Thêm Địa Chỉ Mới
            </Button>
          </Radio.Group>
        </Modal>

        <Modal
          loading={createLocationData.loading}
          title="Địa Chỉ Mới"
          open={isModalOpenCreateAddressNew}
          onCancel={(values) => handleCancelCreateAddress(values)}
          width={500}
          footer={
            <div>
              <Button
                type="text"
                style={{
                  height: "40px",
                  padding: "0px 40px",
                  border: "1px solid #ccc",
                }}
                onClick={() => toggleModal()}
                disabled={createLocationData.loading}
              >
                Trở lại
              </Button>
              <Button
                type="danger"
                style={{
                  height: "40px",
                  padding: "0px 50px",
                  border: "1px solid #ccc",
                }}
                onClick={() => console.log(formCreateDeliveryAddress.submit())}
                disabled={createLocationData.loading}
              >
                Hoàn thành
              </Button>
            </div>
          }
        >
        <Spin spinning={createLocationData.loading} indicator={antIcon}>

          <Form
            form={formCreateDeliveryAddress}
            name="form-create-delivery-address"
            onFinish={handleAddDeliveryAddress}
            className="form-create-delivery-address"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              <Form.Item
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Họ và tên",
                  },
                ]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Họ và tên" />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập Số điện thoại",
                  },
                ]}
                style={{ flex: 1 }}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </div>

            <Form.Item
              name="cityCode"
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: 13, fontWeight: 300 }}>
                      Bạn chưa nhập Tỉnh/Thành phố
                    </span>
                  ),
                },
              ]}
            >
              <Select
                size="large"
                style={{ fontSize: 14 }}
                placeholder="Tỉnh/Thành phố"
                allowClear={true}
                onClear={() => {
                  dispatch(clearLocationAction());
                  formCreateDeliveryAddress.setFieldsValue({
                    districtCode: undefined,
                    wardCode: undefined,
                  });
                }}
                onChange={(value) => {
                  dispatch(clearLocationAction());
                  dispatch(getDistrictListAction({ cityCode: value }));
                  formCreateDeliveryAddress.setFieldsValue({
                    districtCode: undefined,
                    wardCode: undefined,
                  });
                }}
                loading={cityList.loading}
              >
                {renderCityList}
              </Select>
            </Form.Item>

            <Form.Item
              name="districtCode"
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: 13, fontWeight: 300 }}>
                      Bạn chưa nhập Quận/Huyện
                    </span>
                  ),
                },
              ]}
            >
              <Select
                size="large"
                style={{ fontSize: 14 }}
                placeholder="Quận/Huyện"
                loading={districtList.loading}
                onChange={(value) => {
                  dispatch(getWardListAction({ districtCode: value }));
                  formCreateDeliveryAddress.setFieldsValue({
                    wardCode: undefined,
                  });
                }}
                disabled={
                  !formCreateDeliveryAddress.getFieldValue().cityCode && true
                }
              >
                {renderDistrictList}
              </Select>
            </Form.Item>

            <Form.Item
              name="wardCode"
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: 13, fontWeight: 300 }}>
                      Bạn chưa nhập Phường/Xã
                    </span>
                  ),
                },
              ]}
            >
              <Select
                size="large"
                style={{ fontSize: 14 }}
                placeholder="Phường/Xã"
                loading={wardList.loading}
                disabled={
                  !formCreateDeliveryAddress.getFieldValue().districtCode &&
                  true
                }
              >
                {renderWardList}
              </Select>
            </Form.Item>

            <Form.Item
              name="address"
              rules={[
                {
                  required: true,
                  message: (
                    <span style={{ fontSize: 13, fontWeight: 300 }}>
                      Bạn chưa nhập Địa chỉ
                    </span>
                  ),
                },
              ]}
            >
              <TextArea rows={2} maxLength={100} placeholder="Địa chỉ cụ thể" />
            </Form.Item>
            <div className="detail-on-the-map">
              <div className="title-on-the-map">
                <img
                  style={{
                    width: "20px",
                    height: "100%",
                    objectFit: "cover",
                    marginRight: "8px",
                    marginTop: "5px",
                  }}
                  src={notification}
                  alt=""
                />
                <div>
                  <div style={{ color: "#f69113" }}>
                    Vui lòng ghim địa chỉ chính xác
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "rgba(0,0,0,.65)",
                      lineHeight: "15px",
                    }}
                  >
                    Hãy chắc chắn vị trí trên bản đồ được ghim đúng để De Vinc
                    gửi hàng cho bạn nhé!
                  </div>
                </div>
              </div>
              <div>
                <img
                  style={{ width: "100%" }}
                  src="https://t3.ftcdn.net/jpg/03/96/88/32/360_F_396883284_1APy4O6kZumSUDLE33VgJ3ADdMYt39Bv.jpg"
                  alt=""
                />
              </div>
            </div>
            <div style={{ marginTop: "12px" }}>
              <Checkbox
                checked={isDefault}
                onChange={() => setIsDefault(!isDefault)}
              >
                Đặt làm địa chỉ mặc định
              </Checkbox>
              <Checkbox disabled>Đặt làm địa chỉ nhận hàng</Checkbox>
              <Checkbox
                disabled
                style={{ marginLeft: "0px", marginTop: "8px" }}
              >
                Đặt làm địa chỉ trả hàng
              </Checkbox>
            </div>
          </Form>
    </Spin>

        </Modal>

      </div>
  );
};

export default ModalChangeDeliveryAddress;
