import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { Button, Layout, PageHeader, Tooltip, Table } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import { useUser } from "../firebase/useUser";
import { useUsers } from "../firebase/useUsers";
import { LocationDoc, useLocations } from "../firebase/useLocations";
import { mapDocsToHashTable } from "../firebase/utils";

export const Users = () => {
  const auth = getAuth();
  const { profile, userLoading, user, loading } = useUser();

  const navigate = useNavigate();

  const { usersDocData, usersDocLoading } = useUsers();
  const { locations, loading: locationLoading } = useLocations({});
  const locationsHashTable = useMemo(
    () => mapDocsToHashTable<LocationDoc>(locations),
    [locations]
  );

  useEffect(() => {
    if (!user && !userLoading) {
      navigate(routes.auth);
    }
    if (profile.role !== "admin" && !loading) {
      navigate(routes.root);
    }
  }, [user, profile, userLoading, loading, navigate]);

  if (loading || usersDocLoading || locationLoading) {
    return <Spinner />;
  }

  const onLogout = () => {
    signOut(auth);
  };

  const { Content, Footer, Header } = Layout;

  const columns = [
    {
      title: "Духовное имя",
      dataIndex: "nameSpiritual",
      key: "nameSpiritual",
    },
    {
      title: "ФИО",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Книг",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Баллов",
      dataIndex: "points",
      key: "points",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Город",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Действие",
      key: "action",
      render: (text: string, record: any) => <Button>0</Button>,
    },
  ];

  const data = usersDocData?.map((user) => ({
    key: user.id,
    nameSpiritual: user.nameSpiritual,
    name: user.name,
    count: user.statistic?.[2022].count,
    points: user.statistic?.[2022].points,
    phone: user.phone,
    city: (user.city && locationsHashTable[user.city]?.name) || user.city,
    address: user.address,
    role: user.role,
  }));

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="ПОЛЬЗОВАТЕЛИ"
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
          <Table columns={columns} dataSource={data} scroll={{ x: true }} />
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};
