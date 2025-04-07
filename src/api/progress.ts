import api from ".";
import { PostCourse } from "../models/Course";

const PROGRESS_BASE_URL = "/progress";

export const progressApi = {
  getByCourse: async (courseId: string, studentId: string) =>
    await api.get(
      `${PROGRESS_BASE_URL}/courses/${courseId}/student/${studentId}`
    ),
  markAsDone: async (assignmentId: string) =>
    await api.post(
      `${PROGRESS_BASE_URL}/mark-assignment-complete/${assignmentId}`
    ),
};
