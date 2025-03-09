import { PATHS } from "./paths";
import Home from "../pages/Home";
import AuthPage from "../pages/AuthPage";
import ErrorPage from "../pages/ErrorPage";
import { rootLoader } from "../utils/authUtils";
import { action as logoutAction } from "../pages/Logout";
import RootLayout from "../pages/RootLayout";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";
import Courses, { loader as coursesLoader } from "../pages/Courses";
import CourseDetails, {
  loader as courseDetailsLoader,
} from "../pages/CourseDetails";
import NewCoursePage from "../pages/NewCourse";
import CoursesLayout from "../pages/CoursesLayout";

export const routes = [
  {
    id: "root",
    path: PATHS.HOME.link,
    element: <RootLayout />,
    loader: rootLoader,
    HydrateFallback: Loader,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        id: "coursesRoot",
        path: PATHS.COURSES.link,
        element: <CoursesLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute allowedRoles={[...PATHS.COURSES.roles]}>
                <Courses />
              </ProtectedRoute>
            ),
            loader: coursesLoader,
          },
          {
            id: "courseDetails",
            path: PATHS.COURSE.link,
            element: (
              <ProtectedRoute allowedRoles={[...PATHS.COURSE.roles]}>
                <CourseDetails />
              </ProtectedRoute>
            ),
            loader: courseDetailsLoader,
          },
          {
            path: PATHS.NEW_COURSE.link,
            element: (
              <ProtectedRoute allowedRoles={[...PATHS.NEW_COURSE.roles]}>
                <NewCoursePage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: PATHS.LOGOUT.link,
        element: <ProtectedRoute allowedRoles={[...PATHS.LOGOUT.roles]} />,
        children: [{ index: true }],
        action: logoutAction,
      },
      {
        path: PATHS.NOT_FOUND.link,
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: PATHS.AUTH.link,
    element: <ProtectedRoute allowedRoles={[...PATHS.AUTH.roles]} />,
    children: [{ index: true, element: <AuthPage /> }],
  },
];
