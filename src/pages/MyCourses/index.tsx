import { useLoaderData } from "react-router";
import { GetCourse } from "../../models/Course";
import { coursesApi } from "../../api/courses";
import CoursesList from "../../components/CoursesList";
import { useAuthStore } from "../../store/useAuthStore";

const MyCourses: React.FC = () => {
  const courses = useLoaderData();

  return <CoursesList courses={courses} mode="my" />;
};

export default MyCourses;

export async function loader() {
  const { checkAuth } = useAuthStore.getState();
  await checkAuth();

  const { user } = useAuthStore.getState();

  const response = await coursesApi.getAllByUser(user?.id + "");
  // const response = await coursesApi.getAll();

  if (response.status === 200) {
    return response.data.map((el: GetCourse) => ({
      ...el,
      key: el.id,
    }));
  }

  return [];
}
