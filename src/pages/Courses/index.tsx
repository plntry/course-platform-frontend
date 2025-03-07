import { useState } from "react";
import { useLoaderData } from "react-router";
import { Table, Input, Flex, Typography, theme } from "antd";
import type { TableColumnsType, GetProps } from "antd";
import { Course, CourseActionConfig } from "../../models/Course";
import { userAvailableCourseActions } from "../../constants/availableCourseActions";
import CourseActionsComp from "../../components/CourseActions";
import { coursesApi } from "../../api/courses";

const { Search } = Input;
type SearchProps = GetProps<typeof Search>;

const Courses: React.FC = () => {
  const { token: themeToken } = theme.useToken();
  const courses = useLoaderData();

  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const availableActions: CourseActionConfig[] =
    userAvailableCourseActions.student;

  const columns: TableColumnsType<Course> = [
    {
      title: "Name",
      dataIndex: "title",
      showSorterTooltip: { target: "full-header" },
      width: "80%",
      filters: filteredCourses.map((course: Course) => {
        return {
          text: course.title,
          value: course.id,
        };
      }),
      onFilter: (value, record) => record.id === value,
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, record: Course) => (
        <CourseActionsComp course={record} actions={availableActions} />
      ),
    },
  ];

  const onSearch: SearchProps["onSearch"] = (value) => {
    const filtered = courses.filter((course: Course) =>
      course.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <Flex vertical align="center" gap={20} style={{}}>
      <Typography.Title
        level={2}
        style={{ color: themeToken.colorPrimaryActive }}
      >
        Find Your Next Course
      </Typography.Title>
      <Search
        placeholder="Input search text..."
        allowClear
        onSearch={onSearch}
        style={{ alignSelf: "flex-end", maxWidth: "500px" }}
      />
      <Table<Course>
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
  // console.log("courses res", response);

  if (response.status === 200) {
    return response.data.map((el: Course) => {
      return { ...el, key: el.id };
    });
  }

  return [];
}
