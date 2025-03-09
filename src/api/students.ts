import api from ".";

const STUDENT_BASE_URL = "/student";

export const studentApi = {
  getAllStudentCourses: async (studentId: string) =>
    await api.get(`${STUDENT_BASE_URL}/getCoursesOnUser/${studentId}`),
  getAllStudentsOnCourse: async (courseId: string) =>
    await api.get(`${STUDENT_BASE_URL}/getStudentsOnCourse/${courseId}`),
  enrollToCourse: async (courseId: string) =>
    await api.post(`${STUDENT_BASE_URL}/addToCourse/${courseId}`),
  deleteFromCourse: async (studentId: string, courseId: string) =>
    api.delete(`${STUDENT_BASE_URL}/${studentId}/${courseId}`),
};
