import {
  useLoaderData,
  Params,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import { Typography, Divider, Row, Col, Flex, theme, Tag, Rate } from "antd";
import { userAvailableCourseActionsByPage } from "../../constants/availableCourseActions";
import { GetCourse, CourseActionConfig, CoursePage } from "../../models/Course";
import CourseActionsComp from "../../components/CourseActions";
import { coursesApi } from "../../api/courses";
import { PATHS } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE } from "../../models/User";
import { getCategoryColor } from "../../utils/courseUtils";

const { Title, Paragraph, Text } = Typography;

const CourseDetails: React.FC = () => {
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;
  const navigate = useNavigate();
  const {
    token: { colorPrimaryActive, colorTextSecondary, colorTextBase },
  } = theme.useToken();

  const availableActions: CourseActionConfig[] =
    userAvailableCourseActionsByPage[CoursePage.CourseDetails][role];

  const course: GetCourse | undefined = useRouteLoaderData("courseDetails");
  if (!course) {
    navigate(PATHS.HOME.link);
  }

  return (
    <>
      {course && (
        <Flex vertical gap={20} style={{ height: "100%" }}>
          <Flex
            vertical
            gap={25}
            style={{
              maxWidth: "1200px",
              margin: "auto",
              height: "100%",
            }}
          >
            <Flex vertical align="center" gap={0}>
              <Title level={2} style={{ color: colorPrimaryActive }}>
                {course.title}
              </Title>
              <Tag
                style={{ margin: 0 }}
                color={getCategoryColor(course.category)}
              >
                {course.category}
              </Tag>
            </Flex>

            <Paragraph
              style={{
                fontSize: "18px",
                color: colorTextSecondary,
                lineHeight: "1.8",
                textAlign: "justify",
                margin: "0",
              }}
            >
              {course.description}
            </Paragraph>

            <Flex justify="center" gap={5} wrap>
              <Text
                strong
                style={{ fontSize: "16px", color: colorPrimaryActive }}
              >
                Teacher:
              </Text>
              <Paragraph style={{ fontSize: "16px", color: colorTextBase }}>
                {course.teacher.first_name} {course.teacher.last_name}
              </Paragraph>
            </Flex>

            <Rate disabled allowHalf defaultValue={course.rating} />

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text
                  strong
                  style={{ fontSize: "16px", color: colorPrimaryActive }}
                >
                  Lessons Count:{" "}
                </Text>
                <Paragraph style={{ fontSize: "16px", color: colorTextBase }}>
                  {course.lessons_count}
                </Paragraph>
              </Col>
              <Col span={12}>
                <Text
                  strong
                  style={{ fontSize: "16px", color: colorPrimaryActive }}
                >
                  Lessons Duration:{" "}
                </Text>
                <Paragraph style={{ fontSize: "16px", color: colorTextBase }}>
                  {course.lessons_duration}{" "}
                  {course.lessons_duration <= 1 ? "hour" : "hours"}
                </Paragraph>
              </Col>
            </Row>
            <CourseActionsComp course={course} actions={availableActions} />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default CourseDetails;

export async function loader({ params }: { params: Params }) {
  const response = await coursesApi.getById(params.courseId || "");
  if (response.status === 200) {
    return response.data;
  }

  return null;
}
