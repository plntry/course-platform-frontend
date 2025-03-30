import api from ".";
import { CourseSection, CreateCourseSection } from "../models/Course";

const FILES_BASE_URL = "/files";

export const assignmentFilesApi = {
  getAll: async (assignmentId: string) =>
    await api.get(`${FILES_BASE_URL}/assignments/${assignmentId}/task`),
  download: async (fileKey: string) =>
    await api.get(`${FILES_BASE_URL}/download/${fileKey}`),
  create: async (assignmentId: string, file: string) =>
    await api.post(`${FILES_BASE_URL}/assignments/${assignmentId}/upload`, {
      file,
    }),
  delete: async (fileKey: string) =>
    await api.delete(`${FILES_BASE_URL}/${fileKey}`),
};
