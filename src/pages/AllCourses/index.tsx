import { useLoaderData } from "react-router";
import { GetCourse } from "../../models/Course";
import { coursesApi } from "../../api/courses";
import CoursesList from "../../components/CoursesList";
import { useAuthStore } from "../../store/useAuthStore";

const AllCourses: React.FC = () => {
  const courses = useLoaderData();

  return <CoursesList courses={courses} />;
};

export default AllCourses;

export async function loader() {
  const { checkAuth } = useAuthStore.getState();
  await checkAuth();

  const response = await coursesApi.getAll();

  if (response.status === 200) {
    return response.data
      .map((el: GetCourse) => ({
        ...el,
        key: el.id,
      }))
      .sort((a: GetCourse, b: GetCourse) => b.rating - a.rating);
  }

  return [];
}
