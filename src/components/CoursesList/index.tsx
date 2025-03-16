import { useState } from "react";
import { Link } from "react-router";
import {
  Table,
  Input,
  Flex,
  Typography,
  theme,
  Tag,
  Rate,
  Button,
  Grid,
} from "antd";
import type { TableColumnsType } from "antd";
import { GetCourse, CourseActionConfig, CoursePage } from "../../models/Course";
import { userAvailableCourseActionsByPage } from "../../constants/availableCourseActions";
import CourseActionsComp from "../CourseActions";
import { getCategoryColor } from "../../utils/courseUtils";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import { PATHS } from "../../routes/paths";
import SearchInput from "../SearchInput";

const { Search } = Input;
const { useBreakpoint } = Grid;

const CoursesList: React.FC<{
  courses: GetCourse[];
  mode?: CoursePage;
}> = ({ courses, mode = CoursePage.AllCourses }) => {
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const isTeacher = role === UserRoles.TEACHER;
  const availableActions: CourseActionConfig[] =
    userAvailableCourseActionsByPage[mode][role];

  const { token: themeToken } = theme.useToken();
  const screens = useBreakpoint();
  const isSmallScreen = !screens.md && (screens.xs || screens.sm);
  const actionsBlockJustify = isSmallScreen
    ? "center"
    : isTeacher && mode === "myCourses"
    ? "space-between"
    : "center";

  const [searchText, setSearchText] = useState("");
  const filteredCourses = courses.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: TableColumnsType<GetCourse> = [
    {
      title: "Name",
      dataIndex: "title",
      showSorterTooltip: { target: "full-header" },
      filters: filteredCourses.map((course: GetCourse) => {
        return {
          text: course.title,
          value: course.id,
        };
      }),
      onFilter: (value, record) => record.id === value,
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      responsive: ["sm"],
      showSorterTooltip: { target: "full-header" },
      filters: Array.from(
        new Set(filteredCourses.map((course: GetCourse) => course.category))
      ).map((category) => ({
        text: category,
        value: category,
      })),
      onFilter: (value, record) => record.category === value,
      sorter: (a, b) => a.title.length - b.title.length,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      responsive: ["md"],
      showSorterTooltip: { target: "full-header" },
      sorter: (a, b) => a.rating - b.rating,
      render: (rating: number) => (
        <Rate disabled allowHalf defaultValue={rating} />
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, record: GetCourse) => (
        <CourseActionsComp
          course={record}
          actions={availableActions}
          mode={mode}
        />
      ),
    },
  ];

  return (
    <Flex vertical align="center" gap={20}>
      <Typography.Title
        level={2}
        style={{ color: themeToken.colorPrimaryActive }}
      >
        {mode === "myCourses" ? "My Courses" : "Find Your Next Course"}
      </Typography.Title>
      <Flex
        justify={actionsBlockJustify}
        align="center"
        gap={15}
        wrap
        style={{ width: "100%" }}
      >
        {isTeacher && mode === "myCourses" && (
          <Link to={PATHS.NEW_COURSE.link}>
            <Button type="primary">Add New</Button>
          </Link>
        )}
        <SearchInput onChange={(e) => setSearchText(e.target.value)} />
      </Flex>
      <Table<GetCourse>
        columns={columns}
        dataSource={filteredCourses}
        showSorterTooltip={{ target: "sorter-icon" }}
        pagination={{ defaultPageSize: 6, hideOnSinglePage: true }}
        style={{ width: "100%" }}
      />
    </Flex>
  );
};

export default CoursesList;
