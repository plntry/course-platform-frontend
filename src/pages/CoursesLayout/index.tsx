import { Flex } from "antd";
import { Outlet, useLocation } from "react-router";
import GoBackButton from "../../components/GoBackButton";
import { PATHS } from "../../routes/paths";

const CoursesLayout: React.FC = () => {
  const location = useLocation();
  const isCoursesPage = location.pathname.substring(1) === PATHS.COURSES.link;

  return (
    <Flex vertical gap={20} style={{ height: "100%" }}>
      {!isCoursesPage && <GoBackButton />}
      <Outlet />
    </Flex>
  );
};

export default CoursesLayout;
