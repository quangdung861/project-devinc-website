import React, { useState, useEffect, useMemo } from "react";

import {
  Select,
  Row,
  Col,
  Form,
  Input,
  Button,
  Modal,
  Tag,
  Space,
  Spin,
  Skeleton,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import {
  getCityListAction,
  getDistrictListAction,
  getWardListAction,
  clearLocationAction,
  createLocationAction,
  deleteLocationAction,
  updateLocationAction,
  setDefaultLocationAction,
} from "../../../../redux/user/actions";

import * as S from "./styles";

const AddressPage = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const { TextArea } = Input;
  const { Option } = Select;
  const [createLocationForm] = Form.useForm();
  const [updateLocationForm] = Form.useForm();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userReducer);
  const {
    cityList,
    districtList,
    wardList,
    createLocationData,
    setDefaultLocationData,
  } = useSelector((state) => state.locationReducer);

  const [locationId, setLocationId] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const showUpdateModal = () => {
    setIsUpdateModalOpen(true);
  };
  const handleUpdateOk = () => {
    setIsUpdateModalOpen(false);
  };
  const handleUpdateCancel = () => {
    setIsUpdateModalOpen(false);
  };

  /////

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteLocationItem = (locationId) => {
    if (locationId) {
      dispatch(
        deleteLocationAction({
          locationId: locationId,
          userId: userInfo.data.id,
        })
      );
    }
  };

  const handleSubmitUpdateLocationForm = (values) => {
    const { cityCode, districtCode, wardCode, ...otherValues } = values;
    const cityData = cityList.data.find((item) => item.code === cityCode);
    const districtData = districtList.data.find(
      (item) => item.code === districtCode
    );
    const wardData = wardList.data.find((item) => item.code === wardCode);

    dispatch(
      updateLocationAction({
        ...otherValues,
        cityId: cityCode,
        districtId: districtCode,
        wardId: wardCode,
        cityName: cityData.name,
        districtName: districtData.name,
        wardName: wardData.name,
        userId: userInfo.data.id,
        locationId: locationId,
        callback: {
          resetModalUpdateLocation: updateLocationForm.resetFields(),
          cancelModalUpdateLocation: setIsUpdateModalOpen(false),
        },
      })
    );
  };

  //

  const handleSubmitCreateLocationForm = (values) => {
    const { cityCode, districtCode, wardCode, ...otherValues } = values;
    const cityData = cityList.data.find((item) => item.code === cityCode);
    const districtData = districtList.data.find(
      (item) => item.code === districtCode
    );
    const wardData = wardList.data.find((item) => item.code === wardCode);
    dispatch(
      createLocationAction({
        ...otherValues,
        cityId: cityCode,
        districtId: districtCode,
        wardId: wardCode,
        cityName: cityData.name,
        districtName: districtData.name,
        wardName: wardData.name,
        userId: userInfo.data.id,
        default: 0,
        callback: {
          resetModalCreateLocation: createLocationForm.resetFields(),
          cancelModalCreateLocation: () => setIsModalOpen(false),
        },
      })
    );
  };

  useEffect(() => {
    dispatch(getCityListAction());
  }, []);

  const handleChooseDefaultLocation = (locationId) => {
    dispatch(
      setDefaultLocationAction({ locationId, userId: userInfo.data.id })
    );
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

  const renderLocationList = () => {
    if (userInfo.data.id) {
      if (userInfo.data?.locations[0]?.address) {
        return userInfo.data.locations.map((item) => {
          return (
            <Skeleton key={item.id} active loading={setDefaultLocationAction.loading}>
              <Row span={24} style={{ paddingBottom: 18, color: "#7e7d7d" }}>
                <Col span={18}>
                  <Row>
                    <div style={{ fontSize: 16, color: "#000" }}>
                      {item.fullName}
                    </div>
                    <div
                      style={{
                        borderLeft: "1px solid #ccc",
                        margin: "0px 8px",
                      }}
                    ></div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {item.phoneNumber}
                    </div>
                  </Row>
                  <Row>{item.address}</Row>
                  <Row>
                    {item.wardName}, {item.districtName}, {item.cityName}
                  </Row>
                  <Row>
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
                  </Row>
                </Col>

                <Col span={6}>
                  <Row
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "8px",
                    }}
                  >
                    <Space>
                      <div
                        style={{ color: "rgb(0, 136, 255)", cursor: "pointer" }}
                        onClick={() => {
                          setLocationId(item.id);
                          showUpdateModal();
                        }}
                      >
                        Cập nhật
                      </div>
                      <div
                        style={{ color: "rgb(0, 136, 255)", cursor: "pointer" }}
                        onClick={() => handleDeleteLocationItem(item.id)}
                      >
                        Xóa
                      </div>
                    </Space>
                  </Row>
                  <Row style={{ display: "flex", justifyContent: "flex-end" }}>
                    {item.default === 0 && (
                      <Button
                        onClick={() => handleChooseDefaultLocation(item.id)}
                      >
                        Thiết lập mặc định
                      </Button>
                    )}
                  </Row>
                </Col>
              </Row>
            </Skeleton>
          );
        });
      }
    }
  };

  return (
    <S.Wrapper>
      <Row gutter={[16, 16]}>
        <Col md={4} sm={24} xs={24} className="sidebar">
          <Sidebar />
        </Col>
        <Col md={20} sm={24} xs={24}>
          <div
            style={{
              backgroundColor: "white",
              minHeight: "80vh",
              height: "100%",
              padding: "24px 30px",
            }}
          >
            <Row>
              <Col
                span={24}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Địa chỉ của tôi</h2>
                <div>
                  <Button
                    type="primary"
                    danger
                    style={{ width: 200, height: 40 }}
                    onClick={showModal}
                  >
                    <PlusOutlined />
                    Thêm địa chỉ mới
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div
                  style={{ borderBottom: "1px solid #ccc", paddingTop: 18 }}
                ></div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <h3 style={{ margin: "12px 0px" }}>Địa chỉ</h3>
              </Col>
            </Row>
            <Skeleton
              style={{ marginTop: 40 }}
              active
              loading={userInfo.loading}
            >
              {renderLocationList()}
            </Skeleton>
          </div>
        </Col>
      </Row>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            style={{ height: 40, width: 100 }}
            key="1"
            onClick={handleCancel}
          >
            Trở lại
          </Button>,
          <Button
            style={{ height: 40, width: 160 }}
            key="2"
            danger
            type="primary"
            onClick={() => createLocationForm.submit()}
          >
            Hoàn thành
          </Button>,
        ]}
      >
        <Form
          name="createLocationForm"
          form={createLocationForm}
          onFinish={(values) => handleSubmitCreateLocationForm(values)}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row>
                <h2 style={{ marginBottom: "16px" }}>Địa chỉ mới</h2>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: 13, fontWeight: 300 }}>
                            Bạn chưa nhập Họ và tên
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input style={{ height: "40px" }} placeholder="Họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: 13, fontWeight: 300 }}>
                            Bạn chưa nhập Số điện thoại
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      style={{ height: "40px" }}
                      placeholder="Số điện thoại"
                    />
                  </Form.Item>
                </Col>
              </Row>
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
                    createLocationForm.setFieldsValue({
                      districtCode: undefined,
                      wardCode: undefined,
                    });
                  }}
                  onChange={(value) => {
                    dispatch(clearLocationAction());
                    dispatch(getDistrictListAction({ cityCode: value }));
                    createLocationForm.setFieldsValue({
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
                style={{ fontSize: 14 }}
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
                  disabled={
                    createLocationForm.getFieldValue("cityCode") === undefined
                      ? true
                      : false
                  }
                  placeholder="Quận/Huyện"
                  loading={districtList.loading}
                  onChange={(value) => {
                    dispatch(getWardListAction({ districtCode: value }));
                    createLocationForm.setFieldsValue({
                      wardCode: undefined,
                    });
                  }}
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
                  disabled={
                    createLocationForm.getFieldValue("districtCode") ===
                    undefined
                      ? true
                      : false
                  }
                  placeholder="Phường/Xã"
                  loading={wardList.loading}
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
                <TextArea rows={2} placeholder="Địa chỉ" maxLength={60} />
              </Form.Item>
              <img
                style={{ width: "100%" }}
                src="https://t3.ftcdn.net/jpg/03/96/88/32/360_F_396883284_1APy4O6kZumSUDLE33VgJ3ADdMYt39Bv.jpg"
                alt=""
              />
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* UPDATE MODAL */}
      <Modal
        open={isUpdateModalOpen}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
        footer={[
          <Button
            style={{ height: 40, width: 100 }}
            key="1"
            onClick={handleUpdateCancel}
          >
            Trở lại
          </Button>,
          <Button
            style={{ height: 40, width: 160 }}
            key="2"
            danger
            type="primary"
            onClick={() => updateLocationForm.submit()}
          >
            Hoàn thành
          </Button>,
        ]}
      >
        <Form
          name="updateLocationForm"
          form={updateLocationForm}
          onFinish={(values) => handleSubmitUpdateLocationForm(values)}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Row>
                <h2 style={{ marginBottom: "16px" }}>Cập nhật địa chỉ</h2>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: 13, fontWeight: 300 }}>
                            Bạn chưa nhập Họ và tên
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input style={{ height: "40px" }} placeholder="Họ và tên" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phoneNumber"
                    rules={[
                      {
                        required: true,
                        message: (
                          <span style={{ fontSize: 13, fontWeight: 300 }}>
                            Bạn chưa nhập Số điện thoại
                          </span>
                        ),
                      },
                    ]}
                  >
                    <Input
                      style={{ height: "40px" }}
                      placeholder="Số điện thoại"
                    />
                  </Form.Item>
                </Col>
              </Row>
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
                    updateLocationForm.setFieldsValue({
                      districtCode: undefined,
                      wardCode: undefined,
                    });
                  }}
                  onChange={(value) => {
                    dispatch(clearLocationAction());
                    dispatch(getDistrictListAction({ cityCode: value }));
                    updateLocationForm.setFieldsValue({
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
                style={{ fontSize: 14 }}
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
                  disabled={
                    updateLocationForm.getFieldValue("cityCode") === undefined
                      ? true
                      : false
                  }
                  placeholder="Quận/Huyện"
                  loading={districtList.loading}
                  onChange={(value) => {
                    dispatch(getWardListAction({ districtCode: value }));
                    updateLocationForm.setFieldsValue({
                      wardCode: undefined,
                    });
                  }}
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
                  disabled={
                    updateLocationForm.getFieldValue("districtCode") ===
                    undefined
                      ? true
                      : false
                  }
                  placeholder="Phường/Xã"
                  loading={wardList.loading}
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
                <TextArea rows={2} placeholder="Địa chỉ" maxLength={60} />
              </Form.Item>
              <img
                style={{ width: "100%" }}
                src="https://t3.ftcdn.net/jpg/03/96/88/32/360_F_396883284_1APy4O6kZumSUDLE33VgJ3ADdMYt39Bv.jpg"
                alt=""
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </S.Wrapper>
  );
};

export default AddressPage;
