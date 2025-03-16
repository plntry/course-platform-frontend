import { Flex, Typography, theme } from "antd";
import { Tabs } from "antd";
import StudentsList from "../../components/StudentsList";
import classes from "./StudentsPage.module.css";
import { useAuthStore } from "../../store/useAuthStore";
import { studentApi } from "../../api/students";
import { GetCourse } from "../../models/Course";
import { useLoaderData } from "react-router";

const StudentsPage: React.FC = () => {
  const { token: themeToken } = theme.useToken();
  const teacherCourses = useLoaderData();

  return (
    <Flex vertical align="center" gap={20}>
      <Typography.Title
        level={2}
        style={{ color: themeToken.colorPrimaryActive }}
      >
        Students
      </Typography.Title>
      <Flex justify="center">
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          className={classes.tabs}
          type="card"
          items={teacherCourses.map((course: GetCourse) => {
            return {
              label: course.title,
              key: course.id,
              children: <StudentsList courseId={course.id + ""} />,
            };
          })}
        />
      </Flex>
    </Flex>
  );
};

export default StudentsPage;

export async function loader() {
  const { checkAuth } = useAuthStore.getState();
  await checkAuth();

  const response = await studentApi.getTeacherCourses();

  if (response.status === 200) {
    return response.data.map((el: GetCourse) => ({
      ...el,
      key: el.id,
    }));
  }

  return [];
}
