import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import useGoogleSheets from "use-google-sheets";
import {
  Button,
  Layout,
  PageHeader,
  Tooltip,
  Typography,
  Input,
  Table,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import BbtLogo from "../images/bbt-logo.png";
import { routes } from "../shared/routes";
import { Spinner } from "../shared/components/Spinner";
import { Book, getBooks } from "../shared/helpers/getBooks";
import { useUser } from "../firebase/useUser";
import {
  DistributedBook,
  OperationDoc,
  useOperations,
} from "../firebase/useOperations";
import { useLocations } from "../firebase/useLocations";
import { LocationSelect } from "../shared/components/LocationSelect";
import { useDebouncedCallback } from "use-debounce/lib";

type FormValues = Record<number, number> & {
  locationId: string;
};

export const Reports = () => {
  const auth = getAuth();
  const {
    profile,
    addStatistic,
    favorite,
    toggleFavorite,
    loading: userLoading,
  } = useUser();
  const [user, loading] = useAuthState(auth);

  const navigate = useNavigate();

  const { data: books, loading: booksLoading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });

  const { addOperation } = useOperations();
  const { addLocation, locationsDocData } = useLocations({});

  useEffect(() => {
    if (!user && !loading) {
      navigate(routes.auth);
    }
  }, [user, loading, navigate]);

  // if (booksLoading || userLoading) {
  //   return <Spinner />;
  // }

  const onLogout = () => {
    signOut(auth);
  };

  const { Search } = Input;
  const { Content, Footer, Header } = Layout;
  const { Title } = Typography;

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: any) => <a>Подтвердить {record.name}</a>,
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
      tags: ["nice", "developer"],
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
      tags: ["loser"],
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
      tags: ["cool", "teacher"],
    },
  ];

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
