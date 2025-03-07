import api from ".";

const COURSES_BASE_URL = "/courses";

export const coursesApi = {
  getAll: async () => api.get(COURSES_BASE_URL),
  getById: async (courseId: string) =>
    api.get(`${COURSES_BASE_URL}/${courseId}`),
};
