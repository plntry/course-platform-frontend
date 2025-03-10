import { ButtonProps } from "antd";

export interface GetCourse {
  id: number;
  title: string;
  description: string;
  category: string;
  rating: number;
  lessons_count: number;
  lessons_duration: number;
  files: string[];
  teacher: {
    first_name: string;
    last_name: string;
    role: string;
    is_active: boolean;
  };
}

export interface CreateCourse {
  title: string;
  description: string;
  category: string;
  rating: number;
  lessons_count: number;
  lessons_duration: number;
  files: string[];
}

export interface CourseActionConfig {
  title: string;
  link: string;
  buttonProps?: ButtonProps;
  visible: {
    coursesPage: boolean;
    detailsPage: boolean;
  };
  dynamicParam?: {
    stringToReplace: string;
    propName: keyof GetCourse;
  };
}

export type CourseActions = Record<string, CourseActionConfig>;

export type UserAvailableCourseActions = {
  [role: string]: CourseActionConfig[];
};
