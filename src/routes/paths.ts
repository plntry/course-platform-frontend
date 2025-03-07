import { GUEST_ROLE, UserRoles } from "../models/User";

export const PATHS = {
  HOME: {
    link: "/",
    roles: [...Object.values(UserRoles), GUEST_ROLE],
  },
  AUTH: {
    link: "/auth",
    roles: [...Object.values(UserRoles), GUEST_ROLE],
  },
  COURSES: {
    link: "courses",
    roles: [...Object.values(UserRoles), GUEST_ROLE],
  },
  COURSE: {
    link: "courses/:courseId",
    roles: [...Object.values(UserRoles), GUEST_ROLE],
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
