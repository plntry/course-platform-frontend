import { useState } from "react";
import { Link, useLoaderData } from "react-router";
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
import type { TableColumnsType, GetProps } from "antd";
import { GetCourse, CourseActionConfig } from "../../models/Course";
import { userAvailableCourseActions } from "../../constants/availableCourseActions";
import CourseActionsComp from "../../components/CourseActions";
import { coursesApi } from "../../api/courses";
import { getCategoryColor } from "../../utils/colorsUtils";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import { PATHS } from "../../routes/paths";

const { Search } = Input;
const { useBreakpoint } = Grid;
type SearchProps = GetProps<typeof Search>;

const Courses: React.FC = () => {
  const { token: themeToken } = theme.useToken();
  const screens = useBreakpoint();
  const isSmallScreen = !screens.md && (screens.xs || screens.sm);

  const courses = useLoaderData();
  const [filteredCourses, setFilteredCourses] = useState<GetCourse[]>(courses);

  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const availableActions: CourseActionConfig[] =
    userAvailableCourseActions[role];

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
        <CourseActionsComp course={record} actions={availableActions} />
      ),
    },
  ];

  const onSearch: SearchProps["onSearch"] = (value) => {
    const filtered = courses.filter((course: GetCourse) =>
      course.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <Flex vertical align="center" gap={20}>
      <Typography.Title
        level={2}
        style={{ color: themeToken.colorPrimaryActive }}
      >
        Find Your Next Course
      </Typography.Title>
      <Flex
        justify={isSmallScreen ? "center" : "space-between"}
        align="center"
        gap={15}
        wrap
        style={{
          width: "100%",
        }}
      >
        {role === UserRoles.TEACHER && (
          <Link to={PATHS.NEW_COURSE.link} relative="route">
            <Button type="primary">Add New</Button>
          </Link>
        )}
        <Search
          placeholder="Input search text..."
          allowClear
          onSearch={onSearch}
          style={{ alignSelf: "flex-end", maxWidth: "500px" }}
        />
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

export default Courses;

export async function loader() {
  const response = await coursesApi.getAll();

  if (response.status === 200) {
    return response.data.map((el: GetCourse) => {
      return { ...el, key: el.id };
    });
  }

  return [];
}
