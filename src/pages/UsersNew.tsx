import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip, Form, Input, Select } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import { useUser } from "../firebase/useUser";
import { LocationSelect } from "../shared/components/LocationSelect";
import { useLocations } from "../firebase/useLocations";
import { useDebouncedCallback } from "use-debounce/lib";

export const UsersNew = () => {
  const { profile, addNewUnattachedProfile, user, loading, userLoading } =
    useUser();
  const auth = getAuth();
  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;
  const { Option } = Select;

  const [locationSearchString, setLocationSearchString] = useState("");
  const { addLocation, locations } = useLocations({
    searchString: locationSearchString,
  });

  useEffect(() => {
    if (!user && !userLoading) {
      navigate(routes.auth);
    }

    if (profile.role !== "admin" && !loading) {
      navigate(routes.root);
    }
  }, [user, profile, userLoading, loading, navigate]);

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

  if (!user || userLoading) {
    return <Spinner />;
  }

  const onLogout = () => {
    signOut(auth);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onAddNewLocation = () => {
    addLocation({
      name: locationSearchString,
    });
    setLocationSearchString("");
  };

  const onFinish = ({ phone, prefix, ...formValues }: any) => {
    addNewUnattachedProfile({
      ...formValues,
      phone: `${prefix}${phone}`,
    }).then(() => navigate(routes.users));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue="+7">
      <Select style={{ width: 70 }}>
        <Option value="7">+7</Option>
        <Option value="3">+3</Option>
      </Select>
    </Form.Item>
  );

  const locationOptions = locations?.map((d) => (
    <Select.Option key={d.id}>{d.name}</Select.Option>
  ));

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="СОЗДАНИЕ НОВОГО ПОЛЬЗОВАТЕЛЯ"
          className="page-header"
          avatar={{ src: BbtLogo }}
          extra={[
            <Tooltip title="Выйти" key="logout">
              <Button
                type="ghost"
                shape="circle"
                icon={<LogoutOutlined />}
                onClick={onLogout}
              />
            </Tooltip>,
          ]}
        />
      </Header>

      <Content>
        <div className="site-layout-content">
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            {...layout}
          >
            <Form.Item
              name="name"
              label="Ф.И.О"
              rules={[{ required: true }]}
              initialValue={""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nameSpiritual"
              label="Ваше духовное имя"
              rules={[{ required: false }]}
              initialValue={profile.nameSpiritual || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label="Город"
              rules={[{ required: true }]}
              initialValue={""}
            >
              <LocationSelect
                onSearch={onLocationChange}
                onAddNewLocation={onAddNewLocation}
                locationSearchString={locationSearchString}
              >
                {locationOptions}
              </LocationSelect>
            </Form.Item>
            <Form.Item
              name="phone"
              label="Телефон"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите номер телефона!",
                },
              ]}
              initialValue={""}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="email"
              label="email"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите email",
                },
              ]}
              initialValue={""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Адрес"
              rules={[{ required: false }]}
              initialValue={profile.address || ""}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                ДОБАВИТЬ
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};