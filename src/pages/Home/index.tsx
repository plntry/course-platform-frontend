import { Flex, Typography, theme } from "antd";

const Home: React.FC = () => {
  const { token: themeToken } = theme.useToken();

  return (
    <Flex vertical justify="center" align="center">
      <Typography.Title style={{ color: themeToken.colorPrimaryActive }}>
        ProSkills Home Page
      </Typography.Title>
    </Flex>
  );
};

export default Home;
