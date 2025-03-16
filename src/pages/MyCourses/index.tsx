import { useLoaderData } from "react-router";
import { CoursePage, GetCourse } from "../../models/Course";
import { coursesApi } from "../../api/courses";
import CoursesList from "../../components/CoursesList";
import { useAuthStore } from "../../store/useAuthStore";
import { studentApi } from "../../api/students";
import { UserRoles } from "../../models/User";

const MyCourses: React.FC = () => {
  const courses = useLoaderData();

  return <CoursesList courses={courses} mode={CoursePage.MyCourses} />;
};

export default MyCourses;

export async function loader() {
  const { checkAuth } = useAuthStore.getState();
  await checkAuth();

  const { user } = useAuthStore.getState();

  const response = await studentApi[
    user?.role === UserRoles.TEACHER ? "getTeacherCourses" : "getStudentCourses"
  ]();

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
