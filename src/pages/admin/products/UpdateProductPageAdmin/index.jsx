import React, { useEffect, useState, useMemo } from "react";
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
  Spin,
  Upload,
  Modal,
} from "antd";
import {
  LeftOutlined,
  InfoCircleTwoTone,
  PlusCircleTwoTone,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";
import { useNavigate, Link, useParams } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";
import {
  getCategoryListAction,
  getProductDetailAction,
  updateProductAction,
  clearProductDetailAction,
} from "../../../../redux/admin/actions";

import {
  convertBase64ToImage,
  convertImageToBase64,
} from "../../../../utils/file";
import slug from "slug";

import * as S from "./styles";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

const UpdateProductPageAdmin = () => {
  let { id } = useParams();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateProductForm] = Form.useForm();

  const { categoryList } = useSelector((state) => state.categoryAdminReducer);
  const { productDetail, updateProduct } = useSelector(
    (state) => state.productAdminReducer
  );

  const initialValues = {
    name: productDetail.data.name,
    categoryId: productDetail.data.categoryId,
    price: productDetail.data.price,
    priceImport: productDetail.data.priceImport,
    discountPrice: productDetail.data.discountPrice,
    options: productDetail.data.options,
    content: productDetail.data.content,
    status: productDetail.data.status === "??ang giao d???ch" ? true : false,
    hashtagOne: productDetail.data.hashtagOne,
    hashtagTwo: productDetail.data.hashtagTwo,
  };

  useEffect(() => {
    dispatch(getProductDetailAction({ id: id }));
    dispatch(getCategoryListAction());
  }, [id]);

  useEffect(() => {
    if (productDetail.data.id) {
      updateProductForm.resetFields();
      setImagesField(productDetail.data.images);
    }
  }, [productDetail.data]);

  useEffect(() => {
    return () => dispatch(clearProductDetailAction());
  }, []);

  const setImagesField = async (images) => {
    const newImages = [];

    for (let i = 0; i < images.length; i++) {
      const imageFile = await convertBase64ToImage(
        images[i].url,
        images[i].name,
        images[i].type
      );
      await newImages.push({
        id: images[i].id,
        lastModified: imageFile.lastModified,
        lastModifiedDate: imageFile.lastModifiedData,
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
        thumbUrl: images[i].thumbUrl,
        originFileObj: imageFile,
      });
    }
    await updateProductForm.setFieldValue("images", newImages);
  };

  const handleUpdateProduct = async (values) => {
    const { options, images, ...productValues } = values;

    const newImages = [];
    for (let i = 0; i < images.length; i++) {
      const imgBase64 = await convertImageToBase64(images[i].originFileObj);

      await newImages.push({
        ...(images[i].id && { id: images[i].id }),
        name: images[i].name,
        type: images[i].type,
        thumbUrl: images[i].thumbUrl,
        url: imgBase64,
      });
    }

    dispatch(
      updateProductAction({
        id: id,
        values: {
          ...productValues,
          slug: slug(productValues.name),
          status: values.status ? "??ang giao d???ch" : "Ng??ng giao d???ch",
        },
        options: options,
        initialOptionIds: productDetail.data.options.map((item) => item.id),
        images: newImages,
        initialImageIds: productDetail.data.images.map((item) => item.id),
        callback: {
          redirectProductList: () => navigate(ROUTES.ADMIN.PRODUCT_LIST),
        },
      })
    );
  };

  const renderCategories = useMemo(() => {
    return categoryList.data.map((item, index) => {
      return (
        <Select.Option key={item.id} value={item.id}>
          {item.name}
        </Select.Option>
      );
    });
  }, [categoryList.data]);

  return (
    <S.MainContainer>
      <Spin
        indicator={antIcon}
        spinning={updateProduct.loading}
      >
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
          <h3>UPDATE</h3>
          <Space>
            <Button onClick={() => navigate(ROUTES.ADMIN.PRODUCT_LIST)}>
              <span className="span-button">Tho??t</span>
            </Button>
            <Button type="primary" onClick={() => updateProductForm.submit()}>
              <span className="span-button">L??u</span>
            </Button>
          </Space>
        </div>

        {/* Content */}
        <Spin spinning={productDetail.loading}>
          <S.MainContent>
            <Form
              name="updateProductForm"
              form={updateProductForm}
              layout="vertical"
              onFinish={(values) => handleUpdateProduct(values)}
              initialValues={initialValues}
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
                            formatter={(value) =>
                              value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            }
                            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                            style={{
                              width: "100%",
                            }}
                            controls={false}
                            placeholder="Nh???p gi?? b??n l???"
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
                              updateProductForm.setFieldValue("content", value)
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
                        onPreview={handlePreview}
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
                    <Modal
                      open={previewOpen}
                      title={previewTitle}
                      footer={null}
                      onCancel={handleCancel}
                    >
                      <img
                        alt="example"
                        style={{
                          width: "100%",
                        }}
                        src={previewImage}
                      />
                    </Modal>
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
                          Th??m m???i thu???c t??nh gi??p s???n ph???m c?? nhi???u l???a ch???n,
                          nh?? k??ch c??? hay m??u s???c
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
                                    name={[field.name, "id"]}
                                    style={{ display: "none" }}
                                  >
                                    <Input />
                                  </Form.Item>

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
                    <Form.Item label="Lo???i s???n ph???m" name="categoryId">
                      <Select loading={categoryList.loading}>
                        {renderCategories}
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
      </Spin>
    </S.MainContainer>
  );
};

export default UpdateProductPageAdmin;
