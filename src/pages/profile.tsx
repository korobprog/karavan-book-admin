import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import {
  Button,
  Layout,
  PageHeader,
  Tooltip,
  Typography,
  Form,
  Input,
  Select,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import BbtLogo from "../images/bbt-logo.png";
import { useNavigate } from "react-router-dom";
import { routes } from "../shared/routes";
import { useUser } from "../firebase/useUser";
import { LocationSelect } from "../shared/components/LocationSelect";
import { useLocations } from "../firebase/useLocations";
import { useDebouncedCallback } from "use-debounce/lib";
import { CurrentUser } from "../firebase/useCurrentUser";

type Props = {
  currentUser: CurrentUser;
};

const Profile = ({ currentUser }: Props) => {
  const { setProfile } = useUser({ currentUser });
  const { profile, loading, user } = currentUser;
  const auth = getAuth();
  const navigate = useNavigate();
  const { Content, Footer, Header } = Layout;
  const { Title, Paragraph } = Typography;
  const { Option } = Select;

  const [locationSearchString, setLocationSearchString] = useState("");
  const { addLocation, locations } = useLocations({
    searchString: locationSearchString,
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  const onLocationChange = useDebouncedCallback((value: string) => {
    setLocationSearchString(value.charAt(0).toUpperCase() + value.slice(1));
  }, 1000);

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
    setProfile({
      ...formValues,
      phone: `${prefix}${phone}`,
    }).then(() => navigate(routes.root));
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
          title="???????? ????????"
          className="page-header"
          avatar={{ src: BbtLogo }}
          extra={[
            <Tooltip title="??????????" key="logout">
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
          <Title className="site-page-title" level={2}>
            ????????????, {profile?.name || user?.displayName || "????????"}
          </Title>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            {...layout}
          >
            <Paragraph>?????????????????????? ?????????????????? ?????? ??????????????</Paragraph>

            <Form.Item
              name="name"
              label="???????? ??.??.??"
              rules={[{ required: true }]}
              initialValue={profile?.name || user?.displayName || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="nameSpiritual"
              label="???????? ???????????????? ??????"
              rules={[{ required: false }]}
              initialValue={profile?.nameSpiritual || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="city"
              label="?????? ??????????"
              rules={[{ required: true }]}
              initialValue={profile?.city || ""}
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
              label="?????? ??????????????"
              rules={[
                {
                  required: true,
                  message: "????????????????????, ?????????????? ???????? ?????????? ????????????????!",
                },
              ]}
              initialValue={profile?.phone || ""}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="address"
              label="?????? ??????????"
              rules={[{ required: false }]}
              initialValue={profile?.address || ""}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                ??????????????????
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      <Footer></Footer>
    </Layout>
  );
};

export default Profile;
