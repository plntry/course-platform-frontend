import { CourseActions, UserAvailableCourseActions } from "../models/Course";
import { GUEST_ROLE, UserRoles } from "../models/User";
import { PATHS } from "../routes/paths";

export const courseActions: CourseActions = {
  more: {
    title: "More...",
    link: PATHS.COURSE.link,
    shouldBeShownInDetailsPage: false,
    dynamicParam: {
      stringToReplace: PATHS.COURSE.link,
      propName: "id",
    },
  },
  enroll: {
    title: "Enroll",
    link: PATHS.HOME.link, // TODO: Update with needed link / action
    shouldBeShownInDetailsPage: true,
    buttonProps: {
      type: "primary",
      disabled: true,
    },
  },
};

export const userAvailableCourseActions: UserAvailableCourseActions = {
  [UserRoles.STUDENT]: [courseActions.enroll, courseActions.more],
  [UserRoles.TEACHER]: [courseActions.more],
  [GUEST_ROLE]: [courseActions.more],
};

// details page should include only actions with shouldBeShownInDetailsPage === true
export const userAvailableCourseActionsDetailsPage: UserAvailableCourseActions =
  Object.keys(userAvailableCourseActions).reduce((acc, role) => {
    acc[role] = userAvailableCourseActions[role].filter(
      (action) => action.shouldBeShownInDetailsPage
    );
    return acc;
  }, {} as UserAvailableCourseActions);
