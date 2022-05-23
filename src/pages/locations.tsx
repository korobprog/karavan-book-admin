import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip, Table, Divider } from "antd";
import { CalculatorOutlined, LogoutOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import { useUser } from "../firebase/useUser";
import { LocationDoc, useLocations } from "../firebase/useLocations";
import { LocationStatistic } from "../shared/components/LocationStatistic";

export const Locations = () => {
  const auth = getAuth();
  const { profile, userLoading, user, loading } = useUser();

  const navigate = useNavigate();

  const { locations, loading: locationsLoading } = useLocations({});
  // const { operationsDocData, loading: operationLoading } = useOperations();

  useEffect(() => {
    if (!user && !userLoading) {
      navigate(routes.auth);
    }
    if (profile.role !== "admin" && !loading) {
      navigate(routes.root);
    }
  }, [user, profile, userLoading, loading, navigate]);

  if (loading || locationsLoading) {
    return <Spinner />;
  }

  const onLogout = () => {
    signOut(auth);
  };

  const onCalculate = () => {};

  const { Content, Footer, Header } = Layout;

  const columns = [
    {
      title: "Населенный пункт",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Страна",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Координаты",
      dataIndex: "coordinates",
      key: "coordinates",
    },
    {
      title: "Распространено в 2022",
      dataIndex: "statistic",
      key: "statistic",
      render: (stat: LocationDoc["statistic"]) => (
        <LocationStatistic statistic={stat} />
      ),
    },
    {
      title: "Действие",
      key: "action",
      render: (text: string, record: any) => <Button>Сделать что-то</Button>,
    },
  ];

  const data = locations?.map((operation, index) => ({
    key: operation.id || "" + index,
    name: operation.name,
    country: operation.country,
    statistic: operation.statistic,
    coordinates: operation.coordinates,
  }));

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="ГОРОДА НА КАРТЕ"
          className="page-header"
          onBack={() => navigate(routes.root)}
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
          <Button
            block
            size="large"
            type="primary"
            icon={<CalculatorOutlined />}
            onClick={onCalculate}
          >
            Пересчитать статистику
          </Button>
          <Divider dashed />
          <Table columns={columns} dataSource={data} />
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
