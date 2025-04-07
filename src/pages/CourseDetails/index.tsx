import { useEffect, useState } from "react";
import { useRouteLoaderData, useNavigate, Params } from "react-router";
import {
  Typography,
  Divider,
  Row,
  Col,
  Flex,
  theme,
  Tag,
  Rate,
  notification,
  Button,
  Modal,
} from "antd";
import { userAvailableCourseActionsByPage } from "../../constants/availableCourseActions";
import { GetCourse, CourseActionConfig, CoursePage } from "../../models/Course";
import CourseActionsComp from "../../components/CourseActions";
import { coursesApi } from "../../api/courses";
import { PATHS } from "../../routes/paths";
import { useAuthStore } from "../../store/useAuthStore";
import { GUEST_ROLE, UserRoles } from "../../models/User";
import { getCategoryColor } from "../../utils/courseUtils";
import { useWebSocket, WebSocketMessage } from "../../services/websocket";
import { APIError } from "../../models/APIResponse";
import CommentsList from "../../components/CommentsList";
const { Title, Paragraph, Text } = Typography;

const CourseDetails: React.FC = () => {
  const navigate = useNavigate();
  const {
    token: { colorPrimaryActive, colorTextSecondary, colorTextBase },
  } = theme.useToken();
  const [api, contextHolder] = notification.useNotification();
  const role = useAuthStore((state) => state.user?.role) || GUEST_ROLE;

  const availableActions: CourseActionConfig[] =
    userAvailableCourseActionsByPage[CoursePage.CourseDetails][role];

  const course: GetCourse | undefined = useRouteLoaderData("courseDetails");
  if (!course) {
    navigate(PATHS.HOME.link);
    return null;
  }

  const [courseRating, setCourseRating] = useState<number>(course.rating);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [tempRating, setTempRating] = useState<number>(0);

  // Handler for incoming WebSocket messages
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.event === "rating_updated" && message.course_id === course.id) {
      setCourseRating(message.new_rating || courseRating);
    }
    console.log("Received message:", message);
  };

  const { joinRoom, leaveRoom } = useWebSocket(handleWebSocketMessage);

  useEffect(() => {
    joinRoom(`course_${course.id}`);
    return () => {
      leaveRoom(`course_${course.id}`);
    };
  }, [course.id, joinRoom, leaveRoom]);

  const handleRatingChange = async (value: number) => {
    try {
      await coursesApi.rate(course.id.toString(), value);
    } catch (error: any) {
      const errorDetail = (error?.response?.data as APIError)?.detail;

      const errorDescription =
        Array.isArray(errorDetail) &&
        typeof errorDetail[0] === "object" &&
        "msg" in errorDetail[0]
          ? errorDetail[0].msg
          : typeof errorDetail === "string"
          ? errorDetail
          : "Failed to update rating";
      api.error({
        message: "Error updating rating",
        description: errorDescription,
        placement: "topRight",
      });
      console.error("Error updating rating:", error);
    }
  };

  const handleRatingModalOk = async () => {
    await handleRatingChange(tempRating);
    setIsRatingModalOpen(false);
    setTempRating(0);
  };

  const handleRatingModalCancel = () => {
    setTempRating(courseRating);
    setIsRatingModalOpen(false);
    setTempRating(0);
  };

  return (
    <>
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

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text
                strong
                style={{ fontSize: "16px", color: colorPrimaryActive }}
              >
                Lessons Count:
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
                Lessons Duration:
              </Text>
              <Paragraph style={{ fontSize: "16px", color: colorTextBase }}>
                {course.lessons_duration}{" "}
                {course.lessons_duration <= 1 ? "hour" : "hours"}
              </Paragraph>
            </Col>
          </Row>

          <Divider />

          <Flex vertical justify="center" align="center" gap={10}>
            <Text
              strong
              style={{ fontSize: "16px", color: colorPrimaryActive }}
            >
              Course Rating:
            </Text>
            <Rate allowHalf value={courseRating} disabled />
            {role === UserRoles.STUDENT && (
              <Button onClick={() => setIsRatingModalOpen(true)}>
                Rate this course
              </Button>
            )}
          </Flex>

          <Modal
            title="Rate this course"
            open={isRatingModalOpen}
            onOk={handleRatingModalOk}
            onCancel={handleRatingModalCancel}
            okText="Submit"
            cancelText="Cancel"
          >
            <Flex vertical align="center" gap={20}>
              <Rate allowHalf value={tempRating} onChange={setTempRating} />
            </Flex>
          </Modal>

          <Divider />

          <CourseActionsComp course={course} actions={availableActions} />
        </Flex>
        <CommentsList />
        {contextHolder}
      </Flex>
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
