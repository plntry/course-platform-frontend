import api from ".";
import { PostCourse } from "../models/Course";

const PROGRESS_BASE_URL = "/progress";

export const coursesApi = {
  getByCourse: async (courseId: string, studentId: string) =>
    await api.get(
      `${PROGRESS_BASE_URL}/courses/${courseId}/student/${studentId}`
    ),
  markAsDone: async (assignmentId: string) =>
    await api.post(
      `${PROGRESS_BASE_URL}/mark-assignment-complete/${assignmentId}`
    ),
  // getById: async (courseId: string) =>
  //   api.get(`${PROGRESS_BASE_URL}/${courseId}`),
  // create: async (body: PostCourse) =>
  //   await api.post(`${PROGRESS_BASE_URL}/create_course`, body),
  // update: async (courseId: string, body: PostCourse) =>
  //   await api.put(`${PROGRESS_BASE_URL}/${courseId}`, body),
  // delete: async (courseId: string) =>
  //   await api.delete(`${PROGRESS_BASE_URL}/${courseId}`),
};
