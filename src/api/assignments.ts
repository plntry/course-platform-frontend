import api from ".";
import { CourseSection } from "../models/Course";

const ASSIGNMENTS_BASE_URL = "/courses";

export const courseSectionsApi = {
  getAllByCourse: async (courseId: string) =>
    api.get(`${ASSIGNMENTS_BASE_URL}/course/${courseId}`),
  getById: async (sectionId: string) =>
    api.get(`${ASSIGNMENTS_BASE_URL}/${sectionId}`),
  create: async (body: CourseSection) =>
    await api.post(ASSIGNMENTS_BASE_URL, body),
  update: async (sectionId: string, body: CourseSection) =>
    await api.put(`${ASSIGNMENTS_BASE_URL}/${sectionId}`, body),
  delete: async (sectionId: string) =>
    await api.delete(`${ASSIGNMENTS_BASE_URL}/${sectionId}`),
};
