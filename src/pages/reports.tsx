import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useGoogleSheets from "use-google-sheets";
import { Button, Layout, PageHeader, Tooltip, Table, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import { useUser } from "../firebase/useUser";
import { useOperations } from "../firebase/useOperations";
import moment from "moment";

export const Reports = () => {
  const auth = getAuth();
  const { profile, userLoading, user, loading } = useUser();

  const navigate = useNavigate();

  const { loading: booksLoading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });

  const { operationsDocData, loading: operationLoading } = useOperations();

  useEffect(() => {
    if (!user && !userLoading) {
      navigate(routes.auth);
    }
    if (profile.role !== "admin" && !loading) {
      navigate(routes.root);
    }
  }, [user, profile, userLoading, loading, navigate]);

  if (booksLoading || loading || operationLoading) {
    return <Spinner />;
  }

  const onLogout = () => {
    signOut(auth);
  };

  const { Content, Footer, Header } = Layout;

  const columns = [
    {
      title: "Статус",
      dataIndex: "isAuthorized",
      key: "isAuthorized",
      render: (status: boolean) =>
        status ? (
          <Tag color="green">Подтвержден</Tag>
        ) : (
          <Tag color="processing">Ожидание</Tag>
        ),
    },
    {
      title: "Дата",
      dataIndex: "date",
      key: "date",
      render: (date: string) => moment(date).calendar(),
    },
    {
      title: "Пользователь",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text,
    },
    {
      title: "Всего книг",
      dataIndex: "totalCount",
      key: "totalCount",
    },
    // {
    //   title: "Книги",
    //   dataIndex: "books",
    //   key: "books",
    //   render: (books: OperationDoc['books']) => (
    //     <>
    //       {books.map((book, index) => {
    //         let color = index > 2 ? "geekblue" : "green";

    //         return (
    //           <Tag color={color} key={index}>
    //             id {book.bookId} - {book.count} шт.
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: "Действие",
      key: "action",
      render: (text: string, record: any) => <Button>Подтвердить</Button>,
    },
  ];

  const data = operationsDocData?.map((operation, index) => ({
    key: operation.date + index,
    date: operation.date,
    isAuthorized: operation.isAuthorized,
    name: operation.userName,
    totalCount: operation.totalCount,
    books: operation.books,
  }));

  return (
    <Layout>
      <Header className="site-page-header">
        <PageHeader
          title="ПОСЛЕДНИЕ ОПЕРАЦИИ"
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
          <Table columns={columns} dataSource={data} />
        </div>
      </Content>
      <Footer></Footer>
    </Layout>
  );
};