import { GUEST_ROLE, UserRoles } from "../models/User";

export const PATHS = {
  HOME: {
    link: "/",
    roles: [...Object.values(UserRoles), GUEST_ROLE],
  },
  AUTH: {
    link: "/auth",
    roles: [GUEST_ROLE],
  },
  COURSES: {
    link: "/courses",
    roles: [...Object.values(UserRoles), GUEST_ROLE],
  },
  MY_COURSES: {
    link: "/courses/my",
    roles: [UserRoles.TEACHER, UserRoles.STUDENT],
  },
  COURSE: {
    link: "/courses/:courseId",
    roles: [...Object.values(UserRoles), GUEST_ROLE],
  },
  EDIT_COURSE: {
    link: "edit",
    roles: [UserRoles.TEACHER],
  },
  DELETE_COURSE: {
    link: "delete",
    roles: [UserRoles.TEACHER],
  },
  NEW_COURSE: {
    link: "new",
    roles: [UserRoles.TEACHER],
  },
  STUDENTS: {
    link: "students",
    roles: [UserRoles.TEACHER],
  },
  LOGOUT: {
    link: "logout",
    roles: Object.values(UserRoles),
  },
  NOT_FOUND: {
    link: "*",
    roles: [],
  },
} as const;

export const ROLE_PATHS = Object.entries(PATHS).reduce(
  (acc, [pathName, { link, roles }]) => {
    roles.forEach((role) => {
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(link);
    });
    return acc;
  },
  {} as Record<string, string[]>
);
