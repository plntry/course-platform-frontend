import api from ".";

const STUDENT_BASE_URL = "/student";

export const studentApi = {
  getAllStudentsByCourse: async (courseId: string) =>
    await api.get(`${STUDENT_BASE_URL}/courses/${courseId}`),
  getStudentCourses: async () =>
    await api.get(`${STUDENT_BASE_URL}/my_courses`),
  getTeacherCourses: async () =>
    await api.get(`${STUDENT_BASE_URL}/getTeachersCourses`),
  enrollToCourse: async (courseId: string) =>
    await api.put(`${STUDENT_BASE_URL}/addToCourse/${courseId}`),
  deleteFromCourse: async (studentId: string, courseId: string) =>
    await api.delete(`${STUDENT_BASE_URL}/${studentId}/${courseId}`),
};
