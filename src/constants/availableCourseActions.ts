import { CourseActions, UserAvailableCourseActions } from "../models/Course";
import { GUEST_ROLE, UserRoles } from "../models/User";
import { PATHS } from "../routes/paths";
import { getUserAvailableCourseActionsByPage } from "../utils/courseUtils";

export const courseActions: CourseActions = {
  more: {
    title: "More...",
    link: PATHS.COURSE.link,
    dynamicParam: {
      stringToReplace: ":courseId",
      propName: "id",
    },
    visible: {
      coursesPage: true,
      detailsPage: false,
    },
  },
  enroll: {
    title: "Enroll",
    link: PATHS.HOME.link, // TODO: Update with needed link / action
    visible: {
      coursesPage: true,
      detailsPage: true,
    },
    buttonProps: {
      type: "primary",
      disabled: true,
    },
  },
  edit: {
    title: "Edit",
    link: `${PATHS.COURSE.link}/${PATHS.EDIT_COURSE.link}`,
    dynamicParam: {
      stringToReplace: ":courseId",
      propName: "id",
    },
    visible: {
      coursesPage: true,
      detailsPage: true,
    },
    buttonProps: {
      type: "dashed",
    },
  },
  delete: {
    title: "Delete",
    link: `${PATHS.COURSE.link}/${PATHS.DELETE_COURSE.link}`,
    dynamicParam: {
      stringToReplace: ":courseId",
      propName: "id",
    },
    visible: {
      coursesPage: true,
      detailsPage: true,
    },
    buttonProps: {
      type: "dashed",
    },
  },
};

export const userAvailableCourseActions: UserAvailableCourseActions = {
  [UserRoles.STUDENT]: [courseActions.enroll, courseActions.more],
  [UserRoles.TEACHER]: [
    courseActions.edit,
    courseActions.delete,
    courseActions.more,
  ],
  [GUEST_ROLE]: [courseActions.more],
};

// each page should include only actions which should be visible on that page
export const userAvailableCourseActionsCoursesPage: UserAvailableCourseActions =
  getUserAvailableCourseActionsByPage("coursesPage");
export const userAvailableCourseActionsDetailsPage: UserAvailableCourseActions =
  getUserAvailableCourseActionsByPage("detailsPage");
