import { Flex, Typography, theme } from "antd";
import { Link } from "react-router";
import { PATHS } from "../../routes/paths";

const Home: React.FC = () => {
  const { token: themeToken } = theme.useToken();

  return (
    <Flex vertical justify="center" align="center">
      <Typography.Title style={{ color: themeToken.colorPrimaryActive }}>
        ProSkills Home Page
      </Typography.Title>
      <Typography.Paragraph>
        Check out the new courses in{" "}
        {<Link to={PATHS.COURSES.link}>All Courses</Link>} section!
      </Typography.Paragraph>
    </Flex>
  );
};

export default Home;
