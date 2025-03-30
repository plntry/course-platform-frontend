import api from ".";
import { CourseSection, CreateCourseSection } from "../models/Course";

const SECTIONS_BASE_URL = "/sections";

export const courseSectionsApi = {
  getAllByCourse: async (courseId: string) =>
    api.get(`${SECTIONS_BASE_URL}/course/${courseId}`),
  getById: async (sectionId: string) =>
    api.get(`${SECTIONS_BASE_URL}/${sectionId}`),
  create: async (courseId: string, body: CreateCourseSection) =>
    await api.post(`${SECTIONS_BASE_URL}?course_id=${courseId}`, body),
  update: async (sectionId: string, body: CourseSection) =>
    await api.put(`${SECTIONS_BASE_URL}/${sectionId}`, body),
  delete: async (sectionId: string) =>
    await api.delete(`${SECTIONS_BASE_URL}/${sectionId}`),
};
