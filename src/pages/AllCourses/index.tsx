import { useLoaderData, useSearchParams } from "react-router";
import { GetCourse } from "../../models/Course";
import { coursesApi } from "../../api/courses";
import CoursesList from "../../components/CoursesList";

const AllCourses: React.FC = () => {
  const courses = useLoaderData();

  return <CoursesList courses={courses} />;
};

export default AllCourses;

export async function loader() {
  const response = await coursesApi.getAll();

  if (response.status === 200) {
    return response.data.map((el: GetCourse) => ({
      ...el,
      key: el.id,
    }));
  }

  return [];
}
