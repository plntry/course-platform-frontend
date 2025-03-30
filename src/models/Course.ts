import { ButtonProps } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";

export interface GetCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  lessons_count: number;
  lessons_duration: number;
  files: string[];
  is_enrolled: boolean;
  teacher_id: number;
  teacher: {
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
  };
}

export interface PostCourse {
  title: string;
  description: string;
  category: string;
  rating: number;
  lessons_count: number;
  lessons_duration: number;
  files?: string[];
}

export interface CourseSection {
  id: number;
  title: string;
  description: string;
  order: number;
  course_id: number;
}

export interface CreateCourseSection {
  title: string;
  order: number;
}

interface AssignmentFile {
  key: string;
  size: number;
  last_modified: string;
  filename: string;
}

export interface CourseAssignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  teacher_comments?: string;
  order: number;
  course_id: number;
  section_id: number;
  files: AssignmentFile[];
}

export enum CoursePage {
  AllCourses = "allCourses",
  MyCourses = "myCourses",
  CourseDetails = "courseDetails",
}

export interface CourseActionConfig {
  title: string;
  link: string;
  buttonProps?: ButtonProps;
  visible: Record<CoursePage, boolean>;
  dynamicParam?: {
    stringToReplace: string;
    propName: keyof GetCourse;
  };
  disabledIfAlreadyEnrolled?: boolean;
  onClick?: (
    courseId: string,
    notification: NotificationInstance
  ) => Promise<boolean>;
}

export type CourseActions = Record<string, CourseActionConfig>;

export type UserAvailableCourseActions = {
  [role: string]: CourseActionConfig[];
};

export type UserAvailableCourseActionsByPage = Record<
  CoursePage,
  UserAvailableCourseActions
>;
