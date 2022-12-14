import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Space,
  Card,
  Form,
  Input,
  Row,
  Col,
  InputNumber,
  Tooltip,
  Switch,
  Select,
  Upload,
  Spin,
} from "antd";
import {
  LeftOutlined,
  InfoCircleTwoTone,
  PlusCircleTwoTone,
  PlusOutlined,
  MinusCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import ReactQuill from "react-quill";
import slug from "slug";
import { ROUTES } from "../../../../constants/routes";
import {
  getCategoryListAction,
  createProductAction,
} from "../../../../redux/admin/actions";
import { convertImageToBase64 } from "../../../../utils/file";

import * as S from "./styles";
const CreateProductPageAdmin = () => {
  const { Option } = Select;
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createProductForm] = Form.useForm();

  const { categoryList } = useSelector((state) => state.categoryAdminReducer);
  const { createProduct } = useSelector((state) => state.productAdminReducer);

  useEffect(() => {
    dispatch(getCategoryListAction());
  }, []);

  const selectCategories = () => {
    return categoryList.data.map((item, index) => {
      return (
        <Option key={item.id} value={item.id}>
          {item.name}
        </Option>
      );
    });
  };

  const handleCreateProduct = async (values) => {
    const { options, images, ...productValues } = values;
    const newImages = [];
    for (let i = 0; i < images.length; i++) {
      const imgBase64 = await convertImageToBase64(images[i].originFileObj);
      await newImages.push({
        name: images[i].name,
        type: images[i].type,
        thumbUrl: images[i].thumbUrl,
        url: imgBase64,
      });
    }

    await dispatch(
      createProductAction({
        values: {
          ...productValues,
          slug: slug(productValues.name),
          status: values.status ? "??ang giao d???ch" : "Ng??ng giao d???ch",
        },
        options: options,
        images: newImages,
        callback: {
          resetCreateForm: () => createProductForm.resetFields(),
          redirectProductList: () => navigate(ROUTES.ADMIN.PRODUCT_LIST),
        },
      })
    );
  };

  return (
    <S.MainContainer>
      <Spin indicator={antIcon} spinning={createProduct.loading}>
        <div className="header">
          <Space>
            <span
              className="page-back"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(ROUTES.ADMIN.PRODUCT_LIST)}
            >
              <LeftOutlined />
              Quay l???i danh s??ch s???n ph???m
            </span>
          </Space>
          <Space>
            <Button onClick={() => navigate(ROUTES.ADMIN.PRODUCT_LIST)}>
              <span className="span-button">Tho??t</span>
            </Button>
            <Button type="primary" onClick={() => createProductForm.submit()}>
              <span className="span-button">L??u</span>
            </Button>
          </Space>
        </div>

        {/* Content */}
        <S.MainContent>
          <Form
            name="createProductForm"
            form={createProductForm}
            layout="vertical"
            onFinish={(values) => handleCreateProduct(values)}
            initialValues={{ status: true }}
          >
            <div className="card-list">
              <div className="card-list-left">
                <Card className="card-item" title="Th??ng tin chung">
                  <Form.Item
                    label="T??n s???n ph???m"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "B???n ch??a nh???p t??n s???n ph???m",
                      },
                    ]}
                  >
                    <Input placeholder="Nh???p t??n s???n ph???m" />
                  </Form.Item>
                </Card>

                <Card
                  className="card-item"
                  title="Gi?? s???n ph???m"
                  extra={
                    <Link
                      style={{
                        fontWeight: 500,
                      }}
                    >
                      <PlusCircleTwoTone
                        style={{ fontSize: 18, paddingRight: 5 }}
                      />
                      Th??m ch??nh s??ch gi??
                    </Link>
                  }
                >
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        label="Gi?? b??n l???"
                        name="price"
                        rules={[
                          {
                            required: true,
                            message: "B???n ch??a nh???p gi?? b??n",
                          },
                        ]}
                        tooltip={{
                          title: "Gi?? b??n cho c??c kh??ch h??ng mua l???",
                          icon: (
                            <InfoCircleTwoTone
                              style={{ margin: "0px 5px 8px" }}
                            />
                          ),
                        }}
                      >
                        <InputNumber
                          style={{
                            width: "100%",
                          }}
                          controls={false}
                          placeholder="Nh???p gi?? b??n l???"
                          formatter={(value) =>
                            value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Gi?? b??n nh???p"
                        name="priceImport"
                        tooltip={{
                          title: "Gi?? g???c b???n nh???p v??o",
                          icon: (
                            <InfoCircleTwoTone
                              style={{ margin: "0px 5px 8px" }}
                            />
                          ),
                        }}
                      >
                        <InputNumber
                          style={{
                            width: "100%",
                            textAlign: "right",
                          }}
                          controls={false}
                          formatter={(value) =>
                            value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={20}>
                    <Col span={12}>
                      <Form.Item
                        label="Gi?? sau gi???m gi??"
                        name="discountPrice"
                        rules={[
                          {
                            required: true,
                            message: "B???n ch??a nh???p gi?? sau gi???m gi??",
                          },
                        ]}
                        tooltip={{
                          title: "Gi?? b??n sau gi???m gi?? cho c??c kh??ch h??ng mua l???",
                          icon: (
                            <InfoCircleTwoTone
                              style={{ margin: "0px 5px 8px" }}
                            />
                          ),
                        }}
                      >
                        <InputNumber
                          style={{
                            width: "100%",
                          }}
                          controls={false}
                          placeholder="Nh???p gi?? sau gi???m gi??"
                          formatter={(value) =>
                            value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card className="card-item" title="N???i dung">
                  <Row>
                    <Col span={24}>
                      <Form.Item name="content">
                        <ReactQuill
                          theme="snow"
                          onChange={(value) =>
                            createProductForm.setFieldValue("content", value)
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card title="???nh s???n ph???m" className="card-item">
                  <Form.Item
                    name="images"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                      if (Array.isArray(e)) {
                        return e;
                      }
                      return e?.fileList;
                    }}
                    rules={[
                      {
                        required: true,
                        message: "B???n ch??a t???i l??n ???nh s???n ph???m",
                      },
                    ]}
                  >
                    <Upload
                      listType="picture-card"
                      beforeUpload={Upload.LIST_IGNORE}
                    >
                      <div>
                        <PlusOutlined />
                        <div
                          style={{
                            marginTop: 8,
                          }}
                        >
                          Upload
                        </div>
                      </div>
                    </Upload>
                  </Form.Item>
                </Card>

                <Card
                  title={
                    <Space
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "start",
                      }}
                    >
                      <Space>
                        Thu???c t??nh
                        <Tooltip title="T???o c??c thu???c t??nh ????? ph??n bi???t c??c phi??n b???n kh??c nhau c???a s???n ph???m. V?? d???: K??ch th?????c, M??u s???c, Ch???t li???u,...">
                          <InfoCircleTwoTone style={{ fontSize: 14 }} />
                        </Tooltip>
                      </Space>
                      <span style={{ fontWeight: 400, fontSize: 14 }}>
                        Th??m m???i thu???c t??nh gi??p s???n ph???m c?? nhi???u l???a ch???n, nh??
                        k??ch c??? hay m??u s???c
                      </span>
                    </Space>
                  }
                >
                  <Row gutter={20}>
                    <Col span={24}>
                      <Form.List name="options">
                        {(fields, callback) => (
                          <>
                            {fields.map((field) => (
                              <Card
                                key={field.key}
                                size="small"
                                style={{ marginBottom: 16 }}
                              >
                                <Form.Item
                                  {...field}
                                  label="Size"
                                  name={[field.name, "name"]}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  label="Gi?? c???ng th??m"
                                  name={[field.name, "bonusPrice"]}
                                >
                                  <InputNumber
                                    formatter={(value) =>
                                      value.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ","
                                      )
                                    }
                                    parser={(value) =>
                                      value.replace(/\$\s?|(,*)/g, "")
                                    }
                                    style={{ width: 200 }}
                                  />
                                </Form.Item>
                                <Button
                                  ghost
                                  danger
                                  onClick={() => callback.remove(field.name)}
                                >
                                  Delete
                                </Button>
                              </Card>
                            ))}
                            <Button
                              type="dashed"
                              block
                              icon={<PlusOutlined />}
                              onClick={() => callback.add()}
                            >
                              Add option
                            </Button>
                          </>
                        )}
                      </Form.List>
                    </Col>
                  </Row>
                </Card>
              </div>

              <div className="card-list-right">
                <Card className="card-item" title="Th??ng tin b??? sung">
                  <Form.Item
                    label="Lo???i s???n ph???m"
                    name="categoryId"
                    rules={[
                      {
                        required: true,
                        message: "B???n ch??a nh???p lo???i s???n ph???m",
                      },
                    ]}
                  >
                    <Select loading={categoryList.loading}>
                      {selectCategories()}
                    </Select>
                  </Form.Item>
                </Card>

                <div className="box-hashtag">
                  <Space>
                    <div style={{ fontWeight: 500 }}>G???n nh??n</div>
                    <Tooltip title="G???n nh??n s???n ph???m, ????? tr???ng n???u s???n ph???m kh??ng c?? nh??n">
                      <InfoCircleTwoTone style={{ fontSize: 14 }} />
                    </Tooltip>
                  </Space>

                  <div
                    style={{
                      marginTop: "16px",
                    }}
                  >
                    <Form.Item name="hashtagOne" label="Hashtag">
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </div>
                  <div
                    style={{
                      marginTop: "16px",
                    }}
                  >
                    <Form.Item name="hashtagTwo" label="Hashtag 2">
                      <Input style={{ width: "100%" }} />
                    </Form.Item>
                  </div>
                </div>

                <div className="box-status">
                  <Space>
                    <div style={{ fontWeight: 500 }}>Tr???ng th??i</div>
                    <Tooltip title="Cho ph??p t??m ki???m s???n ph???m v?? t???o ????n h??ng">
                      <InfoCircleTwoTone style={{ fontSize: 14 }} />
                    </Tooltip>
                  </Space>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Cho ph??p b??n</span>
                    <Form.Item name="status" valuePropName="checked">
                      <Switch
                        style={{ marginTop: "22px" }}
                        onChange={(value) => null}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>

            <Form.Item style={{ textAlign: "end" }}>
              <Space>
                <Button>
                  <span
                    className="span-button"
                    onClick={() => navigate(ROUTES.ADMIN.PRODUCT_LIST)}
                  >
                    Tho??t
                  </span>
                </Button>
                <Button type="primary" htmlType="submit">
                  <span className="span-button">L??u</span>
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </S.MainContent>
      </Spin>
    </S.MainContainer>
  );
};

export default CreateProductPageAdmin;
