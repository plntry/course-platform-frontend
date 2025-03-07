import { ButtonProps } from "antd";

export interface Course {
  id: number;
  title: string;
  description: string;
  lessons_count: number;
  lessons_duration: number;
  files: string[];
}

export interface CourseActionConfig {
  title: string;
  link: string;
  buttonProps?: ButtonProps;
  shouldBeShownInDetailsPage: boolean;
  dynamicParam?: {
    stringToReplace: string;
    propName: keyof Course;
  };
}

export type CourseActions = Record<string, CourseActionConfig>;

export type UserAvailableCourseActions = {
  [role: string]: CourseActionConfig[];
};
