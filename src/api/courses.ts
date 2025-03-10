import api from ".";

const COURSES_BASE_URL = "/courses";

export const coursesApi = {
  getAll: async () => api.get(COURSES_BASE_URL),
  getAllByUser: async (userId: string) =>
    await api.get(`/student/getCoursesOnUser/${userId}`),
  getById: async (courseId: string) =>
    api.get(`${COURSES_BASE_URL}/${courseId}`),
  create: async (body: any) =>
    await api.post(`${COURSES_BASE_URL}/create_course`, body),
  update: async (courseId: string, body: any) =>
    await api.put(`${COURSES_BASE_URL}/${courseId}`, body),
  delete: async (courseId: string) =>
    await api.delete(`${COURSES_BASE_URL}/${courseId}`),
};
