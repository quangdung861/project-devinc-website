import React, { useEffect, useState } from "react";

import { Row, Col, Form, Input, Button, Avatar, Skeleton, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";

import { updateUserInfoAction } from "../../../../redux/user/actions";

import { convertImageToBase64 } from "../../../../utils/file";

import * as S from "./styles";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [profileForm] = Form.useForm();
  const { userInfo } = useSelector((state) => state.userReducer);

  const initialValues = {
    email: userInfo.data.email || undefined,
    fullName: userInfo.data.fullName || undefined,
    phoneNumber: userInfo.data.phoneNumber || undefined,
  };

  const handleSubmitProfileForm = (values) => {
    dispatch(updateUserInfoAction({ userId: userInfo.data.id, ...values }));
  };

  const [imgPreview, setImgPreview] = useState("");

  useEffect(() => {
    profileForm.resetFields();
    const ipnFileElement = document.querySelector("#myFileInput");
    ipnFileElement?.addEventListener("change", function (e) {
      const file = e.target?.files[0];
      const imgPreview = convertImageToBase64(file);
      imgPreview.then((res) => {
        setImgPreview({
          userId: userInfo.data.id,
          avatar: {
            url: res,
            name: file.name,
            type: file.type,
          },
          callback: {
            resetImagePreview: () => {
              setImgPreview("");
            },
          },
        });
      });
    });
  }, [userInfo, imgPreview]);

  async function uploadImage() {
    if (imgPreview) {
      dispatch(updateUserInfoAction(imgPreview));
    }

    // var reader = new FileReader();
    // reader.onload = function(file) {
    //   var base64String = file.target.result;
    //   console.log(base64String);
    //   // Thực hiện các hành động xử lý với chuỗi base64String tại đây
    // };
    // reader.readAsDataURL(file);
  }

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
              <Col span={24}>
                <h2>Hồ sơ của tôi</h2>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <div
                  style={{ borderBottom: "1px solid #ccc", paddingTop: 18 }}
                ></div>
              </Col>
            </Row>
            <Skeleton
              style={{ marginTop: 40 }}
              active
              loading={userInfo.loading}
            >
              <Row
                style={{
                  paddingTop: 24,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Col md={14} sm={24} xs={24} style={{ paddingRight: 50 }}>
                  <Form
                    form={profileForm}
                    name="profileForm"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      span: 16,
                    }}
                    initialValues={initialValues}
                    onFinish={(values) => handleSubmitProfileForm(values)}
                  >
                    <Form.Item
                      name="email"
                      label="Tên đăng nhập/Email"
                      rules={[
                        {
                          required: true,
                          message: "Bạn chưa nhập Tên đăng nhập/Email",
                        },
                      ]}
                    >
                      <Input style={{ height: 40 }} />
                    </Form.Item>
                    <Form.Item
                      name="fullName"
                      label="Tên"
                      rules={[
                        {
                          required: true,
                          message: "Bạn chưa nhập Tên",
                        },
                      ]}
                    >
                      <Input style={{ height: 40 }} />
                    </Form.Item>
                    <Form.Item
                      name="phoneNumber"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Bạn chưa nhập Số điện thoại",
                        },
                      ]}
                    >
                      <Input style={{ height: 40 }} />
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{
                        offset: 8,
                        span: 16,
                      }}
                    >
                      <Button
                        className="btn-submit"
                        type="primary"
                        danger
                        htmlType="submit"
                      >
                        Lưu
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>

                <Col md={10} sm={24} xs={24} className="content-right">
                  <Row>
                    <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 24,
                      }}
                    >
                      <Avatar
                        size={200}
                        src={
                          imgPreview.avatar?.url || userInfo.data.avatar?.url || "https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"
                        }
                      />
                    </Col>
                    <Col
                      span={24}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      {imgPreview ? (
                        <Space>
                          <Button onClick={() => setImgPreview("")}>Hủy</Button>
                          <Button type="danger" onClick={() => uploadImage()}>Lưu</Button>
                        </Space>
                      ) : (
                        <>
                          <label
                            htmlFor="myFileInput"
                            className="custom-file-label"
                          >
                            Thay đổi ảnh đại diện
                          </label>
                          <input
                            type="file"
                            id="myFileInput"
                            className="custom-file-input"
                          />
                        </>
                      )}
                    </Col>
                    {/* <Col
                      span={24}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 16,
                        color: "#9c9c9c",
                      }}
                    >
                      <div>
                        <div>Dụng lượng file tối đa 1 MB</div>
                        <div>Định dạng:.JPEG, .PNG</div>
                      </div>
                    </Col> */}
                  </Row>
                </Col>
              </Row>
            </Skeleton>
          </div>
        </Col>
      </Row>
    </S.Wrapper>
  );
};

export default ProfilePage;
